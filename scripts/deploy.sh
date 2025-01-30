#!/bin/bash

echo "Starting Deployment..."

# Navigate to the web root directory
cd /var/www/html

# Remove old files
sudo rm -rf *

# Move new build files
sudo cp -r /opt/codedeploy-agent/deployment-root/deployment-archive/frontend/dist/* /var/www/html/

# Set correct permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

echo "Restarting Web Server..."
sudo systemctl restart apache2 || sudo systemctl restart nginx

echo "Deployment completed successfully."
