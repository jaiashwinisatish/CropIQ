-- CropIQ Seed Data
-- Initial data for testing and development

-- Insert sample market prices
INSERT INTO public.market_prices (crop_type, market_name, district, state, price_per_quintal, price_change_percent, date) VALUES
('rice', 'Mandi Market', 'Punjab', 'Punjab', 2200.50, 2.5, CURRENT_DATE - INTERVAL '1 day'),
('wheat', 'Grain Market', 'Haryana', 'Haryana', 2100.00, -1.2, CURRENT_DATE - INTERVAL '1 day'),
('cotton', 'Cotton Market', 'Gujarat', 'Gujarat', 6500.00, 5.8, CURRENT_DATE - INTERVAL '1 day'),
('sugarcane', 'Sugar Market', 'Uttar Pradesh', 'Uttar Pradesh', 320.00, 0.0, CURRENT_DATE - INTERVAL '1 day'),
('maize', 'Grain Market', 'Karnataka', 'Karnataka', 1800.00, 3.2, CURRENT_DATE - INTERVAL '1 day'),
('pulses', 'Pulse Market', 'Madhya Pradesh', 'Madhya Pradesh', 4500.00, -2.1, CURRENT_DATE - INTERVAL '1 day');

-- Insert sample crop recommendations data
INSERT INTO public.crop_recommendations (
    farmer_id, recommended_crop, suitability_score, 
    expected_yield_range_min, expected_yield_range_max,
    estimated_cost_per_acre, estimated_profit_range_min, estimated_profit_range_max,
    risk_factors, market_outlook, season
) VALUES
-- These will be updated with actual farmer IDs when users are created
(
    (SELECT id FROM public.profiles LIMIT 1), 
    'rice', 0.85, 2.5, 3.2, 15000, 8000, 15000,
    '{"flood_risk": "low", "pest_risk": "medium"}',
    'Stable prices expected due to government procurement',
    'Kharif'
),
(
    (SELECT id FROM public.profiles LIMIT 1), 
    'wheat', 0.78, 2.8, 3.5, 12000, 10000, 18000,
    '{"frost_risk": "low", "drought_risk": "medium"}',
    'Good market outlook with increasing demand',
    'Rabi'
);

-- Create sample admin user (this would be created through auth signup)
-- Note: This is just a placeholder - actual users need to be created through auth

-- Insert sample weather data for testing
INSERT INTO public.weather_data (
    location_lat, location_lng, date, temperature_min, temperature_max,
    humidity, rainfall_mm, wind_speed, weather_condition, forecast_data,
    expires_at
) VALUES
(28.6139, 77.2090, CURRENT_DATE, 22.5, 35.2, 65.0, 0.0, 12.5, 'Clear',
 '{"tomorrow": {"temp_min": 23, "temp_max": 36, "condition": "Partly Cloudy"}}',
 CURRENT_DATE + INTERVAL '1 day'),
(28.6139, 77.2090, CURRENT_DATE - INTERVAL '1 day', 21.0, 34.8, 68.0, 2.5, 10.2, 'Partly Cloudy',
 NULL, CURRENT_DATE - INTERVAL '1 day'),
(19.0760, 72.8777, CURRENT_DATE, 24.5, 32.8, 75.0, 0.0, 15.2, 'Humid',
 '{"tomorrow": {"temp_min": 25, "temp_max": 33, "condition": "Humid"}}',
 CURRENT_DATE + INTERVAL '1 day');

-- Create function to generate sample advisories
CREATE OR REPLACE FUNCTION public.generate_sample_advisories()
RETURNS void AS $$
DECLARE
    sample_cycle_id UUID;
