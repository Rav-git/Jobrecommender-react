# Deploying AI Job Matcher to Vercel and Render

This guide provides step-by-step instructions for deploying the AI Job Matcher application using Vercel for the frontend and Render for the backend.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- Git installed on your local machine

## Step 1: Prepare Your Repository

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/job-recommender.git
   git push -u origin main
   ```

## Step 2: Deploy Backend to Render

1. Log in to your Render account at [render.com](https://render.com)

2. Click on "New" and select "Web Service"

3. Connect your GitHub repository

4. Configure the service:
   - **Name**: job-recommender-api
   - **Environment**: Node
   - **Build Command**: 
     ```
     apt-get update && apt-get install -y python3 python3-pip && pip3 install -r requirements.txt && python3 -m spacy download en_core_web_sm && npm install
     ```
   - **Start Command**: `node server.js`
   - **Root Directory**: `job-recommender-backend` (if your repository contains both frontend and backend)

5. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render assigns a port via the PORT environment variable)

6. Create a disk:
   - Click on "Advanced" and add a disk
   - **Name**: data
   - **Mount Path**: /app/data
   - **Size**: 1 GB

7. Click "Create Web Service"

8. After deployment, note the URL of your backend service (e.g., `https://job-recommender-api.onrender.com`)

9. Upload your data files:
   - Go to your service dashboard
   - Navigate to the "Shell" tab
   - Create the data directory if it doesn't exist: `mkdir -p /app/data`
   - Use the file upload feature to upload `linkdindata.csv` and `skills.csv` to the `/app/data` directory

## Step 3: Deploy Frontend to Vercel

1. Log in to your Vercel account at [vercel.com](https://vercel.com)

2. Click "Add New" and select "Project"

3. Import your GitHub repository

4. Configure the project:
   - **Framework Preset**: React
   - **Root Directory**: `job-recommender-frontend` (if your repository contains both frontend and backend)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add environment variables:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://job-recommender-api.onrender.com`)

6. Click "Deploy"

7. After deployment, Vercel will provide you with a URL for your frontend application

## Step 4: Configure CORS on Backend

To allow your Vercel frontend to communicate with your Render backend, you need to update the CORS configuration in your backend's `server.js` file:

```javascript
// Add your Vercel domain to the allowed origins
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

Commit and push this change to your repository, and Render will automatically redeploy your backend.

## Step 5: Test Your Deployment

1. Open your Vercel frontend URL in a browser
2. Upload a resume and test the job matching functionality
3. Check the Render logs if you encounter any issues with the backend

## Troubleshooting

### Frontend Issues

- **API Connection Problems**: Verify that the `REACT_APP_API_URL` environment variable is set correctly in Vercel
- **Build Failures**: Check the build logs in Vercel for any errors

### Backend Issues

- **Deployment Failures**: Check the build logs in Render
- **Runtime Errors**: Check the logs in the Render dashboard
- **Data File Issues**: Verify that the data files are correctly uploaded to the `/app/data` directory
- **CORS Errors**: Ensure that your frontend URL is added to the allowed origins in the CORS configuration

## Maintenance

- Both Vercel and Render will automatically redeploy your application when you push changes to your GitHub repository
- Monitor your usage to stay within the free tier limits
- Regularly back up your data files

## Upgrading

- Render free tier has limitations on usage and may put your service to sleep after periods of inactivity
- Consider upgrading to a paid plan if you need more resources or want to avoid the service sleeping 