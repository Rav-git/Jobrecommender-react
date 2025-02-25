#!/bin/bash

# This script helps with deploying the React frontend to Render
echo "Starting Render deployment process for React frontend..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Run the enhanced build script
echo "Running enhanced build script..."
node build.js

# Success message
echo "Build process completed. Your app is ready for Render deployment!" 