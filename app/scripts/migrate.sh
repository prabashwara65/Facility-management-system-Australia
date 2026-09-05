#!/bin/bash

# Get Railway DB URL from environment or argument
DB_URL=${1:-$DATABASE_URL}

if [ -z "$DB_URL" ]; then
    echo "❌ Error: Database URL not provided"
    echo "Usage: ./migrate.sh postgresql://user:pass@host:port/db"
    echo "   or: export DATABASE_URL=postgresql://... && ./migrate.sh"
    exit 1
fi

echo "🚀 Starting migration to Railway PostgreSQL..."

# Run migrations (schema only)
echo "📦 Running migrations..."
for migration in app/database/migrations/*.sql; do
    echo "  → Applying $(basename $migration)..."
    psql "$DB_URL" -f "$migration"
    if [ $? -ne 0 ]; then
        echo "❌ Migration failed: $(basename $migration)"
        exit 1
    fi
done

# Run seeders (data only)
echo "🌱 Running seeders..."
for seeder in app/database/seeders/*.sql; do
    echo "  → Seeding $(basename $seeder)..."
    psql "$DB_URL" -f "$seeder"
    if [ $? -ne 0 ]; then
        echo "❌ Seeder failed: $(basename $seeder)"
        exit 1
    fi
done

echo "✅ Migration complete!"
