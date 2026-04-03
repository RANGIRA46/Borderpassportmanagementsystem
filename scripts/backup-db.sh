#!/bin/bash
# Database backup script
# Creates timestamped backups of the PostgreSQL database

set -e

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-borderpassport}
DB_USER=${DB_USER:-bpms_user}
DB_PASSWORD=${DB_PASSWORD:-dev_password_change_me}
BACKUP_DIR=${BACKUP_DIR:-.backup}

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_${TIMESTAMP}.sql"
BACKUP_COMPRESS="${BACKUP_DIR}/${DB_NAME}_backup_${TIMESTAMP}.dump"

echo "=========================================="
echo "Database Backup"
echo "=========================================="
echo ""
echo "Database: $DB_NAME"
echo "Host: $DB_HOST"
echo "Backup Location: $BACKUP_FILE"
echo ""

# Export password
export PGPASSWORD=$DB_PASSWORD

# Create SQL backup
echo "⏳ Creating backup (SQL format)..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
  --no-password \
  --verbose \
  --format=plain \
  "$DB_NAME" > "$BACKUP_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "✅ SQL backup created: $BACKUP_FILE"
  echo "   Size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
  echo "❌ SQL backup failed"
  exit 1
fi

# Create compressed backup
echo ""
echo "⏳ Creating backup (compressed format)..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
  --no-password \
  --verbose \
  --format=custom \
  "$DB_NAME" > "$BACKUP_COMPRESS" 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Compressed backup created: $BACKUP_COMPRESS"
  echo "   Size: $(du -h "$BACKUP_COMPRESS" | cut -f1)"
else
  echo "❌ Compressed backup failed"
  exit 1
fi

echo ""
echo "=========================================="
echo "✅ Backup completed successfully!"
echo "=========================================="
echo ""
echo "💾 Backup Files:"
ls -lh "$BACKUP_DIR" | grep "${TIMESTAMP}"

echo ""
echo "🔄 To restore from SQL backup:"
echo "   psql -h $DB_HOST -U $DB_USER -d $DB_NAME < $BACKUP_FILE"
echo ""
echo "🔄 To restore from compressed backup:"
echo "   pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME $BACKUP_COMPRESS"
echo ""

