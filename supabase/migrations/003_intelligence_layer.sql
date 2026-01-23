-- CropIQ Advanced Intelligence Layer
-- Enhanced schema for predictive analytics and early-warning systems

-- Add new tables for advanced intelligence

-- Risk prediction models
CREATE TABLE public.risk_predictions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crop_cycle_id UUID REFERENCES public.crop_cycles(id) ON DELETE CASCADE,
    risk_type VARCHAR(50) NOT NULL CHECK (risk_type IN ('disease', 'pest', 'nutrient_deficiency', 'water_stress', 'heat_stress', 'cold_stress', 'flood_risk', 'drought_risk')),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    probability DECIMAL(3,2) CHECK (probability BETWEEN 0 AND 1),
    time_to_impact_days INTEGER,
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    affected_area_percentage DECIMAL(5,2),
    economic_impact_estimate DECIMAL(10,2), -- in local currency
    prevention_cost_estimate DECIMAL(10,2),
    predicted_loss_if_ignored DECIMAL(10,2),
    mitigation_strategies JSONB,
    contributing_factors JSONB,
    prediction_model_version VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Area-level intelligence
CREATE TABLE public.area_intelligence (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL,
    area_type VARCHAR(20) DEFAULT 'district' CHECK (area_type IN ('village', 'block', 'district', 'state')),
    center_lat DECIMAL(10,8) NOT NULL,
    center_lng DECIMAL(11,8) NOT NULL,
    radius_km DECIMAL(6,2) DEFAULT 10,
    total_farms INTEGER DEFAULT 0,
    active_crop_cycles INTEGER DEFAULT 0,
    dominant_crop_type crop_type,
    regional_risks JSONB,
    weather_anomalies JSONB,
    pest_disease_alerts JSONB,
    market_trends JSONB,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seasonal comparison data
CREATE TABLE public.seasonal_comparisons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crop_cycle_id UUID REFERENCES public.crop_cycles(id) ON DELETE CASCADE,
    comparison_season VARCHAR(20) NOT NULL, -- 'current', 'previous_1', 'previous_2', etc.
    season_year INTEGER NOT NULL,
    rainfall_deviation_percent DECIMAL(5,2),
    temperature_deviation_percent DECIMAL(5,2),
    humidity_deviation_percent DECIMAL(5,2),
    planting_date_deviation_days INTEGER,
    growth_stage_deviation_days INTEGER,
    yield_deviation_percent DECIMAL(5,2),
    key_differences JSONB,
    recommendations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wrong decision warnings
CREATE TABLE public.decision_warnings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    warning_type VARCHAR(50) NOT NULL CHECK (warning_type IN ('crop_rotation_risk', 'input_timing_risk', 'variety_mismatch', 'climate_adaptation_risk', 'market_timing_risk')),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    current_decision JSONB NOT NULL,
    recommended_alternative JSONB,
    reasoning JSONB,
    historical_evidence JSONB,
    potential_loss_estimate DECIMAL(10,2),
    confidence_score DECIMAL(3,2),
    is_acknowledged BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Harvest timing optimization
CREATE TABLE public.harvest_timing_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crop_cycle_id UUID REFERENCES public.crop_cycles(id) ON DELETE CASCADE,
    analysis_date DATE NOT NULL,
    optimal_harvest_date DATE,
    current_maturity_stage VARCHAR(50),
    maturity_percentage DECIMAL(5,2),
    weather_window_analysis JSONB,
    quality_risk_if_early JSONB,
    quality_risk_if_late JSONB,
    price_impact_analysis JSONB,
    recommended_action VARCHAR(100),
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Economic impact calculations
CREATE TABLE public.economic_impacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    advisory_id UUID REFERENCES public.advisories(id) ON DELETE CASCADE,
    risk_prediction_id UUID REFERENCES public.risk_predictions(id) ON DELETE CASCADE,
    scenario_type VARCHAR(20) NOT NULL CHECK (scenario_type IN ('action_taken', 'action_delayed', 'action_ignored')),
    estimated_cost DECIMAL(10,2),
    estimated_loss_prevented DECIMAL(10,2),
    roi_percentage DECIMAL(5,2),
    time_to_benefit_days INTEGER,
    confidence_level VARCHAR(20),
    calculation_method JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community intelligence alerts
CREATE TABLE public.community_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    area_intelligence_id UUID REFERENCES public.area_intelligence(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('pest_outbreak', 'disease_spread', 'weather_extreme', 'market_opportunity', 'input_shortage')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    affected_radius_km DECIMAL(6,2),
    description TEXT NOT NULL,
    immediate_actions JSONB,
    preventive_measures JSONB,
    affected_farms_count INTEGER DEFAULT 0,
    source_farm_id UUID REFERENCES public.profiles(id), -- anonymized in queries
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_risk_predictions_crop_cycle ON public.risk_predictions(crop_cycle_id);
CREATE INDEX idx_risk_predictions_risk_type ON public.risk_predictions(risk_type);
CREATE INDEX idx_risk_predictions_created_at ON public.risk_predictions(created_at);
CREATE INDEX idx_area_intelligence_location ON public.area_intelligence USING GIST (point(center_lng, center_lat));
CREATE INDEX idx_seasonal_comparisons_crop_cycle ON public.seasonal_comparisons(crop_cycle_id);
CREATE INDEX idx_decision_warnings_farmer ON public.decision_warnings(farmer_id);
CREATE INDEX idx_harvest_timing_crop_cycle ON public.harvest_timing_analysis(crop_cycle_id);
CREATE INDEX idx_community_alerts_area ON public.community_alerts(area_intelligence_id);
CREATE INDEX idx_community_alerts_active ON public.community_alerts(is_active) WHERE is_active = TRUE;

-- Enable Row Level Security
ALTER TABLE public.risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harvest_timing_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.economic_impacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own risk predictions" ON public.risk_predictions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.crop_cycles cc
            WHERE cc.id = risk_predictions.crop_cycle_id AND cc.farmer_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own seasonal comparisons" ON public.seasonal_comparisons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.crop_cycles cc
            WHERE cc.id = seasonal_comparisons.crop_cycle_id AND cc.farmer_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own decision warnings" ON public.decision_warnings
    FOR SELECT USING (farmer_id = auth.uid());

CREATE POLICY "Users can view own harvest analysis" ON public.harvest_timing_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.crop_cycles cc
            WHERE cc.id = harvest_timing_analysis.crop_cycle_id AND cc.farmer_id = auth.uid()
        )
    );

