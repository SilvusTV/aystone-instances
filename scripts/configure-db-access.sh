#!/bin/bash

# Script to configure PostgreSQL database access for specific IP addresses
# Usage: ./configure-db-access.sh <your_ip_address>

# Check if an IP address was provided
if [ -z "$1" ]; then
  echo "Error: No IP address provided."
  echo "Usage: ./configure-db-access.sh <your_ip_address>"
  exit 1
fi

IP_ADDRESS=$1

# Validate IP address format
if ! [[ $IP_ADDRESS =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: Invalid IP address format."
  echo "Please provide a valid IPv4 address (e.g., 192.168.1.100)"
  exit 1
fi

# Create a backup of the original compose-production.yml file
cp ../compose-production.yml ../compose-production.yml.bak

# Update the ports configuration in compose-production.yml
sed -i "s/- \"127.0.0.1:5432:5432\"/- \"127.0.0.1:5432:5432\"\n      - \"$IP_ADDRESS:5432:5432\"/" ../compose-production.yml

echo "Database access configuration updated successfully!"
echo "The PostgreSQL database is now accessible from:"
echo "  - localhost (127.0.0.1)"
echo "  - Your IP address ($IP_ADDRESS)"
echo ""
echo "To apply these changes, restart your containers with:"
echo "  docker-compose -f compose-production.yml down"
echo "  docker-compose -f compose-production.yml up -d"
echo ""
echo "For security reasons, remember to remove this access when it's no longer needed."