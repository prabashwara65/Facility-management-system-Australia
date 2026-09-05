-- ============================================
-- SEEDER 002: Vehicle Data
-- ============================================

-- Insert vehicle categories
INSERT INTO vehicle_categories (id, label, icon_name) VALUES
    ('car', 'Cars', 'Car'),
    ('truck', 'Trucks', 'Truck'),
    ('van', 'Vans', 'Warehouse'),
    ('suv', 'SUVs', 'Bus');

-- Insert vehicle brands
INSERT INTO vehicle_brands (name) VALUES
    ('Acura'), ('Audi'), ('BMW'), ('Buick'), ('Cadillac'), 
    ('Chevrolet'), ('Chrysler'), ('Dodge'), ('Ford'), ('GMC'), 
    ('Genesis'), ('Honda'), ('Hyundai'), ('INFINITI'), ('Jaguar'), 
    ('Jeep'), ('Kia'), ('Land Rover'), ('Lexus'), ('Lincoln'), 
    ('Lotus'), ('MINI'), ('Mazda'), ('Mercedes-Benz'), ('Mitsubishi'), 
    ('Nissan'), ('Ram'), ('Rivian'), ('Subaru'), ('Tesla'), 
    ('Toyota'), ('Volkswagen');

-- Insert vehicle services
INSERT INTO vehicle_services (name, price, rating, reviews, popular, description, vehicle_type, estimated_time) VALUES
    ('PLATINUM Detailing Package', 299.00, 4.72, 23782, TRUE, 'Our signature auto detailing package with comprehensive INTERIOR and EXTERIOR services including shampoo and high quality wax.', 'car', '180 minutes'),
    ('GOLD Detailing Package', 219.00, 4.76, 11966, FALSE, 'Combines the complete EXTERIOR detail and hand wax with Interior vacuum, wipe down, and leather/vinyl dressings', 'car', '120 minutes'),
    ('TITANIUM Detailing Package', 545.00, 4.68, 1648, FALSE, 'Our most thorough detailing package! A complete exterior detail with single pass compounding/buffing paint correction combined with a full interior detailing.', 'car', '240 minutes'),
    ('TITANIUM Exterior Only', 455.00, 4.67, 467, FALSE, 'All of the exterior services in the FULL Titanium detail package.', 'truck', '120 minutes'),
    ('INTERIOR Only Detailing', 219.00, 4.73, 13782, FALSE, 'INTERIOR ONLY detailing package including vacuum, shampoo, deep cleaning and leather/vinyl dressings.', 'car', '120 minutes');

-- Insert add-on options
INSERT INTO vehicle_add_on_options (id, name, price, description, details, per_seat) VALUES
    ('pet-hair', 'Pet Hair Removal', 70.00, 'Remove all visible pet hair from interior', 'Complete removal of pet hair from all surfaces', FALSE),
    ('super-interior', 'Super Interior', 140.00, 'Double shampoo, stain pre-treatment, pet hair removal', 'Deep clean with stain removal and pet hair extraction', FALSE),
    ('interior-sanitizing', 'Interior Sanitizing', 60.00, 'Sanitize/disinfect all interior surfaces', 'Anti-microbial treatment for all surfaces', FALSE),
    ('rain-x', 'Rain X Treatment', 30.00, 'Treat all exterior glass with water repellent', 'Hydrophobic coating for all exterior glass', FALSE),
    ('polymer-sealant', 'Polymer Sealant', 35.00, 'Extend paint protection for up to 6 months', 'Synthetic sealant for long-lasting protection', FALSE),
    ('headlight-restoration', 'Headlight Restoration', 105.00, 'Restore headlights to bright and brilliant shine', 'Professional headlight restoration service', FALSE),
    ('child-seat', 'Child Seat Cleaning', 35.00, 'Vacuum, wipe down, and shampoo child seat', 'Deep clean and sanitize child safety seats', TRUE);

-- Insert conditions
INSERT INTO vehicle_conditions (name) VALUES
    ('Excessive pet hair'),
    ('Mold/mildew'),
    ('Human or animal biological waste'),
    ('Heavy soilage/stains'),
    ('Foul odors'),
    ('Tree sap'),
    ('Exterior hard water spots'),
    ('Overspray (paint, concrete, tar, chemical, etc)');

-- Insert arrival windows
INSERT INTO vehicle_arrival_windows (window_time, display_order) VALUES
    ('8am - 11am', 1),
    ('10am - 1pm', 2),
    ('12pm - 3pm', 3),
    ('2pm - 5pm', 4);

-- Insert Australian postcodes
INSERT INTO vehicle_australian_postcodes (state, min_postcode, max_postcode) VALUES
    ('VIC', 3000, 3999),
    ('NSW', 2000, 2999),
    ('QLD', 4000, 4999),
    ('SA', 5000, 5999),
    ('WA', 6000, 6999),
    ('TAS', 7000, 7999),
    ('NT', 800, 999),
    ('ACT', 2600, 2618);

-- Insert vehicle models (sample - add all from your file)
INSERT INTO vehicle_models (brand_id, name) VALUES 
    ((SELECT id FROM vehicle_brands WHERE name = 'Toyota'), 'Camry'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Toyota'), 'Corolla'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Toyota'), 'RAV4'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Honda'), 'Accord'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Honda'), 'Civic'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Honda'), 'CR-V'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Tesla'), 'Model 3'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Tesla'), 'Model S'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Tesla'), 'Model Y'),
    ((SELECT id FROM vehicle_brands WHERE name = 'BMW'), '3 Series'),
    ((SELECT id FROM vehicle_brands WHERE name = 'BMW'), '5 Series'),
    ((SELECT id FROM vehicle_brands WHERE name = 'BMW'), 'X5'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Audi'), 'A4'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Audi'), 'Q5'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Ford'), 'F-150'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Ford'), 'Mustang');

-- Insert body types
INSERT INTO vehicle_body_types (brand_id, name) VALUES 
    ((SELECT id FROM vehicle_brands WHERE name = 'Toyota'), 'Sedan'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Toyota'), 'SUV'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Toyota'), 'Truck'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Honda'), 'Sedan'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Honda'), 'SUV'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Honda'), 'Minivan'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Tesla'), 'Sedan'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Tesla'), 'SUV'),
    ((SELECT id FROM vehicle_brands WHERE name = 'BMW'), 'Sedan'),
    ((SELECT id FROM vehicle_brands WHERE name = 'BMW'), 'SUV'),
    ((SELECT id FROM vehicle_brands WHERE name = 'BMW'), 'Coupe'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Audi'), 'Sedan'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Audi'), 'SUV'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Ford'), 'Truck'),
    ((SELECT id FROM vehicle_brands WHERE name = 'Ford'), 'SUV');