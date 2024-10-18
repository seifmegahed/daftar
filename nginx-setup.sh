#!/bin/bash

# Load variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo ".env file not found!"
  exit 1
fi

# Ensure required variables are set
if [ -z "$DOMAIN" ] || [ -z "$NGINX_PORT" ] || [ -z "$SSL_DIR" ]; then
  echo "Please set DOMAIN, NGINX_PORT, and SSL_DIR in your .env file."
  exit 1
fi

# Paths to SSL files
SSL_CERT="$SSL_DIR/$DOMAIN.crt"
SSL_KEY="$SSL_DIR/$DOMAIN.key"

# Check if SSL certificate exists
if [ ! -f "$SSL_CERT" ] || [ ! -f "$SSL_KEY" ]; then
  echo "SSL certificate not found. Generating a new self-signed certificate..."

  # Create SSL directory if it doesn't exist
  sudo mkdir -p $SSL_DIR

  # Create a temporary OpenSSL configuration file
  SSL_CONFIG=$(mktemp)
  cat > $SSL_CONFIG <<EOL
[ req ]
default_bits       = 2048
distinguished_name = req
req_extensions     = san
[ san ]
subjectAltName = DNS:$DOMAIN
EOL

  # Generate the self-signed SSL certificate
  sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout $SSL_KEY \
    -out $SSL_CERT \
    -subj "/C=EG/ST=Cairo/L=Cairo/O=MyCompany/OU=IT/CN=$DOMAIN" \
    -config $SSL_CONFIG

  # Clean up temporary file
  rm $SSL_CONFIG

  echo "SSL certificate generated for $DOMAIN."
else
  echo "SSL certificate already exists for $DOMAIN."
fi


# Nginx configuration
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"

if [ ! -f "$NGINX_CONF" ]; then
  echo "Creating Nginx configuration for $DOMAIN..."

  # Create the Nginx config file
  sudo bash -c "cat > $NGINX_CONF" << EOL
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate $SSL_CERT;
    ssl_certificate_key $SSL_KEY;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:$NGINX_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL

  # Enable the site by creating a symbolic link
  sudo ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

  echo "Nginx configuration created for $DOMAIN."
else
  echo "Nginx configuration already exists for $DOMAIN."
fi

# Test the Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
  # Check if Nginx is running
  if systemctl is-active --quiet nginx; then
    echo "Reloading Nginx..."
    sudo systemctl reload nginx
    echo "Nginx reloaded successfully."
  else
    echo "Starting Nginx..."
    sudo systemctl start nginx
    echo "Nginx started successfully."
  fi
else
  echo "Nginx configuration test failed. Please check the logs."
  exit 1
fi
