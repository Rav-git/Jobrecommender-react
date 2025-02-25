# Vercel Deployment Guide for AI Job Matcher Frontend

This guide provides specific instructions for deploying the AI Job Matcher frontend to Vercel.

## Automatic Deployment

The easiest way to deploy is directly through the Vercel dashboard:

1. Sign up/login at [vercel.com](https://vercel.com)
2. Click "Add New" and select "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: React (Create React App)
   - **Root Directory**: `job-recommender-frontend` (if your repository contains both frontend and backend)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `build`
5. Add environment variables:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://job-recommender-api.onrender.com`)
6. Click "Deploy"

## Manual Deployment with Vercel CLI

You can also deploy using the Vercel CLI:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Navigate to the frontend directory:
   ```bash
   cd job-recommender-frontend
   ```

4. Deploy to Vercel:
   ```bash
   vercel
   ```

5. Follow the prompts to configure your project.

## Configuration Files

This project includes several configuration files for Vercel:

- **vercel.json**: Main configuration file for Vercel deployment
- **.env.production**: Environment variables for production
- **build.js**: Custom build script for additional build steps

## Build Process

The build process for Vercel is defined in the `vercel-build` script in `package.json`:

```json
"vercel-build": "CI=false react-scripts build && node build.js"
```

This script:
1. Builds the React application with warnings treated as non-fatal
2. Runs the custom build.js script for any additional build steps

## Troubleshooting

### Build Failures

If your build fails, check the following:

- Ensure all dependencies are correctly listed in package.json
- Check for any ESLint or TypeScript errors (we set CI=false to ignore warnings)
- Verify that the Node.js version is compatible (Vercel uses Node.js 14 by default)

### API Connection Issues

If your frontend cannot connect to the backend:

- Verify that the `REACT_APP_API_URL` environment variable is set correctly in Vercel
- Check that CORS is properly configured on your backend
- Test the API endpoint directly to ensure it's accessible

## Updating Your Deployment

When you push changes to your GitHub repository, Vercel will automatically rebuild and redeploy your application if you've set up GitHub integration.

To manually trigger a new deployment:

```bash
vercel --prod
```

## Production Optimizations

For better performance in production:

- Enable Vercel's Edge Network for global CDN distribution
- Configure caching headers for static assets
- Consider using Vercel's Analytics for monitoring performance 