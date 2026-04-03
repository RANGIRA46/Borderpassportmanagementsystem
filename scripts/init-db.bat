@echo off
REM Database initialization script for Windows
REM This script sets up the PostgreSQL database with migrations and seed data

setlocal enabledelayedexpansion

REM Database Configuration
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

echo ===========================================
echo Border Passport Management System
echo Database Initialization Script
echo ===========================================
echo.

echo Database Configuration:
echo   Host: !DB_HOST!
echo   Port: !DB_PORT!
echo   Database: !DB_NAME!
echo   User: !DB_USER!
echo.

REM Set environment variable for psql password
set PGPASSWORD=!DB_PASSWORD!

echo Waiting for PostgreSQL to be ready...
set RETRIES=30

:check_postgres
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: psql (PostgreSQL client) is not installed.
    echo Please install PostgreSQL client tools.
    exit /b 1
)

psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -d postgres -c "SELECT 1" >nul 2>&1
if %errorlevel% equ 0 (
    echo PostgreSQL is ready!
    goto run_migrations
) else (
    if !RETRIES! equ 0 (
        echo ERROR: PostgreSQL is not responding
        exit /b 1
    )
    echo   Retrying... (!RETRIES! attempts left)
    set /a RETRIES=!RETRIES!-1
    timeout /t 1 /nobreak >nul
    goto check_postgres
)

:run_migrations
echo.
echo Running database migrations...
echo.

if not exist "migrations\" (
    echo ERROR: Migrations directory not found
    exit /b 1
)

for /f "delims=" %%F in ('dir /b /o:n migrations\*.sql') do (
    echo   Running %%F...
    psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -d !DB_NAME! -f migrations\%%F
    if !errorlevel! equ 0 (
        echo      %%F completed
    ) else (
        echo      ERROR: %%F failed
        exit /b 1
    )
)

echo.
echo ===========================================
echo Database initialization completed!
echo ===========================================
echo.
echo Database Statistics:
psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -d !DB_NAME! -c "SELECT schemaname, COUNT(*) as table_count FROM pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema' GROUP BY schemaname;"

echo.
echo Next Steps:
echo   1. Configure your application with:
echo      DATABASE_URL=postgresql://!DB_USER!:****@!DB_HOST!:!DB_PORT!/!DB_NAME!
echo.
echo   2. To connect manually:
echo      psql postgresql://!DB_USER!@!DB_HOST!:!DB_PORT!/!DB_NAME!
echo.
echo   3. To stop and remove the database:
echo      docker compose -f docker-compose.db.yml down
echo.

endlocal

