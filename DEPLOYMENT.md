# Deployment Guide for AI Job Matcher

This guide provides instructions for deploying the AI Job Matcher application in various environments.

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Python 3.10+ (for local development)
- Git

## Local Deployment with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd job-recommender
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

## Manual Deployment

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd job-recommender-backend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Download the spaCy model:
   ```bash
   python -m spacy download en_core_web_sm
   ```

5. Create necessary directories:
   ```bash
   mkdir -p uploads data
   ```

6. Ensure data files are in the data directory:
   - `linkdindata.csv`
   - `skills.csv`

7. Start the backend server:
   ```bash
   node server.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd job-recommender-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.production` file with the backend URL:
   ```
   REACT_APP_API_URL=http://your-backend-url:5000
   ```

4. Build the production version:
   ```bash
   npm run build
   ```

5. Serve the built files using a web server like Nginx or serve:
   ```bash
   npx serve -s build
   ```

## Cloud Deployment

### AWS Deployment

1. Create an EC2 instance with Docker installed
2. Clone the repository on the instance
3. Configure the `.env.production` file with the correct backend URL
4. Run `docker-compose up -d`
5. Configure security groups to allow traffic on ports 80 and 5000

### Heroku Deployment

1. Create two Heroku apps (one for frontend, one for backend)
2. Configure the backend app:
   ```bash
   cd job-recommender-backend
   heroku git:remote -a your-backend-app-name
   heroku buildpacks:add heroku/nodejs
   heroku buildpacks:add heroku/python
   git push heroku main
   ```

3. Configure the frontend app:
   ```bash
   cd job-recommender-frontend
   heroku git:remote -a your-frontend-app-name
   heroku config:set REACT_APP_API_URL=https://your-backend-app-name.herokuapp.com
   git push heroku main
   ```

## Environment Variables

### Backend
- `PORT`: Port number for the backend server (default: 5000)
- `NODE_ENV`: Environment mode (development/production)

### Frontend
- `REACT_APP_API_URL`: URL of the backend API

## Troubleshooting

- If you encounter CORS issues, ensure the backend is properly configured to allow requests from the frontend origin
- Check that all required data files are present in the data directory
- Verify that the spaCy model is correctly installed
- Ensure the Python version is compatible (3.10+ recommended)

## Maintenance

- Regularly update dependencies for security patches
- Monitor server logs for errors
- Back up the data directory regularly 