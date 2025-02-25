#!/bin/bash

# Script to prepare and deploy AI Job Matcher to Vercel and Render

echo "Preparing AI Job Matcher for Vercel and Render deployment..."

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

# Check if repository is initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
else
    echo "Git repository already initialized."
fi

# Prompt for GitHub repository URL
read -p "Enter your GitHub repository URL (e.g., https://github.com/yourusername/job-recommender.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "No repository URL provided. Skipping remote setup."
else
    # Check if remote origin exists
    if git remote | grep -q "^origin$"; then
        echo "Remote 'origin' already exists. Updating URL..."
        git remote set-url origin "$REPO_URL"
    else
        echo "Adding remote 'origin'..."
        git remote add origin "$REPO_URL"
    fi
    
    # Push to GitHub
    echo "Pushing to GitHub..."
    git push -u origin main || git push -u origin master
fi

# Prompt for Vercel frontend URL
read -p "Enter your Vercel frontend URL (leave blank if not deployed yet): " VERCEL_URL

if [ -n "$VERCEL_URL" ]; then
    # Update CORS in server.js
    echo "Updating CORS configuration in server.js..."
    sed -i "s|https://your-frontend-url.vercel.app|$VERCEL_URL|g" job-recommender-backend/server.js
    
    # Commit the changes
    git add job-recommender-backend/server.js
    git commit -m "Update CORS configuration with Vercel URL"
    
    # Push the changes
    git push
fi

echo ""
echo "Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Deploy your backend to Render following the instructions in VERCEL_RENDER_DEPLOYMENT.md"
echo "2. Deploy your frontend to Vercel following the instructions in VERCEL_RENDER_DEPLOYMENT.md"
echo "3. Update the REACT_APP_API_URL environment variable in Vercel with your Render backend URL"
echo ""
echo "For detailed instructions, refer to VERCEL_RENDER_DEPLOYMENT.md"

exit 0 