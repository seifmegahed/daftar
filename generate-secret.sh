#!/bin/bash

# Generate a random JWT secret
SECRET=$(openssl rand -base64 32)

# Define the .env file path
ENV_FILE=".env"

echo $SECRET

# Check if the .env file exists, if not, create it
if [ ! -f "$ENV_FILE" ]; then
    touch "$ENV_FILE"
fi

# Check if JWT_SECRET already exists in the .env file
if grep -q "^JWT_SECRET=" "$ENV_FILE"; then
    # If JWT_SECRET exists, replace it with the new secret
    sed -i '' "s/^JWT_SECRET=.*/JWT_SECRET=$SECRET/" "$ENV_FILE"
else
    # If JWT_SECRET does not exist, append it to the .env file
    echo "JWT_SECRET=$SECRET" >> "$ENV_FILE"
fi

echo "JWT_SECRET has been updated in $ENV_FILE"
