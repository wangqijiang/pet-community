#!/bin/bash
# 一键重建数据库并导入 init.sql
set -e
cd "$(dirname "$0")/.."

DB_HOST=${DB_HOST:-127.0.0.1}
DB_USER=${DB_USER:-root}
MYSQL_OPTS="--default-character-set=utf8mb4"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

echo "Importing scripts/init.sql ..."
mysql $MYSQL_OPTS -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} < scripts/init.sql

echo "Done. Database pet_community is ready."
