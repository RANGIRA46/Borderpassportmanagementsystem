@echo off
REM PostgreSQL connection helper script for Windows
REM Provides an easy way to connect to the database

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

echo Connecting to !DB_NAME! database...
echo Host: !DB_HOST!
echo User: !DB_USER!
echo.

set PGPASSWORD=!DB_PASSWORD!
psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -d !DB_NAME!

endlocal

