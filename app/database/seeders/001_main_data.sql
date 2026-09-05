-- ============================================
-- SEEDER 001: Main Data
-- ============================================

-- Insert bookings
INSERT INTO bookings (phone, email, service_area, hours) VALUES (
  '1800 123 456',
  'hello@sparkwell.com.au',
  'Melbourne, VIC',
  'Mon–Sat, 7am–6pm'
);

INSERT INTO contact_info (phone, email, service_area, hours, guarantee_title, guarantee_description) VALUES (
  '1800 123 456',
  'hello@sparkwell.com.au',
  'Melbourne, VIC',
  'Mon–Sat, 7am–6pm',
  'Bond-Back Guarantee',
  'If your property manager is not satisfied, we return free of charge. That is our promise.'
);

-- Insert services
INSERT INTO services (icon, title, price, description, sort_order) VALUES
  ('Home', 'End of Lease Clean', 'From $280', 'Bond-back guarantee with our comprehensive end-of-tenancy deep clean. We cover every corner.', 1),
  ('Sparkles', 'Deep / Spring Clean', 'From $199', 'A thorough top-to-bottom reset — inside appliances, behind furniture, skirting boards, and more.', 2),
  ('Calendar', 'Regular Clean', 'From $99', 'Weekly or fortnightly maintenance cleans tailored to your home and schedule.', 3);

-- Insert pricing tiers
INSERT INTO pricing_tiers (label, price, description, category, is_popular, status, bookings, rating, sort_order) VALUES
  ('General Clean', '$179', 'Perfect for regular upkeep. Keep your place feeling fresh, organised, and stress-free every week or fortnight. Member rates apply', 'Residential', false, 'Active', 156, 4.8, 1),
  ('Deep Reset Clean', '$249', 'For when your home needs more than a touch-up. Floors, bathrooms, kitchen, tackled top to bottom. It''s the reset button for your space.', 'Residential', true, 'Active', 98, 4.9, 2),
  ('End of Lease Cleaning', '$319', '100% BOND RETURN GUARANTEE. Designed to get your bond back. Full vacate clean with checklist compliance. Zero stress, all sparkle.', 'Residential', false, 'Active', 234, 4.7, 3),
  ('Office Clean', '$199', 'Professional office cleaning for workspaces up to 3 rooms. Daily or weekly service available.', 'Commercial', false, 'Active', 67, 4.6, 4),
  ('Retail Clean', '$299', 'Specialised retail space cleaning to keep your shop floor and displays spotless.', 'Commercial', true, 'Active', 45, 4.8, 5),
  ('Warehouse Clean', '$399', 'Complete warehouse and industrial space cleaning with heavy-duty equipment.', 'Commercial', false, 'Draft', 23, 4.5, 6);

-- Insert FAQs
INSERT INTO faqs (question, answer, category, sort_order) VALUES
  ('What''s included in your residential cleaning services?', 'Our residential cleaning services include dusting, vacuuming, mopping, surface wiping, disinfecting high-touch areas, and detailed cleaning of kitchens and bathrooms. You can also request extras like inside window cleaning or oven cleaning, depending on your home''s needs.', 'Residential', 1),
  ('How do I book residential cleaning services?', 'Booking is quick and easy! Simply select your preferred cleaning package, choose your date and time, and confirm your booking. No payment is required at the time of booking - you only pay after the service is completed to your satisfaction.', 'Residential', 2),
  ('Are your residential cleaning services customisable?', 'Yes! We understand every home is different. You can customise your cleaning package by adding extra services, focusing on specific rooms, or scheduling regular cleans. Our team works with you to create the perfect cleaning plan for your home.', 'Residential', 3),
  ('What commercial cleaning services do you offer?', 'We offer comprehensive commercial cleaning services including office cleaning, retail cleaning, school cleaning, gym cleaning, showroom cleaning, medical centre cleaning, and shopping centre cleaning.', 'Commercial', 4),
  ('How often do you provide commercial cleaning?', 'We offer flexible scheduling options including nightly, weekly, fortnightly, or monthly cleans. We can also accommodate deep cleans and one-time special events.', 'Commercial', 5),
  ('Are your cleaners insured and background-checked?', 'Yes, all our cleaners are fully insured, police-checked, and professionally trained. We take your safety and trust seriously, ensuring every cleaner who enters your home is reliable, trustworthy, and experienced.', 'Residential', 6);

