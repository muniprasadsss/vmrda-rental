#!/bin/bash

echo "Deploying frontend application..."

# Navigate to the deployment directory
cd /var/www/html

# Remove old files
sudo rm -rf *

# Unzip the new frontend build
sudo unzip /var/www/html/frontend.zip -d /var/www/html

# Remove the ZIP file after extraction
sudo rm -f /var/www/html/frontend.zip

# Set correct permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Restart the web server
sudo systemctl restart apache2 || sudo systemctl restart nginx

echo "Deployment completed successfully."
