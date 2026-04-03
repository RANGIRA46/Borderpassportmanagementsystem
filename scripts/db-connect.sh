#!/bin/bash
# PostgreSQL connection helper script
# Provides an easy way to connect to the database

set -e

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-borderpassport}
DB_USER=${DB_USER:-bpms_user}
DB_PASSWORD=${DB_PASSWORD:-dev_password_change_me}

echo "Connecting to $DB_NAME database..."
echo "Host: $DB_HOST"
echo "User: $DB_USER"
echo ""

export PGPASSWORD=$DB_PASSWORD
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"

