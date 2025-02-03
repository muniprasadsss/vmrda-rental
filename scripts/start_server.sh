#!/bin/bash

echo "Starting web server..."

# Restart the web server to load new changes
sudo systemctl restart apache2 || sudo systemctl restart nginx

echo "Server started successfully."
