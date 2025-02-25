import React from 'react';

const JobCard = ({ job, selectedSkills, onSkillClick, index }) => {
  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'linear-gradient(135deg, #059669, #10B981)';
    if (score >= 60) return 'linear-gradient(135deg, #3B82F6, #60A5FA)';
    if (score >= 40) return 'linear-gradient(135deg, #D97706, #FBBF24)';
    return 'linear-gradient(135deg, #DC2626, #EF4444)';
  };

  return (
    <div 
      className="job-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="job-card-content">
        <div className="job-header">
          <div className="job-title-section">
            <h3>{job.title}</h3>
            <span className="company-name">{job.company}</span>
          </div>
          <div 
            className="match-score"
            style={{ background: getMatchScoreColor(job.match_score) }}
          >
            {job.match_score}% Match
          </div>
        </div>
        
        <div className="job-details">
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <span>{job.location}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">💼</span>
            <span>{job.experience_level}</span>
          </div>
        </div>
        
        {job.matching_skills && (
          <div className="skills-section">
            <h4>Matching Skills</h4>
            <div className="skills-list">
              {job.matching_skills.slice(0, 5).map((skill, i) => (
                <span 
                  key={i} 
                  className={`skill-tag ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                  onClick={() => onSkillClick(skill)}
                >
                  {skill}
                </span>
              ))}
              {job.matching_skills.length > 5 && (
                <span className="skill-tag more-skills">
                  +{job.matching_skills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="job-footer">
          <a 
            href={job.apply_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="apply-button"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobCard; 