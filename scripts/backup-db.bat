@echo off
REM Database backup script for Windows
REM Creates timestamped backups of the PostgreSQL database

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

set BACKUP_DIR=%BACKUP_DIR%
if "!BACKUP_DIR!"=="" set BACKUP_DIR=.backup

REM Create backup directory
if not exist "!BACKUP_DIR!" mkdir "!BACKUP_DIR!"

REM Generate timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set TIMESTAMP=!mydate!_!mytime!

set BACKUP_FILE=!BACKUP_DIR!\!DB_NAME!_backup_!TIMESTAMP!.sql
set BACKUP_COMPRESS=!BACKUP_DIR!\!DB_NAME!_backup_!TIMESTAMP!.dump

echo ===========================================
echo Database Backup
echo ===========================================
echo.
echo Database: !DB_NAME!
echo Host: !DB_HOST!
echo Backup Location: !BACKUP_FILE!
echo.

set PGPASSWORD=!DB_PASSWORD!

echo Creating backup (SQL format^)...
pg_dump -h !DB_HOST! -p !DB_PORT! -U !DB_USER! --no-password --verbose --format=plain !DB_NAME! > "!BACKUP_FILE!" 2>&1

if !errorlevel! equ 0 (
    echo SQL backup created: !BACKUP_FILE!
    for %%A in ("!BACKUP_FILE!") do (echo Size: %%~zA bytes)
) else (
    echo ERROR: SQL backup failed
    exit /b 1
)

echo.
echo Creating backup (compressed format^)...
pg_dump -h !DB_HOST! -p !DB_PORT! -U !DB_USER! --no-password --verbose --format=custom !DB_NAME! > "!BACKUP_COMPRESS!" 2>&1

if !errorlevel! equ 0 (
    echo Compressed backup created: !BACKUP_COMPRESS!
    for %%A in ("!BACKUP_COMPRESS!") do (echo Size: %%~zA bytes)
) else (
    echo ERROR: Compressed backup failed
    exit /b 1
)

echo.
echo ===========================================
echo Backup completed successfully!
echo ===========================================
echo.
echo To restore from SQL backup:
echo    psql -h !DB_HOST! -U !DB_USER! -d !DB_NAME! ^< !BACKUP_FILE!
echo.
echo To restore from compressed backup:
echo    pg_restore -h !DB_HOST! -U !DB_USER! -d !DB_NAME! !BACKUP_COMPRESS!
echo.

endlocal