-- Advanced intelligence functions

CREATE OR REPLACE FUNCTION public.calculate_risk_probability(
    p_crop_cycle_id UUID,
    p_risk_type VARCHAR(50)
)
RETURNS TABLE (
    probability DECIMAL,
    confidence_score DECIMAL,
    time_to_impact_days INTEGER,
    economic_impact DECIMAL
) AS $$
DECLARE
    crop_record RECORD;
    weather_data RECORD;
    historical_data RECORD;
    area_data RECORD;
BEGIN
    -- Get crop cycle details
    SELECT * INTO crop_record FROM public.crop_cycles WHERE id = p_crop_cycle_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Get recent weather data
    SELECT * INTO weather_data FROM public.weather_data
    WHERE location_lat = crop_record.location_lat
    AND location_lng = crop_record.location_lng
    AND date >= CURRENT_DATE - INTERVAL '7 days'
    ORDER BY date DESC
    LIMIT 1;
    
    -- Calculate probability based on risk type
    CASE p_risk_type
        WHEN 'disease' THEN
            -- Disease probability based on humidity, temperature, and rainfall
            RETURN QUERY SELECT 
                CASE 
                    WHEN weather_data.humidity > 80 AND weather_data.temperature_max BETWEEN 25 AND 30 THEN 0.85
                    WHEN weather_data.humidity > 70 AND weather_data.temperature_max BETWEEN 20 AND 35 THEN 0.65
                    ELSE 0.35
                END as probability,
                0.75 as confidence_score,
                CASE 
                    WHEN weather_data.humidity > 80 THEN 3
                    ELSE 7
                END as time_to_impact_days,
                CASE 
                    WHEN weather_data.humidity > 80 THEN crop_record.field_size_acres * 5000
                    ELSE crop_record.field_size_acres * 2000
                END as economic_impact;
                
        WHEN 'water_stress' THEN
            -- Water stress based on rainfall and temperature
            RETURN QUERY SELECT 
                CASE 
                    WHEN weather_data.rainfall_mm < 2 AND weather_data.temperature_max > 35 THEN 0.90
                    WHEN weather_data.rainfall_mm < 5 AND weather_data.temperature_max > 32 THEN 0.70
                    ELSE 0.30
                END as probability,
                0.80 as confidence_score,
                5 as time_to_impact_days,
                CASE 
                    WHEN weather_data.rainfall_mm < 2 AND weather_data.temperature_max > 35 THEN crop_record.field_size_acres * 8000
                    ELSE crop_record.field_size_acres * 3000
                END as economic_impact;
                
        WHEN 'heat_stress' THEN
            -- Heat stress based on temperature
            RETURN QUERY SELECT 
                CASE 
                    WHEN weather_data.temperature_max > 40 THEN 0.95
                    WHEN weather_data.temperature_max > 37 THEN 0.75
                    WHEN weather_data.temperature_max > 34 THEN 0.50
                    ELSE 0.20
                END as probability,
                0.85 as confidence_score,
                2 as time_to_impact_days,
                CASE 
                    WHEN weather_data.temperature_max > 40 THEN crop_record.field_size_acres * 6000
                    WHEN weather_data.temperature_max > 37 THEN crop_record.field_size_acres * 3500
                    ELSE crop_record.field_size_acres * 1500
                END as economic_impact;
                
        WHEN 'nutrient_deficiency' THEN
            -- Nutrient deficiency based on growth stage and weather
            RETURN QUERY SELECT 
                CASE 
                    WHEN crop_record.current_stage = 'flowering' THEN 0.60
                    WHEN crop_record.current_stage = 'fruiting' THEN 0.70
                    ELSE 0.40
                END as probability,
                0.65 as confidence_score,
                10 as time_to_impact_days,
                crop_record.field_size_acres * 2500 as economic_impact;
                
        ELSE
            -- Default risk calculation
            RETURN QUERY SELECT 
                0.30 as probability,
                0.50 as confidence_score,
                7 as time_to_impact_days,
                crop_record.field_size_acres * 2000 as economic_impact;
    END CASE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.generate_area_intelligence(
    p_center_lat DECIMAL,
    p_center_lng DECIMAL,
    p_radius_km DECIMAL DEFAULT 10
)
RETURNS VOID AS $$
DECLARE
    area_farms INTEGER;
    active_crops INTEGER;
    dominant_crop crop_type;
    regional_risks JSONB;
