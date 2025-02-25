import pandas as pd
import spacy
import PyPDF2
import sys
import json
import logging
import os
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Comprehensive technical skills with weights
TECH_SKILLS = {
    'languages': {
        'python': 1.0, 'java': 1.0, 'javascript': 1.0, 'typescript': 0.9,
        'c++': 1.0, 'c#': 1.0, 'ruby': 0.9, 'php': 0.9, 'swift': 0.9,
        'kotlin': 0.9, 'go': 0.9, 'rust': 0.8, 'scala': 0.8
    },
    'web_frontend': {
        'html': 0.8, 'css': 0.8, 'react': 1.0, 'angular': 1.0, 'vue': 0.9,
        'redux': 0.9, 'webpack': 0.8, 'sass': 0.7, 'bootstrap': 0.7,
        'tailwind': 0.8, 'responsive design': 0.8, 'web components': 0.8
    },
    'web_backend': {
        'node.js': 1.0, 'express': 0.9, 'django': 1.0, 'flask': 0.9,
        'spring': 1.0, 'asp.net': 1.0, 'fastapi': 0.8, 'graphql': 0.9,
        'rest api': 0.9, 'microservices': 1.0
    },
    'data': {
        'sql': 1.0, 'mysql': 0.9, 'postgresql': 0.9, 'mongodb': 0.9,
        'redis': 0.8, 'elasticsearch': 0.9, 'hadoop': 0.9, 'spark': 1.0,
        'tableau': 0.8, 'power bi': 0.8, 'data analysis': 0.9,
        'data visualization': 0.8, 'etl': 0.9
    },
    'cloud': {
        'aws': 1.0, 'azure': 1.0, 'gcp': 1.0, 'docker': 1.0,
        'kubernetes': 1.0, 'terraform': 0.9, 'jenkins': 0.9,
        'devops': 1.0, 'ci/cd': 0.9, 'serverless': 0.9
    },
    'ml_ai': {
        'machine learning': 1.0, 'deep learning': 1.0, 'nlp': 1.0,
        'computer vision': 1.0, 'tensorflow': 1.0, 'pytorch': 1.0,
        'scikit-learn': 0.9, 'neural networks': 1.0, 'ai': 0.9,
        'data science': 1.0, 'statistical analysis': 0.9
    },
    'tools_practices': {
        'git': 0.8, 'jira': 0.7, 'agile': 0.9, 'scrum': 0.8,
        'tdd': 0.9, 'unit testing': 0.9, 'debugging': 0.8,
        'problem solving': 0.9, 'code review': 0.8,
        'system design': 1.0, 'architecture': 1.0
    }
}

# Experience levels and their variations
EXPERIENCE_LEVELS = {
    'entry': {'entry level', 'junior', 'graduate', 'fresh', 'trainee', '0-2 years', '1-2 years'},
    'mid': {'mid level', 'intermediate', 'associate', '2-5 years', '3-5 years'},
    'senior': {'senior', 'lead', 'principal', 'architect', '5+ years', '7+ years', '8+ years'}
}

# Flatten skills with their weights
ALL_SKILLS = {
    skill: weight
    for category in TECH_SKILLS.values()
    for skill, weight in category.items()
}

def extract_experience_level(text):
    """Extract experience level from text."""
    text = text.lower()
    levels = []
    for level, keywords in EXPERIENCE_LEVELS.items():
        if any(keyword in text for keyword in keywords):
            levels.append(level)
    return levels[0] if levels else 'mid'  # Default to mid-level if not specified

def load_job_data(data_dir):
    """Load job data from LinkedIn CSV file."""
    try:
        csv_path = os.path.join(data_dir, 'linkdindata.csv')
        logger.info(f"Loading job data from: {csv_path}")
        
        if not os.path.exists(csv_path):
            logger.error(f"CSV file not found at: {csv_path}")
            return None
            
        jobs_df = pd.read_csv(csv_path)
        jobs_df = jobs_df.fillna('')
        jobs_df.columns = jobs_df.columns.str.strip()
        
        logger.info(f"Successfully loaded {len(jobs_df)} jobs")
        return jobs_df
    except Exception as e:
        logger.error(f"Error loading job data: {str(e)}")
        return None

