#!/bin/bash
set -e
cd "$(dirname "$0")/.."

DB_HOST=${DB_HOST:-127.0.0.1}
DB_USER=${DB_USER:-root}
DB_NAME=${DB_NAME:-pet_community}
MYSQL_OPTS="--default-character-set=utf8mb4"

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "Recreating database ${DB_NAME} (full schema)..."
mysql $MYSQL_OPTS -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} -e "DROP DATABASE IF EXISTS \`${DB_NAME}\`; CREATE DATABASE \`${DB_NAME}\` DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "Running migrations..."
mysql $MYSQL_OPTS -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < migrations/001_create_tables.sql
mysql $MYSQL_OPTS -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < migrations/003_user_location.sql
mysql $MYSQL_OPTS -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < migrations/004_post_pets.sql
mysql $MYSQL_OPTS -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < migrations/006_post_categories.sql
mysql $MYSQL_OPTS -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < migrations/007_place_categories.sql
mysql $MYSQL_OPTS -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < migrations/008_admin_role.sql 2>/dev/null || true
mysql $MYSQL_OPTS -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < migrations/009_pet_options.sql 2>/dev/null || true

echo "Inserting test data..."
mysql $MYSQL_OPTS -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < migrations/002_insert_test_data.sql
mysql $MYSQL_OPTS -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < migrations/005_sync_user_post_pet_counts.sql

echo "Seeding admin user..."
node scripts/seed-admin.js 2>/dev/null || echo "  (skip seed-admin if DB not ready)"

echo "Done."
