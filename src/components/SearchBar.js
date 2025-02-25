import React from 'react';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by title, company, or location..."
        value={searchQuery}
        onChange={onSearchChange}
        className="search-input"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar; 