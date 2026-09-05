-- ============================================
-- MIGRATION 002: Vehicle Detailing Schema
-- ============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop tables in correct order
DROP TABLE IF EXISTS vehicle_service_exterior_items CASCADE;
DROP TABLE IF EXISTS vehicle_service_interior_items CASCADE;
DROP TABLE IF EXISTS vehicle_add_on_options CASCADE;
DROP TABLE IF EXISTS vehicle_conditions CASCADE;
DROP TABLE IF EXISTS vehicle_arrival_windows CASCADE;
DROP TABLE IF EXISTS vehicle_australian_postcodes CASCADE;
DROP TABLE IF EXISTS vehicle_bookings CASCADE;
DROP TABLE IF EXISTS vehicle_services CASCADE;
DROP TABLE IF EXISTS vehicle_body_types CASCADE;
DROP TABLE IF EXISTS vehicle_models CASCADE;
DROP TABLE IF EXISTS vehicle_brands CASCADE;
DROP TABLE IF EXISTS vehicle_categories CASCADE;

-- 1. VEHICLE CATEGORIES
CREATE TABLE vehicle_categories (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VEHICLE BRANDS
CREATE TABLE vehicle_brands (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category_id TEXT REFERENCES vehicle_categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VEHICLE MODELS
CREATE TABLE vehicle_models (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER REFERENCES vehicle_brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(brand_id, name)
);

-- 4. VEHICLE BODY TYPES
CREATE TABLE vehicle_body_types (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER REFERENCES vehicle_brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(brand_id, name)
);

-- 5. VEHICLE SERVICES
CREATE TABLE vehicle_services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    popular BOOLEAN DEFAULT FALSE,
    description TEXT,
    vehicle_type TEXT REFERENCES vehicle_categories(id),
    estimated_time TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VEHICLE SERVICE EXTERIOR ITEMS
CREATE TABLE vehicle_service_exterior_items (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES vehicle_services(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. VEHICLE SERVICE INTERIOR ITEMS
CREATE TABLE vehicle_service_interior_items (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES vehicle_services(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VEHICLE ADD-ON OPTIONS
CREATE TABLE vehicle_add_on_options (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    details TEXT,
    per_seat BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. VEHICLE CONDITIONS
CREATE TABLE vehicle_conditions (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. VEHICLE ARRIVAL WINDOWS
CREATE TABLE vehicle_arrival_windows (
    id SERIAL PRIMARY KEY,
    window_time TEXT UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. VEHICLE AUSTRALIAN POSTCODES
CREATE TABLE vehicle_australian_postcodes (
    id SERIAL PRIMARY KEY,
    state TEXT NOT NULL,
    min_postcode INTEGER NOT NULL,
    max_postcode INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. VEHICLE BOOKINGS (MAIN TABLE)
CREATE TABLE vehicle_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_type TEXT DEFAULT 'mobile' CHECK (booking_type IN ('residential', 'mobile')),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    address_unit TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    service_area_zip TEXT,
    vehicle_year TEXT NOT NULL,
    vehicle_brand TEXT NOT NULL,
    vehicle_model TEXT NOT NULL,
    vehicle_body TEXT NOT NULL,
    vehicle_category TEXT REFERENCES vehicle_categories(id),
    vehicle_count INTEGER DEFAULT 1,
    package_id INTEGER REFERENCES vehicle_services(id),
    package_name TEXT,
    package_price DECIMAL(10,2),
    package_description TEXT,
    conditions TEXT[] DEFAULT '{}',
    other_condition TEXT,
    add_ons JSONB DEFAULT '{}',
    add_ons_total DECIMAL(10,2) DEFAULT 0,
    appointment_date DATE NOT NULL,
    selected_windows TEXT[] DEFAULT '{}',
    backup_date DATE,
    water_access TEXT CHECK (water_access IN ('yes', 'no')),
    electricity TEXT CHECK (electricity IN ('yes', 'no')),
    covered_area TEXT CHECK (covered_area IN ('yes', 'no')),
    extra_info TEXT,
    marketing_opt_in BOOLEAN DEFAULT FALSE,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_vehicle_bookings_email ON vehicle_bookings(email);
CREATE INDEX idx_vehicle_bookings_phone ON vehicle_bookings(phone);
CREATE INDEX idx_vehicle_bookings_appointment_date ON vehicle_bookings(appointment_date);
CREATE INDEX idx_vehicle_bookings_status ON vehicle_bookings(status);
CREATE INDEX idx_vehicle_bookings_created_at ON vehicle_bookings(created_at);
CREATE INDEX idx_vehicle_bookings_zip_code ON vehicle_bookings(zip_code);
CREATE INDEX idx_vehicle_bookings_vehicle_brand ON vehicle_bookings(vehicle_brand);
CREATE INDEX idx_vehicle_bookings_vehicle_model ON vehicle_bookings(vehicle_model);
CREATE INDEX idx_vehicle_models_brand_id ON vehicle_models(brand_id);
CREATE INDEX idx_vehicle_body_types_brand_id ON vehicle_body_types(brand_id);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER update_vehicle_bookings_updated_at 
    BEFORE UPDATE ON vehicle_bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_services_updated_at 
    BEFORE UPDATE ON vehicle_services 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_add_on_options_updated_at 
    BEFORE UPDATE ON vehicle_add_on_options 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