BEGIN
    -- Count farms in area
    SELECT COUNT(DISTINCT cc.farmer_id), COUNT(cc.id)
    INTO area_farms, active_crops
    FROM public.crop_cycles cc
    JOIN public.profiles p ON cc.farmer_id = p.id
    WHERE cc.status = 'active'
    AND p.location_lat BETWEEN p_center_lat - (p_radius_km / 111)
    AND p_center_lat + (p_radius_km / 111)
    AND p.location_lng BETWEEN p_center_lng - (p_radius_km / (111 * COS(RADIANS(p_center_lat))))
    AND p_center_lng + (p_radius_km / (111 * COS(RADIANS(p_center_lat))));
    
    -- Find dominant crop
    SELECT crop_type INTO dominant_crop
    FROM public.crop_cycles cc
    JOIN public.profiles p ON cc.farmer_id = p.id
    WHERE cc.status = 'active'
    AND p.location_lat BETWEEN p_center_lat - (p_radius_km / 111)
    AND p_center_lat + (p_radius_km / 111)
    AND p.location_lng BETWEEN p_center_lng - (p_radius_km / (111 * COS(RADIANS(p_center_lat))))
    AND p.location_lng + (p_radius_km / (111 * COS(RADIANS(p_center_lat))))
    GROUP BY crop_type
    ORDER BY COUNT(*) DESC
    LIMIT 1;
    
    -- Generate regional risks
    regional_risks := json_build_object(
        'disease_pressure', calculate_area_disease_pressure(p_center_lat, p_center_lng, p_radius_km),
        'pest_activity', calculate_area_pest_activity(p_center_lat, p_center_lng, p_radius_km),
        'weather_stress', calculate_area_weather_stress(p_center_lat, p_center_lng, p_radius_km)
    );
    
    -- Update or insert area intelligence
    INSERT INTO public.area_intelligence (
        center_lat, center_lng, radius_km, total_farms, active_crop_cycles,
        dominant_crop_type, regional_risks, last_updated
    ) VALUES (
        p_center_lat, p_center_lng, p_radius_km, area_farms, active_crops,
        dominant_crop, regional_risks, NOW()
    )
    ON CONFLICT (center_lat, center_lng, radius_km) DO UPDATE SET
        total_farms = EXCLUDED.total_farms,
        active_crop_cycles = EXCLUDED.active_crop_cycles,
        dominant_crop_type = EXCLUDED.dominant_crop_type,
        regional_risks = EXCLUDED.regional_risks,
        last_updated = EXCLUDED.last_updated;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.calculate_area_disease_pressure(
    p_lat DECIMAL,
    p_lng DECIMAL,
    p_radius_km DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    avg_humidity DECIMAL;
    avg_temp DECIMAL;
    total_rainfall DECIMAL;
    disease_pressure DECIMAL;
BEGIN
    -- Get average weather conditions for the area
    SELECT AVG(humidity), AVG(temperature_max), SUM(rainfall_mm)
    INTO avg_humidity, avg_temp, total_rainfall
    FROM public.weather_data
    WHERE date >= CURRENT_DATE - INTERVAL '7 days'
    AND location_lat BETWEEN p_lat - (p_radius_km / 111)
    AND p_lat + (p_radius_km / 111)
    AND location_lng BETWEEN p_lng - (p_radius_km / (111 * COS(RADIANS(p_lat))))
    AND p_lng + (p_radius_km / (111 * COS(RADIANS(p_lat))));
    
    -- Calculate disease pressure index
    disease_pressure := 
        CASE 
            WHEN avg_humidity > 80 AND avg_temp BETWEEN 25 AND 30 AND total_rainfall > 20 THEN 0.90
            WHEN avg_humidity > 70 AND avg_temp BETWEEN 20 AND 35 AND total_rainfall > 10 THEN 0.70
            WHEN avg_humidity > 60 AND avg_temp BETWEEN 22 AND 32 THEN 0.50
            ELSE 0.30
        END;
    
    RETURN disease_pressure;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.calculate_area_pest_activity(
    p_lat DECIMAL,
    p_lng DECIMAL,
    p_radius_km DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    avg_temp DECIMAL;
    pest_activity DECIMAL;
BEGIN
    -- Get average temperature
    SELECT AVG(temperature_max)
    INTO avg_temp
    FROM public.weather_data
    WHERE date >= CURRENT_DATE - INTERVAL '7 days'
    AND location_lat BETWEEN p_lat - (p_radius_km / 111)
    AND p_lat + (p_radius_km / 111)
    AND location_lng BETWEEN p_lng - (p_radius_km / (111 * COS(RADIANS(p_lat))))
    AND p_lng + (p_radius_km / (111 * COS(RADIANS(p_lat))));
    
    -- Calculate pest activity index
    pest_activity := 
        CASE 
            WHEN avg_temp > 30 THEN 0.85
            WHEN avg_temp > 25 THEN 0.65
            WHEN avg_temp > 20 THEN 0.45
            ELSE 0.25
        END;
    
    RETURN pest_activity;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.calculate_area_weather_stress(
    p_lat DECIMAL,
    p_lng DECIMAL,
    p_radius_km DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    max_temp DECIMAL;
    min_rainfall DECIMAL;
    weather_stress DECIMAL;
BEGIN
    -- Get extreme weather conditions
    SELECT MAX(temperature_max), MIN(rainfall_mm)
    INTO max_temp, min_rainfall
    FROM public.weather_data
    WHERE date >= CURRENT_DATE - INTERVAL '7 days'
    AND location_lat BETWEEN p_lat - (p_radius_km / 111)
    AND p_lat + (p_radius_km / 111)
    AND location_lng BETWEEN p_lng - (p_radius_km / (111 * COS(RADIANS(p_lat))))
    AND p_lng + (p_radius_km / (111 * COS(RADIANS(p_lat))));
    
    -- Calculate weather stress index
    weather_stress := 
        CASE 
            WHEN max_temp > 40 OR min_rainfall < 1 THEN 0.95
            WHEN max_temp > 37 OR min_rainfall < 3 THEN 0.75
            WHEN max_temp > 34 OR min_rainfall < 5 THEN 0.55
            ELSE 0.25
        END;
    
    RETURN weather_stress;
END;
$$ LANGUAGE plpgsql;

-- Function to generate wrong decision warnings
CREATE OR REPLACE FUNCTION public.generate_decision_warnings(
    p_farmer_id UUID
)
RETURNS VOID AS $$
DECLARE
    farmer_record RECORD;
    recent_crops RECORD;
    warning_exists BOOLEAN;
BEGIN
    -- Get farmer profile and recent crops
    SELECT * INTO farmer_record FROM public.profiles WHERE id = p_farmer_id;
    
    -- Check for crop rotation risks
    FOR recent_crops IN 
        SELECT crop_type, COUNT(*) as consecutive_count
        FROM public.crop_cycles
        WHERE farmer_id = p_farmer_id
        AND status = 'completed'
        AND created_at >= CURRENT_DATE - INTERVAL '3 years'
        GROUP BY crop_type
        HAVING COUNT(*) >= 2
    LOOP
        -- Check if warning already exists
        SELECT EXISTS(
            SELECT 1 FROM public.decision_warnings
            WHERE farmer_id = p_farmer_id
            AND warning_type = 'crop_rotation_risk'
            AND is_acknowledged = FALSE
            AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        ) INTO warning_exists;
        
        IF NOT warning_exists THEN
            INSERT INTO public.decision_warnings (
                farmer_id, warning_type, risk_level, current_decision,
                recommended_alternative, reasoning, historical_evidence,
                potential_loss_estimate, confidence_score
            ) VALUES (
                p_farmer_id,
                'crop_rotation_risk',
                'medium',
                json_build_object('crop', recent_crops.crop_type, 'consecutive_seasons', recent_crops.consecutive_count),
                json_build_object('recommended_crops', ARRAY['legumes', 'oilseeds'], 'rotation_benefits', 'soil_health_improvement'),
                json_build_object('reason', 'Continuous same crop planting depletes specific nutrients and increases pest pressure'),
                json_build_object('historical_data', 'Similar patterns show 15-20% yield reduction after 3 consecutive seasons'),
                farmer_record.farm_size_acres * 3000,
                0.75
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to optimize harvest timing
CREATE OR REPLACE FUNCTION public.optimize_harvest_timing(
    p_crop_cycle_id UUID
)
RETURNS TABLE (
    optimal_date DATE,
    current_maturity VARCHAR,
    maturity_percentage DECIMAL,
    early_harvest_risk JSONB,
    late_harvest_risk JSONB,
    confidence_score DECIMAL
) AS $$
DECLARE
    crop_record RECORD;
    days_since_sowing INTEGER;
    maturity_pct DECIMAL;
    optimal_date DATE;
    weather_forecast RECORD;
BEGIN
    -- Get crop cycle details
    SELECT * INTO crop_record FROM public.crop_cycles WHERE id = p_crop_cycle_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Calculate days since sowing and maturity percentage
    days_since_sowing := CURRENT_DATE - crop_record.sowing_date;
    
    -- Calculate maturity based on crop type and days
    maturity_pct := CASE crop_record.crop_type
        WHEN 'rice' THEN LEAST(100, (days_since_sowing::DECIMAL / 120) * 100)
        WHEN 'wheat' THEN LEAST(100, (days_since_sowing::DECIMAL / 110) * 100)
        WHEN 'cotton' THEN LEAST(100, (days_since_sowing::DECIMAL / 160) * 100)
        WHEN 'maize' THEN LEAST(100, (days_since_sowing::DECIMAL / 90) * 100)
        ELSE LEAST(100, (days_since_sowing::DECIMAL / 100) * 100)
    END;
    
    -- Calculate optimal harvest date
    optimal_date := crop_record.sowing_date + CASE crop_record.crop_type
        WHEN 'rice' THEN 120
        WHEN 'wheat' THEN 110
        WHEN 'cotton' THEN 160
        WHEN 'maize' THEN 90
        ELSE 100
    END;
    
    -- Get weather forecast
    SELECT * INTO weather_forecast FROM public.weather_data
    WHERE location_lat = crop_record.location_lat
    AND location_lng = crop_record.location_lng
    AND date >= CURRENT_DATE
    ORDER BY date
    LIMIT 7;
    
    RETURN QUERY SELECT 
        optimal_date,
        CASE 
            WHEN maturity_pct < 60 THEN 'early_vegetative'
            WHEN maturity_pct < 80 THEN 'mid_growth'
            WHEN maturity_pct < 95 THEN 'late_growth'
            ELSE 'mature'
        END as current_maturity,
        maturity_pct as maturity_percentage,
        json_build_object(
            'yield_loss_percent', CASE WHEN maturity_pct < 85 THEN 15 + (85 - maturity_pct) ELSE 5 END,
            'quality_impact', 'reduced_grain_quality and market price',
            'estimated_loss', crop_record.field_size_acres * 2000 * (CASE WHEN maturity_pct < 85 THEN (85 - maturity_pct) / 100 ELSE 0.05 END)
        ) as early_harvest_risk,
        json_build_object(
            'yield_loss_percent', CASE WHEN maturity_pct > 105 THEN 10 + (maturity_pct - 105) ELSE 3 END,
            'quality_impact', 'lodging risk, grain shattering, reduced market value',
            'estimated_loss', crop_record.field_size_acres * 1500 * (CASE WHEN maturity_pct > 105 THEN (maturity_pct - 105) / 100 ELSE 0.03 END)
        ) as late_harvest_risk,
        CASE 
            WHEN maturity_pct BETWEEN 90 AND 105 THEN 0.90
            WHEN maturity_pct BETWEEN 85 AND 110 THEN 0.75
            ELSE 0.60
        END as confidence_score;
END;
$$ LANGUAGE plpgsql;
