#!/bin/bash

echo "Running BeforeInstall script..."

# Update package manager and install necessary dependencies
sudo apt-get update
sudo apt-get install -y unzip

echo "BeforeInstall script completed."