BEGIN
    -- Get a sample crop cycle
    SELECT id INTO sample_cycle_id FROM public.crop_cycles LIMIT 1;
    
    IF sample_cycle_id IS NOT NULL THEN
        INSERT INTO public.advisories (
            crop_cycle_id, farmer_id, type, title, description, 
            priority, action_required, valid_until
        ) VALUES
        (
            sample_cycle_id,
            (SELECT farmer_id FROM public.crop_cycles WHERE id = sample_cycle_id),
            'irrigation',
            'Irrigation Recommended',
            'Based on current weather conditions and soil moisture levels, 
             light irrigation is recommended for your rice crop. 
             Expected rainfall is low for the next 3 days.',
            'medium',
            true,
            CURRENT_DATE + INTERVAL '3 days'
        ),
        (
            sample_cycle_id,
            (SELECT farmer_id FROM public.crop_cycles WHERE id = sample_cycle_id),
            'fertilizer',
            'Fertilizer Application Time',
            'Your crop is entering the vegetative stage. 
             Apply urea at 40 kg per acre for optimal growth.',
            'high',
            true,
            CURRENT_DATE + INTERVAL '7 days'
        ),
        (
            sample_cycle_id,
            (SELECT farmer_id FROM public.crop_cycles WHERE id = sample_cycle_id),
            'pest_control',
            'Pest Alert: Brown Planthopper',
            'Moderate risk of brown planthopper detected in your area. 
             Monitor your crop regularly and consider preventive measures.',
            'medium',
            false,
            CURRENT_DATE + INTERVAL '10 days'
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate yield predictions
CREATE OR REPLACE FUNCTION public.calculate_yield_prediction(
    p_crop_cycle_id UUID
)
RETURNS void AS $$
DECLARE
    crop_record RECORD;
    base_yield DECIMAL;
    weather_factor DECIMAL;
    final_yield DECIMAL;
BEGIN
    -- Get crop cycle details
    SELECT * INTO crop_record FROM public.crop_cycles WHERE id = p_crop_cycle_id;
    
    IF crop_record.id IS NULL THEN
        RETURN;
    END IF;
    
    -- Base yield by crop type (tons per acre)
    base_yield := CASE crop_record.crop_type
        WHEN 'rice' THEN 2.8
        WHEN 'wheat' THEN 3.0
        WHEN 'cotton' THEN 1.2
        WHEN 'sugarcane' THEN 25.0
        WHEN 'maize' THEN 2.5
        WHEN 'pulses' THEN 1.8
        ELSE 2.0
    END;
    
    -- Weather adjustment factor (simplified)
    weather_factor := 1.0;
    
    -- Insert or update yield prediction
    INSERT INTO public.yield_predictions (
        crop_cycle_id, predicted_yield_tons, confidence_score,
        prediction_date, factors
    ) VALUES (
        p_crop_cycle_id,
        base_yield * weather_factor,
        0.75,
        CURRENT_DATE,
        json_build_object(
            'base_yield', base_yield,
            'weather_factor', weather_factor,
            'crop_type', crop_record.crop_type,
            'field_size', crop_record.field_size_acres
        )
    )
    ON CONFLICT (crop_cycle_id) DO UPDATE SET
        predicted_yield_tons = EXCLUDED.predicted_yield_tons,
        confidence_score = EXCLUDED.confidence_score,
        prediction_date = EXCLUDED.prediction_date,
        factors = EXCLUDED.factors;
END;
$$ LANGUAGE plpgsql;

-- Create view for farmer dashboard summary
CREATE OR REPLACE VIEW public.farmer_dashboard AS
SELECT 
    p.id as farmer_id,
    p.full_name,
    p.location_lat,
    p.location_lng,
    COUNT(DISTINCT cc.id) as active_crops,
    COUNT(DISTINCT a.id) FILTER (WHERE a.is_read = false) as unread_advisories,
    COALESCE(SUM(yp.predicted_yield_tons), 0) as total_predicted_yield,
    MAX(a.created_at) as last_advisory_date
FROM public.profiles p
LEFT JOIN public.crop_cycles cc ON p.id = cc.farmer_id AND cc.status = 'active'
LEFT JOIN public.advisories a ON p.id = a.farmer_id
LEFT JOIN public.yield_predictions yp ON cc.id = yp.crop_cycle_id
WHERE p.role = 'farmer'
GROUP BY p.id, p.full_name, p.location_lat, p.location_lng;

-- Create view for FPO dashboard
CREATE OR REPLACE VIEW public.fpo_dashboard AS
SELECT 
    f.id as fpo_id,
    f.name as fpo_name,
    COUNT(DISTINCT ff.farmer_id) as total_farmers,
    COALESCE(SUM(p.farm_size_acres), 0) as total_area,
    COUNT(DISTINCT cc.id) as active_crops,
    COUNT(DISTINCT a.id) FILTER (WHERE a.is_read = false) as total_unread_advisories,
    COALESCE(SUM(yp.predicted_yield_tons), 0) as total_predicted_yield
FROM public.fpos f
LEFT JOIN public.fpo_farmers ff ON f.id = ff.fpo_id AND ff.is_active = true
LEFT JOIN public.profiles p ON ff.farmer_id = p.id
LEFT JOIN public.crop_cycles cc ON p.id = cc.farmer_id AND cc.status = 'active'
LEFT JOIN public.advisories a ON p.id = a.farmer_id
LEFT JOIN public.yield_predictions yp ON cc.id = yp.crop_cycle_id
GROUP BY f.id, f.name;

-- Grant permissions on views
GRANT SELECT ON public.farmer_dashboard TO authenticated;
GRANT SELECT ON public.fpo_dashboard TO authenticated;

-- Create function to check and update crop growth stages
CREATE OR REPLACE FUNCTION public.update_growth_stages()
RETURNS void AS $$
DECLARE
    cycle_record RECORD;
    days_since_sowing INTEGER;
    new_stage growth_stage;
BEGIN
    FOR cycle_record IN 
        SELECT id, sowing_date, crop_type, current_stage 
        FROM public.crop_cycles 
        WHERE status = 'active'
    LOOP
        days_since_sowing := CURRENT_DATE - cycle_record.sowing_date;
        
        -- Determine new stage based on days since sowing (simplified logic)
        new_stage := CASE
            WHEN days_since_sowing < 10 THEN 'sowing'
            WHEN days_since_sowing < 25 THEN 'germination'
            WHEN days_since_sowing < 60 THEN 'vegetative'
            WHEN days_since_sowing < 90 THEN 'flowering'
            WHEN days_since_sowing < 120 THEN 'fruiting'
            WHEN days_since_sowing < 150 THEN 'harvesting'
            ELSE 'post_harvest'
        END;
        
        -- Update if stage has changed
        IF new_stage != cycle_record.current_stage THEN
            UPDATE public.crop_cycles 
            SET current_stage = new_stage 
            WHERE id = cycle_record.id;
            
            -- Create advisory for stage change
            INSERT INTO public.advisories (
                crop_cycle_id, farmer_id, type, title, description, priority
            ) VALUES (
                cycle_record.id,
                (SELECT farmer_id FROM public.crop_cycles WHERE id = cycle_record.id),
                'general',
                'Growth Stage Updated',
                format('Your %s crop has entered the %s stage. 
                        Follow recommended practices for this stage.', 
                        cycle_record.crop_type, new_stage),
                'medium'
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate weather-based advisories
CREATE OR REPLACE FUNCTION public.generate_weather_advisories()
RETURNS void AS $$
DECLARE
    weather_record RECORD;
    advisory_exists BOOLEAN;
BEGIN
    FOR weather_record IN 
        SELECT DISTINCT ON (location_lat, location_lng) 
            location_lat, location_lng, temperature_max, 
            rainfall_mm, weather_condition, date
        FROM public.weather_data 
        WHERE date >= CURRENT_DATE - INTERVAL '1 day'
        ORDER BY location_lat, location_lng, date DESC
    LOOP
        -- Check for extreme heat advisory
        IF weather_record.temperature_max > 40 THEN
            SELECT EXISTS(
                SELECT 1 FROM public.advisories a
                JOIN public.crop_cycles cc ON a.crop_cycle_id = cc.id
                WHERE cc.location_lat = weather_record.location_lat
                AND cc.location_lng = weather_record.location_lng
                AND a.type = 'weather_warning'
                AND a.created_at > CURRENT_DATE - INTERVAL '1 day'
            ) INTO advisory_exists;
            
            IF NOT advisory_exists THEN
                -- Insert heat advisory for all crops in the area
                INSERT INTO public.advisories (crop_cycle_id, farmer_id, type, title, description, priority)
                SELECT 
                    cc.id, 
                    cc.farmer_id, 
                    'weather_warning',
                    'Extreme Heat Alert',
                    'Temperature above 40°C expected. Ensure adequate irrigation 
                     and consider providing shade to sensitive crops.',
                    'high'
                FROM public.crop_cycles cc
                WHERE cc.location_lat = weather_record.location_lat
                AND cc.location_lng = weather_record.location_lng
                AND cc.status = 'active';
            END IF;
        END IF;
        
        -- Check for rainfall advisory
        IF weather_record.rainfall_mm > 50 THEN
            SELECT EXISTS(
                SELECT 1 FROM public.advisories a
                JOIN public.crop_cycles cc ON a.crop_cycle_id = cc.id
                WHERE cc.location_lat = weather_record.location_lat
                AND cc.location_lng = weather_record.location_lng
                AND a.type = 'weather_warning'
                AND a.title LIKE '%Heavy Rain%'
                AND a.created_at > CURRENT_DATE - INTERVAL '1 day'
            ) INTO advisory_exists;
            
            IF NOT advisory_exists THEN
                INSERT INTO public.advisories (crop_cycle_id, farmer_id, type, title, description, priority)
                SELECT 
                    cc.id, 
                    cc.farmer_id, 
                    'weather_warning',
                    'Heavy Rainfall Alert',
                    'Heavy rainfall expected. Ensure proper drainage 
                     and avoid fertilizer application for the next 3 days.',
                    'high'
                FROM public.crop_cycles cc
                WHERE cc.location_lat = weather_record.location_lat
                AND cc.location_lng = weather_record.location_lng
                AND cc.status = 'active';
            END IF;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
