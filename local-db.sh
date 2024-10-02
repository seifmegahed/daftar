#!/bin/bash

if [ $# -lt 4 ]; then
  echo "Usage: $0 {start|stop|cleanup} <DB_NAME> <DB_USER> <DB_PASSWORD>"
  exit 1
fi

ACTION=$1
DB_NAME=$2
DB_USER=$3
DB_PASSWORD=$4

PG_DATA="/usr/local/var/postgresql@15" # Adjust this path if necessary

start_db() {
  echo "Starting PostgreSQL..."
  brew services start postgresql@15
  sleep 10

  echo "Creating database and user..."
  
  if psql -lqt | cut -d \| -f 1 | grep -qw postgres; then
    psql postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
    psql postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    echo "Database '$DB_NAME' and user '$DB_USER' created for development."
  else
    echo "PostgreSQL doesn't seem to be running correctly. Check your installation."
  fi
}

stop_db() {
  echo "Stopping PostgreSQL..."
  brew services stop postgresql@15
}

cleanup_db() {
  echo "Cleaning up database and user..."
  psql postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" || echo "Error: Failed to drop database '$DB_NAME'."
  psql postgres -c "DROP USER IF EXISTS $DB_USER;" || echo "Error: Failed to drop user '$DB_USER'."

  echo "Database '$DB_NAME' and user '$DB_USER' have been removed."
}

case $ACTION in
  start)
    start_db
    ;;
  stop)
    stop_db
    ;;
  cleanup)
    cleanup_db
    ;;
  *)
    echo "Invalid action: $ACTION. Use start, stop, or cleanup."
    exit 1
    ;;
esac
