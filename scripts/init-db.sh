#!/bin/bash
# Database initialization script
# This script sets up the PostgreSQL database with migrations and seed data

set -e

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-borderpassport}
DB_USER=${DB_USER:-bpms_user}
DB_PASSWORD=${DB_PASSWORD:-dev_password_change_me}

echo "=========================================="
echo "Border Passport Management System"
echo "Database Initialization Script"
echo "=========================================="
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ ERROR: psql (PostgreSQL client) is not installed."
    echo "Please install PostgreSQL client tools."
    exit 1
fi

echo "📋 Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Export password for connections
export PGPASSWORD=$DB_PASSWORD

echo "⏳ Waiting for PostgreSQL to be ready..."
RETRIES=30
until psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "postgres" -c "SELECT 1" &>/dev/null; do
    if [ $RETRIES -eq 0 ]; then
        echo "❌ ERROR: PostgreSQL is not responding after 30 attempts"
        exit 1
    fi
    echo "  Retrying... ($RETRIES attempts left)"
    sleep 1
    RETRIES=$((RETRIES - 1))
done

echo "✅ PostgreSQL is ready!"
echo ""

# Check if database exists
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "postgres" -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1; then
    echo "⚠️  Database '$DB_NAME' already exists."
    echo ""
else
    echo "📁 Creating database '$DB_NAME'..."
    createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
    echo "✅ Database created successfully!"
    echo ""
fi

# Run migrations
echo "📦 Running database migrations..."
echo ""

MIGRATIONS_DIR="./migrations"

if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "❌ ERROR: Migrations directory '$MIGRATIONS_DIR' not found"
    exit 1
fi

# Run migrations in order
for migration in $(find "$MIGRATIONS_DIR" -name "*.sql" -type f | sort); do
    migration_name=$(basename "$migration")
    echo "  ▶️  Running $migration_name..."

    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration"

    if [ $? -eq 0 ]; then
        echo "     ✅ $migration_name completed"
    else
        echo "     ❌ ERROR: $migration_name failed"
        exit 1
    fi
done

echo ""
echo "=========================================="
echo "✅ Database initialization completed!"
echo "=========================================="
echo ""
echo "📊 Database Statistics:"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT
  schemaname,
  COUNT(*) as table_count
FROM pg_tables
WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'
GROUP BY schemaname;
"

echo ""
echo "🎯 Next Steps:"
echo "  1. Configure your application with:"
echo "     DATABASE_URL=postgresql://$DB_USER:****@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo "  2. To connect manually:"
echo "     psql postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo "  3. To stop and remove the database:"
echo "     docker compose -f docker-compose.db.yml down"
echo ""

