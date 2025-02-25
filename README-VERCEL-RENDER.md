# AI Job Matcher - Vercel & Render Deployment

This README provides a quick overview of deploying the AI Job Matcher application to Vercel (frontend) and Render (backend).

## Quick Start

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/job-recommender.git
   git push -u origin main
   ```

2. **Deploy Backend to Render**:
   - Sign up/login at [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set root directory to `job-recommender-backend`
   - Set build command: 
     ```
     apt-get update && apt-get install -y python3 python3-pip && pip3 install -r requirements.txt && python3 -m spacy download en_core_web_sm && npm install
     ```
   - Set start command: `node server.js`
   - Add environment variable: `NODE_ENV=production`
   - Create a disk with mount path `/app/data`
   - Deploy and note the URL (e.g., `https://job-recommender-api.onrender.com`)

3. **Deploy Frontend to Vercel**:
   - Sign up/login at [vercel.com](https://vercel.com)
   - Create a new project
   - Import your GitHub repository
   - Set root directory to `job-recommender-frontend`
   - Add environment variable: `REACT_APP_API_URL=https://your-render-backend-url.com`
   - Deploy and note the URL

4. **Update CORS in Backend**:
   - Edit `job-recommender-backend/server.js`
   - Update the CORS origin with your Vercel URL
   - Commit and push changes

5. **Upload Data Files to Render**:
   - Go to your Render service dashboard
   - Use the Shell tab to upload `linkdindata.csv` and `skills.csv` to `/app/data`

## Detailed Instructions

For detailed step-by-step instructions, see [VERCEL_RENDER_DEPLOYMENT.md](VERCEL_RENDER_DEPLOYMENT.md).

## Troubleshooting

- **CORS Issues**: Make sure your Vercel frontend URL is added to the allowed origins in the backend
- **Missing Data Files**: Ensure data files are uploaded to the Render disk
- **API Connection Problems**: Verify the `REACT_APP_API_URL` environment variable in Vercel

## Limitations

- Render free tier puts services to sleep after inactivity
- Initial requests after sleep may be slow
- Consider upgrading to paid plans for production use 