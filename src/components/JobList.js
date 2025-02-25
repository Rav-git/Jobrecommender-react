import React from 'react';
import JobCard from './JobCard';
import SearchBar from './SearchBar';

const JobList = ({ 
  recommendations, 
  searchQuery, 
  onSearchChange, 
  selectedSkills, 
  onSkillClick,
  filteredJobs 
}) => {
  return (
    <div className="recommendations animate-in">
      <div className="recommendations-header">
        <h2>Your Job Matches</h2>
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </div>
      
      <div className="job-list">
        {filteredJobs.map((job, index) => (
          <JobCard
            key={index}
            job={job}
            index={index}
            selectedSkills={selectedSkills}
            onSkillClick={onSkillClick}
          />
        ))}
      </div>
    </div>
  );
};

export default JobList; 