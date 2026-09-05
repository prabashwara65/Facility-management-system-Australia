#!/bin/bash

DB_URL=${1:-$DATABASE_URL}

if [ -z "$DB_URL" ]; then
    echo "❌ Error: Database URL not provided"
    exit 1
fi

echo "⏪ Rolling back migrations..."

# Drop all tables (in reverse order)
psql "$DB_URL" << EOF
DROP TABLE IF EXISTS vehicle_bookings CASCADE;
DROP TABLE IF EXISTS vehicle_service_exterior_items CASCADE;
DROP TABLE IF EXISTS vehicle_service_interior_items CASCADE;
DROP TABLE IF EXISTS vehicle_add_on_options CASCADE;
DROP TABLE IF EXISTS vehicle_conditions CASCADE;
DROP TABLE IF EXISTS vehicle_arrival_windows CASCADE;
DROP TABLE IF EXISTS vehicle_australian_postcodes CASCADE;
DROP TABLE IF EXISTS vehicle_services CASCADE;
DROP TABLE IF EXISTS vehicle_body_types CASCADE;
DROP TABLE IF EXISTS vehicle_models CASCADE;
DROP TABLE IF EXISTS vehicle_brands CASCADE;
DROP TABLE IF EXISTS vehicle_categories CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS pricing_tiers CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS promise_features CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS service_areas CASCADE;
DROP TABLE IF EXISTS addons CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
EOF

echo "✅ Rollback complete!"