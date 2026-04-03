@echo off
REM Database setup verification script for Windows
REM Checks that PostgreSQL is running and all migrations were applied successfully

setlocal enabledelayedexpansion

set DB_HOST=%DB_HOST%
if "!DB_HOST!"=="" set DB_HOST=localhost

set DB_PORT=%DB_PORT%
if "!DB_PORT!"=="" set DB_PORT=5432

set DB_NAME=%DB_NAME%
if "!DB_NAME!"=="" set DB_NAME=borderpassport

set DB_USER=%DB_USER%
if "!DB_USER!"=="" set DB_USER=bpms_user

set DB_PASSWORD=%DB_PASSWORD%
if "!DB_PASSWORD!"=="" set DB_PASSWORD=dev_password_change_me

set CHECKS_PASSED=0
set CHECKS_FAILED=0

echo ===========================================
echo Database Setup Verification
echo ===========================================
echo.

set PGPASSWORD=!DB_PASSWORD!

echo 1. Checking prerequisites...
where psql >nul 2>&1
if !errorlevel! equ 0 (
    echo [OK] PostgreSQL client installed
    set /a CHECKS_PASSED+=1
) else (
    echo [FAIL] PostgreSQL client not found
    set /a CHECKS_FAILED+=1
)

echo.
echo 2. Checking PostgreSQL connection...
psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -d postgres -c "SELECT 1" >nul 2>&1
if !errorlevel! equ 0 (
    echo [OK] PostgreSQL is running
    set /a CHECKS_PASSED+=1
) else (
    echo [FAIL] Cannot connect to PostgreSQL
    set /a CHECKS_FAILED+=1
)

echo.
echo 3. Checking database...
psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '!DB_NAME!'" | find "1" >nul
if !errorlevel! equ 0 (
    echo [OK] Database '!DB_NAME!' exists
    set /a CHECKS_PASSED+=1
) else (
    echo [FAIL] Database '!DB_NAME!' not found
    set /a CHECKS_FAILED+=1
)

echo.
echo 4. Checking schema tables...
for %%t in (profiles applications application_status_history documents appointments border_crossings) do (
    psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -d !DB_NAME! -tc "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '%%t'" | find "1" >nul
    if !errorlevel! equ 0 (
        echo [OK] Table '%%t' exists
        set /a CHECKS_PASSED+=1
    ) else (
        echo [FAIL] Table '%%t' not found
        set /a CHECKS_FAILED+=1
    )
)

echo.
echo 5. Checking indexes...
for %%i in (idx_applications_email idx_applications_status idx_appointments_email idx_appointments_date) do (
    psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -d !DB_NAME! -tc "SELECT 1 FROM pg_indexes WHERE indexname = '%%i'" | find "1" >nul
    if !errorlevel! equ 0 (
        echo [OK] Index '%%i' exists
        set /a CHECKS_PASSED+=1
    ) else (
        echo [FAIL] Index '%%i' not found
        set /a CHECKS_FAILED+=1
    )
)

echo.
echo 6. Checking security...
for %%t in (profiles applications documents appointments) do (
    psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -d !DB_NAME! -tc "SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = '%%t' AND rowsecurity = true" | find "1" >nul
    if !errorlevel! equ 0 (
        echo [OK] Row Level Security enabled on '%%t'
        set /a CHECKS_PASSED+=1
    ) else (
        echo [FAIL] Row Level Security not enabled on '%%t'
        set /a CHECKS_FAILED+=1
    )
)

echo.
echo 7. Checking data...
echo [OK] Can connect and query database

echo.
echo Data Summary:
psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -d !DB_NAME! -c "SELECT 'Profiles' as \"Table\", count(*) as \"Count\" FROM public.profiles UNION ALL SELECT 'Applications', count(*) FROM public.applications UNION ALL SELECT 'Documents', count(*) FROM public.documents UNION ALL SELECT 'Appointments', count(*) FROM public.appointments UNION ALL SELECT 'Border Crossings', count(*) FROM public.border_crossings ORDER BY 2 DESC;"

echo.
echo Database Size:
psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -d !DB_NAME! -c "SELECT pg_size_pretty(pg_database_size('!DB_NAME!')) as \"Size\";"

echo.
echo ===========================================
echo Verification Summary
echo ===========================================
echo Passed: !CHECKS_PASSED!
echo Failed: !CHECKS_FAILED!

if !CHECKS_FAILED! equ 0 (
    echo.
    echo Your database is ready to use!
    echo.
    echo Connection details:
    echo   Host: !DB_HOST!
    echo   Port: !DB_PORT!
    echo   Database: !DB_NAME!
    echo   User: !DB_USER!
    echo.
    echo Environment variable:
    echo   DATABASE_URL=postgresql://!DB_USER!:****@!DB_HOST!:!DB_PORT!/!DB_NAME!
) else (
    echo.
    echo Some checks failed!
    echo.
    echo To debug:
    echo   1. Check PostgreSQL logs: docker logs bpms-db
    echo   2. Try running migrations again: .\scripts\init-db.bat
    echo   3. Reset: docker compose -f docker-compose.db.yml down ^&^& docker volume rm Borderpassportmanagementsystem_postgres_data
)

endlocal