def extract_text_from_pdf(file_path):
    """Extract text from PDF file with error handling."""
    try:
        logger.info(f"Extracting text from PDF: {file_path}")
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + " "
        return text.strip().lower()
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise

def clean_text(text):
    """Clean and normalize text."""
    text = text.lower()
    # First replace special characters except hyphens and slashes
    text = re.sub(r'[^\w\s\-/]', ' ', text)
    # Replace multiple spaces with single space
    text = re.sub(r'\s+', ' ', text)
    # Remove spaces around hyphens and slashes
    text = re.sub(r'\s*([-/])\s*', r'\1', text)
    return text.strip()

def extract_skills_with_weights(text, nlp):
    """Extract skills from text using spaCy and predefined skills with weights."""
    text = clean_text(text)
    doc = nlp(text)
    
    skills_with_weights = {}
    
    # Process text in chunks to find multi-word skills
    text_chunks = set()
    
    # Add noun chunks
    for chunk in doc.noun_chunks:
        text_chunks.add(chunk.text.lower())
    
    # Add individual words
    for token in doc:
        if not token.is_stop and not token.is_punct:
            text_chunks.add(token.text.lower())
    
    # Add bigrams and trigrams
    words = text.split()
    for i in range(len(words)-1):
        text_chunks.add(f"{words[i]} {words[i+1]}")
        if i < len(words)-2:
            text_chunks.add(f"{words[i]} {words[i+1]} {words[i+2]}")
    
    # Match skills and assign weights
    for chunk in text_chunks:
        chunk = chunk.strip()
        if chunk in ALL_SKILLS:
            skills_with_weights[chunk] = ALL_SKILLS[chunk]
    
    logger.info(f"Extracted {len(skills_with_weights)} skills: {list(skills_with_weights.keys())}")
    return skills_with_weights

def calculate_match_scores(resume_skills, job_skills, resume_text, job_text):
    """Calculate comprehensive match score between resume and job."""
    try:
        # Calculate weighted skill match score
        common_skills = set(resume_skills.keys()) & set(job_skills.keys())
        logger.info(f"Found {len(common_skills)} matching skills")
        
        if not resume_skills or not job_skills:
            logger.warning("No skills found in either resume or job")
            return 0, 0, []
        
        # Calculate weighted skill score
        skill_score = sum(ALL_SKILLS[skill] for skill in common_skills)
        resume_total = sum(weight for weight in resume_skills.values())
        job_total = sum(weight for weight in job_skills.values())
        
        if resume_total == 0 or job_total == 0:
            logger.warning("No weighted skills found")
            weighted_skill_score = 0
        else:
            # Use harmonic mean for better balance
            weighted_skill_score = (
                2 * skill_score / (resume_total + job_total)
            ) * 100
        
        # Calculate text similarity score
        try:
            vectorizer = TfidfVectorizer(
                stop_words='english',
                ngram_range=(1, 2),  # Include bigrams
                max_features=1000
            )
            tfidf_matrix = vectorizer.fit_transform([resume_text, job_text])
            similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0] * 100
        except Exception as e:
            logger.error(f"Error calculating text similarity: {str(e)}")
            similarity_score = 0
        
        # Experience level matching
        try:
            resume_level = extract_experience_level(resume_text)
            job_level = extract_experience_level(job_text)
            logger.info(f"Experience levels - Resume: {resume_level}, Job: {job_level}")
            
            experience_multiplier = 1.0
            if resume_level == job_level:
                experience_multiplier = 1.2
            elif abs(list(EXPERIENCE_LEVELS.keys()).index(resume_level) - 
                    list(EXPERIENCE_LEVELS.keys()).index(job_level)) == 1:
                experience_multiplier = 0.8
        except Exception as e:
            logger.error(f"Error matching experience levels: {str(e)}")
            experience_multiplier = 1.0
        
        # Calculate final score with weights
        final_score = (
            weighted_skill_score * 0.6 +  # Skills are most important
            similarity_score * 0.3 +      # Overall text similarity
            weighted_skill_score * 0.1 * experience_multiplier  # Experience level bonus
        )
        
        logger.info(f"Scores - Final: {final_score:.2f}, Skills: {weighted_skill_score:.2f}, "
                   f"Similarity: {similarity_score:.2f}, Exp Multiplier: {experience_multiplier:.1f}")
        
        return final_score, weighted_skill_score, list(common_skills)
        
    except Exception as e:
        logger.error(f"Error in match score calculation: {str(e)}")
        return 0, 0, []

