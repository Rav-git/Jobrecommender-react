# AI Job Matcher

A modern web application that uses AI to match job seekers with relevant job opportunities based on their resume.

![AI Job Matcher Screenshot](screenshot.png)

## Features

- **Resume Analysis**: Upload your resume in PDF format for AI-powered analysis
- **Skill Extraction**: Automatically extracts skills from your resume
- **Job Matching**: Matches your skills with job opportunities
- **Interactive UI**: Modern, responsive interface with drag-and-drop functionality
- **Filtering**: Filter job results by search terms or skills

## Tech Stack

### Frontend
- React.js
- Modern CSS with animations and glassmorphism design
- Responsive layout for all devices

### Backend
- Node.js with Express
- Python for NLP processing
- spaCy for natural language processing
- PDF parsing capabilities

## Project Structure

```
job-recommender/
├── job-recommender-frontend/    # React frontend
│   ├── public/                  # Static files
│   ├── src/                     # Source code
│   │   ├── components/          # React components
│   │   ├── App.js               # Main application component
│   │   └── App.css              # Styles
│   ├── Dockerfile               # Frontend Docker configuration
│   └── nginx.conf               # Nginx configuration
│
├── job-recommender-backend/     # Node.js and Python backend
│   ├── data/                    # Data files
│   ├── uploads/                 # Temporary upload directory
│   ├── process_resume.py        # Python script for resume processing
│   ├── server.js                # Express server
│   ├── Dockerfile               # Backend Docker configuration
│   └── requirements.txt         # Python dependencies
│
├── docker-compose.yml           # Docker Compose configuration
├── DEPLOYMENT.md                # Deployment instructions
└── README.md                    # This file
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python 3.10+
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd job-recommender
   ```

2. Set up the backend:
   ```bash
   cd job-recommender-backend
   npm install
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

3. Set up the frontend:
   ```bash
   cd ../job-recommender-frontend
   npm install
   ```

4. Start the backend server:
   ```bash
   cd ../job-recommender-backend
   node server.js
   ```

5. Start the frontend development server:
   ```bash
   cd ../job-recommender-frontend
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`

### Docker Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Usage

1. Upload your resume (PDF format) using the drag-and-drop interface or file browser
2. Wait for the AI to analyze your resume and match it with job opportunities
3. Browse through the matched jobs, filter by search terms or click on skills to filter
4. Click "Apply Now" to visit the job application page

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- spaCy for natural language processing
- React.js for the frontend framework
- All the open-source libraries that made this project possible 