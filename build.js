const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// This script handles the build process for Render deployment
console.log('Running enhanced build script for Render deployment...');

// Check if package.json exists and has a build script
const packageJsonPath = path.join(__dirname, 'package.json');
let packageJson;

try {
  // Read and parse package.json
  if (fs.existsSync(packageJsonPath)) {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log('Found package.json file');
  } else {
    console.error('Error: package.json not found!');
    process.exit(1);
  }

  // Check if build script exists, if not, add it
  if (!packageJson.scripts || !packageJson.scripts.build) {
    console.log('Build script not found in package.json, adding it...');
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    // Add build script for React
    packageJson.scripts.build = 'react-scripts build';
    
    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Added build script to package.json');
  }

  // Check if react-scripts is in dependencies
  if (!packageJson.dependencies || !packageJson.dependencies['react-scripts']) {
    console.log('react-scripts not found in dependencies, installing...');
    try {
      execSync('npm install --save react-scripts', { stdio: 'inherit' });
      console.log('Successfully installed react-scripts');
    } catch (error) {
      console.error('Error installing react-scripts:', error.message);
    }
  }

  // Run the build command
  console.log('Running React build process...');
  try {
    execSync('CI=false npm run build', { stdio: 'inherit' });
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Error during build:', error.message);
    process.exit(1);
  }

  // Create _redirects file for SPA routing
  const buildDir = path.join(__dirname, 'build');
  if (fs.existsSync(buildDir)) {
    fs.writeFileSync(
      path.join(buildDir, '_redirects'),
      '/* /index.html 200'
    );
    console.log('Created _redirects file for SPA routing');
  }

  // Copy or modify files as needed
  console.log('Processing additional build steps...');

  // Create a runtime config file with environment variables
  if (fs.existsSync(buildDir)) {
    const runtimeConfig = {
      API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
    };
    
    fs.writeFileSync(
      path.join(buildDir, 'runtime-config.json'),
      JSON.stringify(runtimeConfig, null, 2)
    );
    console.log('Created runtime-config.json with environment variables');
  }

  console.log('Build customization completed successfully');
} catch (error) {
  console.error('Error during build customization:', error);
  process.exit(1);
} 