def get_job_recommendations(resume_path, data_dir, num_recommendations=5):
    """Get job recommendations based on resume skills."""
    try:
        # Check if resume file exists
        if not os.path.exists(resume_path):
            logger.error(f"Resume file not found: {resume_path}")
            return {"error": "Resume file not found"}

        # Check if data directory exists
        if not os.path.exists(data_dir):
            logger.error(f"Data directory not found: {data_dir}")
            return {"error": "Data directory not found"}

        logger.info("Loading spaCy model")
        try:
            nlp = spacy.load('en_core_web_sm')
        except Exception as e:
            logger.error(f"Error loading spaCy model: {str(e)}")
            return {"error": "Error loading language model"}
        
        jobs_df = load_job_data(data_dir)
        if jobs_df is None:
            return {"error": "Failed to load job data"}
        
        try:
            resume_text = extract_text_from_pdf(resume_path)
            if not resume_text:
                return {"error": "Could not extract text from resume"}
        except Exception as e:
            logger.error(f"Error extracting text from resume: {str(e)}")
            return {"error": "Error processing resume file"}
        
        resume_skills = extract_skills_with_weights(resume_text, nlp)
        logger.info(f"Resume skills: {list(resume_skills.keys())}")
        
        if not resume_skills:
            return {"error": "No relevant skills found in resume"}
        
        job_matches = []
        for _, job in jobs_df.iterrows():
            try:
                job_text = clean_text(str(job['job_description']))
                job_skills = extract_skills_with_weights(job_text, nlp)
                
                final_score, skill_score, matching_skills = calculate_match_scores(
                    resume_skills, job_skills, resume_text, job_text
                )
                
                job_matches.append({
                    "title": job['j_tittle'],
                    "company": job['c_name'],
                    "location": job['company_locations'],
                    "description": job['job_description'],
                    "apply_link": job['Apply_link'],
                    "match_score": round(final_score, 2),
                    "skill_score": round(skill_score, 2),
                    "matching_skills": matching_skills,
                    "experience_level": extract_experience_level(job_text)
                })
            except Exception as e:
                logger.error(f"Error processing job: {str(e)}")
                continue
        
        if not job_matches:
            return {"error": "No matching jobs found"}
        
        job_matches.sort(key=lambda x: x['match_score'], reverse=True)
        recommendations = job_matches[:num_recommendations]
        
        logger.info(f"Generated {len(recommendations)} recommendations")
        return recommendations
        
    except Exception as e:
        logger.error(f"Error in job recommendation process: {str(e)}")
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Please provide the resume file path"}))
        sys.exit(1)
        
    resume_path = sys.argv[1]
    if not Path(resume_path).exists():
        print(json.dumps({"error": "Resume file not found"}))
        sys.exit(1)
    
    data_dir = os.path.dirname(os.path.abspath(resume_path))
        
    try:
        recommendations = get_job_recommendations(resume_path, data_dir)
        print(json.dumps(recommendations))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
