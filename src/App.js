import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Import components
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import JobList from './components/JobList';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  // API base URL - will be different in production
  const API_URL = process.env.REACT_APP_API_URL || 'https://jobrecommender-react.onrender.com';

  useEffect(() => {
    // Intro animation timing
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a PDF file');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendations([]);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setRecommendations(response.data);
      }
    } catch (err) {
      console.error('Upload error:', err);
      if (err.response) {
        setError(err.response.data.error || 'Error uploading file. Please try again.');
      } else if (err.request) {
        setError('No response from server. Please try again.');
      } else {
        setError('Error uploading file. Please try again.');
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'linear-gradient(135deg, #059669, #10B981)';
    if (score >= 60) return 'linear-gradient(135deg, #3B82F6, #60A5FA)';
    if (score >= 40) return 'linear-gradient(135deg, #D97706, #FBBF24)';
    return 'linear-gradient(135deg, #DC2626, #EF4444)';
  };

  const handleSkillClick = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredJobs = recommendations.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.every(skill => 
        job.matching_skills?.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );

    return matchesSearch && matchesSkills;
  });

  return (
    <div className={`App ${showIntro ? 'intro' : ''}`}>
      <div className="background-pattern"></div>
      <div className="animated-circles">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="circle"></div>
        ))}
      </div>
      
      <main className="main-content">
        <Header />
        
        <FileUpload 
          file={file}
          loading={loading}
          uploadProgress={uploadProgress}
          dragActive={dragActive}
          onDrag={handleDrag}
          onDrop={handleDrop}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
        />

        <ErrorMessage message={error} />

        {recommendations.length > 0 && (
          <JobList 
            recommendations={recommendations}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedSkills={selectedSkills}
            onSkillClick={handleSkillClick}
            filteredJobs={filteredJobs}
          />
        )}
      </main>
    </div>
  );
}

export default App;
