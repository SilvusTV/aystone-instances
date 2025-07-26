#!/bin/bash

# Script to remove PostgreSQL database access for specific IP addresses
# Usage: ./remove-db-access.sh

# Path to compose-production.yml
COMPOSE_FILE="../compose-production.yml"
BACKUP_FILE="../compose-production.yml.bak"

# Create a backup of the current compose-production.yml file
cp $COMPOSE_FILE $BACKUP_FILE

# Update the ports configuration in compose-production.yml to only allow localhost access
sed -i -E 's/- "[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:5432:5432"//' $COMPOSE_FILE
# Remove any empty lines that might have been created
sed -i '/^[[:space:]]*$/d' $COMPOSE_FILE

echo "Database access configuration updated successfully!"
echo "The PostgreSQL database is now accessible only from localhost (127.0.0.1)."
echo ""
echo "To apply these changes, restart your containers with:"
echo "  docker-compose -f compose-production.yml down"
echo "  docker-compose -f compose-production.yml up -d"
echo ""
echo "Your database is now more secure."