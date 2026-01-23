-- CropIQ Database Schema
-- Initial migration for smart farming platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User roles enum
CREATE TYPE user_role AS ENUM ('farmer', 'fpo', 'admin');

-- Crop types enum
CREATE TYPE crop_type AS ENUM (
    'rice', 'wheat', 'cotton', 'sugarcane', 'maize', 'pulses', 
    'vegetables', 'fruits', 'spices', 'oilseeds', 'other'
);

-- Crop growth stages
CREATE TYPE growth_stage AS ENUM (
    'sowing', 'germination', 'vegetative', 'flowering', 
    'fruiting', 'harvesting', 'post_harvest'
);

-- Advisory types
CREATE TYPE advisory_type AS ENUM (
    'irrigation', 'fertilizer', 'pest_control', 'disease_alert', 
    'weather_warning', 'harvest_timing', 'market_price', 'general'
);

-- Priority levels
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    full_name TEXT,
    role user_role DEFAULT 'farmer' NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    address TEXT,
    district TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    farm_size_acres DECIMAL(8, 2),
    farming_experience_years INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FPOs table (for Farmer Producer Organizations)
CREATE TABLE public.fpos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    registration_number TEXT UNIQUE,
    contact_person TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    district TEXT,
    state TEXT,
    total_farmers INTEGER DEFAULT 0,
    total_area_acres DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FPO-Farmer relationships
CREATE TABLE public.fpo_farmers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    fpo_id UUID REFERENCES public.fpos(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(fpo_id, farmer_id)
);

-- Crop cycles table
CREATE TABLE public.crop_cycles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    crop_type crop_type NOT NULL,
    crop_variety TEXT,
    sowing_date DATE NOT NULL,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    field_size_acres DECIMAL(8, 2),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    soil_type TEXT,
    irrigation_method TEXT,
    current_stage growth_stage DEFAULT 'sowing',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather data cache
CREATE TABLE public.weather_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    date DATE NOT NULL,
    temperature_min DECIMAL(5, 2),
    temperature_max DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    rainfall_mm DECIMAL(6, 2),
    wind_speed DECIMAL(5, 2),
    weather_condition TEXT,
    forecast_data JSONB,
    source TEXT DEFAULT 'openweather',
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(location_lat, location_lng, date)
);

-- Advisories table
CREATE TABLE public.advisories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crop_cycle_id UUID REFERENCES public.crop_cycles(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type advisory_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority priority_level DEFAULT 'medium',
    action_required BOOLEAN DEFAULT false,
    is_read BOOLEAN DEFAULT false,
    valid_until TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Yield predictions
CREATE TABLE public.yield_predictions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crop_cycle_id UUID REFERENCES public.crop_cycles(id) ON DELETE CASCADE,
    predicted_yield_tons DECIMAL(8, 3),
    confidence_score DECIMAL(3, 2) CHECK (confidence_score BETWEEN 0 AND 1),
    prediction_date DATE NOT NULL,
    factors JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market price data
CREATE TABLE public.market_prices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crop_type crop_type NOT NULL,
    market_name TEXT NOT NULL,
    district TEXT,
    state TEXT,
    price_per_quintal DECIMAL(8, 2),
    price_change_percent DECIMAL(5, 2),
    date DATE NOT NULL,
    source TEXT DEFAULT 'mock',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crop planning recommendations
CREATE TABLE public.crop_recommendations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recommended_crop crop_type NOT NULL,
    suitability_score DECIMAL(3, 2) CHECK (suitability_score BETWEEN 0 AND 1),
    expected_yield_range_min DECIMAL(8, 2),
    expected_yield_range_max DECIMAL(8, 2),
    estimated_cost_per_acre DECIMAL(8, 2),
    estimated_profit_range_min DECIMAL(8, 2),
    estimated_profit_range_max DECIMAL(8, 2),
    risk_factors JSONB,
    market_outlook TEXT,
    season TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage tracking
CREATE TABLE public.api_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System logs
CREATE TABLE public.system_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    level TEXT NOT NULL CHECK (level IN ('error', 'warn', 'info', 'debug')),
    message TEXT NOT NULL,
    context JSONB,
    user_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_location ON public.profiles USING GIST (point(location_lng, location_lat));
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_crop_cycles_farmer ON public.crop_cycles(farmer_id);
CREATE INDEX idx_crop_cycles_active ON public.crop_cycles(status) WHERE status = 'active';
CREATE INDEX idx_weather_data_location_date ON public.weather_data(location_lat, location_lng, date);
CREATE INDEX idx_advisories_farmer_unread ON public.advisories(farmer_id, is_read) WHERE is_read = false;
CREATE INDEX idx_market_prices_crop_date ON public.market_prices(crop_type, date);
CREATE INDEX idx_api_usage_user_date ON public.api_usage(user_id, created_at);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yield_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Crop cycles policies
CREATE POLICY "Farmers can view own crop cycles" ON public.crop_cycles
    FOR SELECT USING (farmer_id = auth.uid());

CREATE POLICY "Farmers can manage own crop cycles" ON public.crop_cycles
    FOR ALL USING (farmer_id = auth.uid());

CREATE POLICY "FPOs can view member crop cycles" ON public.crop_cycles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.fpo_farmers ff
            JOIN public.profiles p ON ff.farmer_id = p.id
            WHERE ff.fpo_id IN (
                SELECT fpo_id FROM public.fpo_farmers 
                WHERE farmer_id = auth.uid()
            ) AND p.id = crop_cycles.farmer_id
        )
    );

CREATE POLICY "Admins can view all crop cycles" ON public.crop_cycles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Advisories policies
CREATE POLICY "Users can view own advisories" ON public.advisories
    FOR SELECT USING (farmer_id = auth.uid());

CREATE POLICY "Users can update own advisories" ON public.advisories
    FOR UPDATE USING (farmer_id = auth.uid());

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_crop_cycles_updated_at
    BEFORE UPDATE ON public.crop_cycles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_fpos_updated_at
    BEFORE UPDATE ON public.fpos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to get user's accessible data
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (SELECT role FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
