#!/usr/bin/env bash

PROJECT_NAME=$(grep '"name"' package.json | head -n 1 | sed -E 's/.*"name": *"([^"]+)".*/\1/')

DB_CONTAINER_NAME="$PROJECT_NAME-postgres"
DB_VOLUME_NAME="$PROJECT_NAME-postgres-data"

if ! [ -x "$(command -v docker)" ]; then
  echo -e "Docker is not installed. Please install docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  echo "Database container '$DB_CONTAINER_NAME' already running"
  exit 0
fi

if [ "$(docker ps -q -a -f name=$DB_CONTAINER_NAME)" ]; then
  docker start "$DB_CONTAINER_NAME"
  echo "Existing database container '$DB_CONTAINER_NAME' started"
  exit 0
fi

# import env variables from .env
set -a
source .env

DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')
DB_PORT=$(echo "$DATABASE_URL" | awk -F':' '{print $4}' | awk -F'\/' '{print $1}')

if [ "$DB_PASSWORD" = "password" ]; then
  echo "You are using the default database password"
  read -p "Should we generate a random password for you? [y/N]: " -r REPLY
  if ! [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Please change the default password in the .env file and try again"
    exit 1
  fi
  # Generate a random URL-safe password
  DB_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_')
  sed -i -e "s#:password@#:$DB_PASSWORD@#" .env
fi

# Run the PostgreSQL container with a persistent volume
docker run -d \
  --name "$DB_CONTAINER_NAME" \
  -e POSTGRES_USER="postgres" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB="$PROJECT_NAME" \
  -p "$DB_PORT":5432 \
  -v "$DB_VOLUME_NAME:/var/lib/postgresql/16/data" \
  docker.io/postgres && echo "Database container '$DB_CONTAINER_NAME' was successfully created with persistent storage"
