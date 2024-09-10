#!/usr/bin/env bash

PROJECT_NAME=$(grep '"name"' package.json | head -n 1 | sed -E 's/.*"name": *"([^"]+)".*/\1/')

# Load environment variables from the .env file
set -a
source .env

# Extract the username, password, and port from DATABASE_URL
DB_USERNAME=$(echo "$DATABASE_URL" | awk -F'[/:@]' '{print $4}')
DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F'[/:@]' '{print $5}')
DB_HOST=$(echo "$DATABASE_URL" | awk -F'[/:@]' '{print $6}')
DB_PORT=$(echo "$DATABASE_URL" | awk -F'[/:@]' '{print $7}')
DB_NAME=$(echo "$DATABASE_URL" | awk -F'/' '{print $4}')

# Specify the directory for backups (this could be an external hard drive or separate partition)
DB_BACKUP_DIR="/mnt/backup" # Change this path to your backup location
PG_CTL_PATH="/usr/lib/postgresql/14/bin/pg_ctl" # Update this to match your PostgreSQL version
PG_DATA_DIR="/var/lib/postgresql/14/main" # The data directory for PostgreSQL

# Check if PostgreSQL is installed
if ! [ -x "$(command -v psql)" ]; then
  echo "PostgreSQL is not installed. Please install it and try again."
  exit 1
fi

# Helper functions
start_db() {
  echo "Starting PostgreSQL..."
  sudo -u postgres $PG_CTL_PATH -D "$PG_DATA_DIR" start
  if [ $? -eq 0 ]; then
    echo "PostgreSQL started successfully."
  else
    echo "Failed to start PostgreSQL."
  fi
}

stop_db() {
  echo "Stopping PostgreSQL..."
  sudo -u postgres $PG_CTL_PATH -D "$PG_DATA_DIR" stop
  if [ $? -eq 0 ]; then
    echo "PostgreSQL stopped successfully."
  else
    echo "Failed to stop PostgreSQL."
  fi
}

status_db() {
  sudo -u postgres $PG_CTL_PATH -D "$PG_DATA_DIR" status
}

backup_db() {
  if [ ! -d "$DB_BACKUP_DIR" ]; then
    echo "Backup directory $DB_BACKUP_DIR does not exist. Please create it or specify a valid path."
    exit 1
  fi

  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  BACKUP_FILE="$DB_BACKUP_DIR/${DB_NAME}_backup_$TIMESTAMP.sql"

  echo "Creating backup for database '$DB_NAME' at $BACKUP_FILE"
  sudo -u postgres pg_dump -U "$DB_USERNAME" -h "$DB_HOST" -p "$DB_PORT" "$DB_NAME" > "$BACKUP_FILE"

  if [ $? -eq 0 ]; then
    echo "Backup created successfully at $BACKUP_FILE"
  else
    echo "Failed to create database backup."
  fi
}

# Main logic
case "$1" in
  start)
    start_db
    ;;
  stop)
    stop_db
    ;;
  status)
    status_db
    ;;
  backup)
    backup_db
    ;;
  *)
    echo "Usage: $0 {start|stop|status|backup}"
    exit 1
    ;;
esac
