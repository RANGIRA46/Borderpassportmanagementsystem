#!/bin/bash
# Database setup verification script
# Checks that PostgreSQL is running and all migrations were applied successfully

set -e

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-borderpassport}
DB_USER=${DB_USER:-bpms_user}
DB_PASSWORD=${DB_PASSWORD:-dev_password_change_me}

echo "=========================================="
echo "Database Setup Verification"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CHECKS_PASSED=0
CHECKS_FAILED=0

# Helper function
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((CHECKS_FAILED++))
    fi
}

# Export password
export PGPASSWORD=$DB_PASSWORD

# 1. Check if psql is available
echo "1️⃣ Checking prerequisites..."
which psql > /dev/null 2>&1
check_status $? "PostgreSQL client installed"

# 2. Check if PostgreSQL is running
echo ""
echo "2️⃣ Checking PostgreSQL connection..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "postgres" -c "SELECT 1" > /dev/null 2>&1
check_status $? "PostgreSQL is running"

# 3. Check if database exists
echo ""
echo "3️⃣ Checking database..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "postgres" -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1
check_status $? "Database '$DB_NAME' exists"

# 4. Check tables
echo ""
echo "4️⃣ Checking schema tables..."

TABLES=(
    "profiles"
    "applications"
    "application_status_history"
    "documents"
    "appointments"
    "border_crossings"
)

for table in "${TABLES[@]}"; do
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        -tc "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '$table'" | grep -q 1
    check_status $? "Table '$table' exists"
done

# 5. Check indexes
echo ""
echo "5️⃣ Checking indexes..."

INDEXES=(
    "idx_applications_email"
    "idx_applications_status"
    "idx_appointments_email"
    "idx_appointments_date"
    "idx_border_crossings_document_number"
)

for index in "${INDEXES[@]}"; do
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        -tc "SELECT 1 FROM pg_indexes WHERE indexname = '$index'" | grep -q 1
    check_status $? "Index '$index' exists"
done

# 6. Check Row Level Security
echo ""
echo "6️⃣ Checking security..."

RLS_TABLES=(
    "profiles"
    "applications"
    "documents"
    "appointments"
)

for table in "${RLS_TABLES[@]}"; do
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        -tc "SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = '$table' AND rowsecurity = true" | grep -q 1
    check_status $? "Row Level Security enabled on '$table'"
done

# 7. Show data statistics
echo ""
echo "7️⃣ Checking data..."

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1
check_status $? "Can connect and query database"

echo ""
echo "📊 Data Summary:"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c \
"SELECT
  'Profiles' as \"Table\", count(*) as \"Count\" FROM public.profiles
UNION ALL
SELECT 'Applications', count(*) FROM public.applications
UNION ALL
SELECT 'Documents', count(*) FROM public.documents
UNION ALL
SELECT 'Appointments', count(*) FROM public.appointments
UNION ALL
SELECT 'Border Crossings', count(*) FROM public.border_crossings
ORDER BY 2 DESC;"

# 8. Database size
echo ""
echo "💾 Database Size:"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c \
"SELECT pg_size_pretty(pg_database_size('$DB_NAME')) as \"Size\";"

# Summary
echo ""
echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}Failed: $CHECKS_FAILED${NC}"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "🎉 Your database is ready to use!"
    echo ""
    echo "Connection details:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo ""
    echo "Environment variable:"
    echo "  DATABASE_URL=postgresql://$DB_USER:****@$DB_HOST:$DB_PORT/$DB_NAME"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}⚠️ Some checks failed!${NC}"
    echo ""
    echo "To debug:"
    echo "  1. Check PostgreSQL logs: docker logs bpms-db"
    echo "  2. Try running migrations again: bash scripts/init-db.sh"
    echo "  3. Reset and reinitialize: docker compose -f docker-compose.db.yml down && docker volume rm Borderpassportmanagementsystem_postgres_data && docker compose -f docker-compose.db.yml up -d && bash scripts/init-db.sh"
    echo ""
    exit 1
fi

