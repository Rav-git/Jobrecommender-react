#!/usr/bin/env node

/**
 * This script helps deploy the frontend to Vercel
 * It prepares the environment and configuration for optimal Vercel deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}AI Job Matcher - Vercel Deployment Helper${colors.reset}\n`);

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log(`${colors.green}✓ Vercel CLI is installed${colors.reset}`);
} catch (error) {
  console.log(`${colors.yellow}! Vercel CLI is not installed. Installing...${colors.reset}`);
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Vercel CLI installed successfully${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}✗ Failed to install Vercel CLI. Please install it manually with 'npm install -g vercel'${colors.reset}`);
    process.exit(1);
  }
}

// Check if we're in the right directory
const frontendDir = path.join(__dirname, 'job-recommender-frontend');
if (!fs.existsSync(frontendDir)) {
  console.error(`${colors.red}✗ Frontend directory not found. Make sure you're running this script from the project root.${colors.reset}`);
  process.exit(1);
}

// Prompt for backend URL
rl.question(`${colors.yellow}Enter your Render backend URL (e.g., https://job-recommender-api.onrender.com): ${colors.reset}`, (backendUrl) => {
  if (!backendUrl) {
    console.log(`${colors.yellow}! No backend URL provided. You'll need to set this in Vercel environment variables later.${colors.reset}`);
  } else {
    // Update .env.production with the backend URL
    const envPath = path.join(frontendDir, '.env.production');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    
    // Replace or add the REACT_APP_API_URL
    if (envContent.includes('REACT_APP_API_URL=')) {
      envContent = envContent.replace(/REACT_APP_API_URL=.*/, `REACT_APP_API_URL=${backendUrl}`);
    } else {
      envContent += `\nREACT_APP_API_URL=${backendUrl}`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log(`${colors.green}✓ Updated .env.production with backend URL${colors.reset}`);
  }

  console.log(`\n${colors.bright}Deploying to Vercel...${colors.reset}`);
  
  try {
    // Change to frontend directory
    process.chdir(frontendDir);
    
    // Run Vercel deployment
    console.log(`${colors.yellow}! You'll be prompted to log in to Vercel if you haven't already.${colors.reset}`);
    console.log(`${colors.yellow}! Follow the prompts to configure your project.${colors.reset}\n`);
    
    execSync('vercel', { stdio: 'inherit' });
    
    console.log(`\n${colors.green}${colors.bright}✓ Deployment initiated successfully!${colors.reset}`);
    console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
    console.log(`1. Complete the Vercel setup in your browser if prompted`);
    console.log(`2. Set environment variables in the Vercel dashboard if needed`);
    console.log(`3. Update your backend CORS settings with the Vercel URL`);
    
    rl.close();
  } catch (error) {
    console.error(`\n${colors.red}✗ Deployment failed: ${error.message}${colors.reset}`);
    console.log(`\n${colors.yellow}Try deploying manually:${colors.reset}`);
    console.log(`1. cd job-recommender-frontend`);
    console.log(`2. vercel`);
    rl.close();
    process.exit(1);
  }
}); 