-- Insert promise features
INSERT INTO promise_features (icon, title, description, status, "order") VALUES
  ('ShieldCheck', '48-Hour Re-Clean Guarantee', 'Not happy? We return within 48 hours at no extra cost, no questions asked.', 'Active', 1),
  ('FileCheck2', 'Fully Insured & Bonded', 'All cleaners carry $10M public liability insurance for complete peace of mind.', 'Active', 2),
  ('UserCheck', 'Vetted & Background-Checked', 'Every team member passes a national police check before joining our crew.', 'Active', 3),
  ('Tag', 'Fixed, Transparent Pricing', 'No hidden fees. Your quoted price is what you pay — always.', 'Active', 4),
  ('Leaf', 'Eco-Friendly Products', 'We use hospital-grade, biodegradable cleaning products safe for kids and pets.', 'Active', 5),
  ('Plane', 'No Travel Fees', 'Free travel within our service area — Melbourne metro and inner suburbs.', 'Active', 6);

-- Insert testimonials
INSERT INTO testimonials (name, location, quote, rating, verified, status) VALUES
  ('Sarah M.', 'South Yarra', 'Absolutely spotless. Our property manager was blown away — we got our full bond back the same day. Will be using SparkWell for our new place too.', 5, true, 'Active'),
  ('James R.', 'Fitzroy', 'Booked a spring clean before hosting a dinner party. The team arrived on time, were incredibly thorough, and even folded the toilet paper — a lovely touch.', 5, true, 'Active'),
  ('Priya K.', 'Richmond', 'I have tried three other cleaning companies this year. SparkWell is a cut above — professional, responsive, and genuinely good at what they do.', 5, true, 'Active'),
  ('Tom & Wei L.', 'Carlton', 'Regular fortnightly cleans since March. The same team every time, they know our home, and it is always immaculate. Can not recommend enough.', 5, true, 'Active');

-- Insert service areas
INSERT INTO service_areas (name, region, status) VALUES
  ('Melbourne CBD', 'CBD', 'Active'),
  ('South Yarra', 'South', 'Active'),
  ('Fitzroy', 'North', 'Active'),
  ('Richmond', 'East', 'Active'),
  ('Carlton', 'North', 'Active'),
  ('Prahran', 'South', 'Active'),
  ('St Kilda', 'South', 'Active'),
  ('Docklands', 'CBD', 'Active'),
  ('Collingwood', 'North', 'Active'),
  ('Brunswick', 'North', 'Active'),
  ('Hawthorn', 'East', 'Active'),
  ('Camberwell', 'East', 'Active'),
  ('Toorak', 'South', 'Active'),
  ('Malvern', 'South', 'Active'),
  ('Armadale', 'South', 'Active'),
  ('Northcote', 'North', 'Active'),
  ('Clifton Hill', 'North', 'Active'),
  ('Albert Park', 'South', 'Active'),
  ('Port Melbourne', 'South', 'Active'),
  ('Windsor', 'South', 'Active');

-- Insert addons
INSERT INTO addons (name, price, description, category, sort_order) VALUES
  ('Carpet Steam Cleaning (Living Area/Hall)', '$100', 'Living Area/Hall', 'Carpet & Upholstery', 1),
  ('Carpet Steam Cleaning (Per Bedroom)', '$55', 'Per Bedroom', 'Carpet & Upholstery', 2),
  ('Upholstery Steam Cleaning', 'Custom', 'Available upon request', 'Carpet & Upholstery', 3),
  ('Oven Cleaning', '$65', 'Professional oven cleaning', 'Kitchen Add-ons', 4),
  ('Fridge Cleaning', '$35', 'Deep fridge cleaning', 'Kitchen Add-ons', 5),
  ('Dishes', '$35', 'Wash and put away dishes', 'Kitchen Add-ons', 6),
  ('Clean Inside Cabinets', '$30 - $100', 'Based on number of cabinets', 'Whole Home', 7),
  ('Inside Window Cleaning', '$65 - $150', 'Based on number of windows', 'Whole Home', 8),
  ('Wet Wipe Blinds', '$29', 'Per blind', 'Whole Home', 9),
  ('Clean Walls', '$29', 'Per wall', 'Whole Home', 10),
  ('Use Green Supplies', '$5', 'Eco-friendly cleaning products', 'Whole Home', 11),
  ('Bed Linen Change', '$15', 'Fresh bed linen', 'Deep Detail', 12),
  ('Ironing', '$45', 'Per 30 minutes', 'Deep Detail', 13),
  ('Laundry Service', '$30', 'Per load', 'Deep Detail', 14),
  ('Balcony / Patio Clean', '$60 - $100', 'Based on size', 'Deep Detail', 15),
  ('Garage Clean', '$50+', 'Starting from $50', 'Deep Detail', 16);
