#!/bin/bash

# Simple deployment script for AI Job Matcher

echo "Deploying AI Job Matcher..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
mkdir -p job-recommender-backend/uploads
mkdir -p job-recommender-backend/data

# Check if data files exist
if [ ! -f "job-recommender-backend/data/linkdindata.csv" ]; then
    echo "Warning: linkdindata.csv not found in data directory."
    echo "Please ensure this file is available before starting the application."
fi

if [ ! -f "job-recommender-backend/data/skills.csv" ]; then
    echo "Warning: skills.csv not found in data directory."
    echo "Please ensure this file is available before starting the application."
fi

# Build and start containers
echo "Building and starting containers..."
docker-compose up --build -d

# Check if containers are running
if [ $? -eq 0 ]; then
    echo "Deployment successful!"
    echo "Frontend: http://localhost"
    echo "Backend: http://localhost:5000"
else
    echo "Deployment failed. Please check the logs for more information."
    exit 1
fi

exit 0 