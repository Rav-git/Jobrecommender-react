import React from 'react';

const FileUpload = ({ 
  file, 
  loading, 
  uploadProgress, 
  dragActive, 
  onDrag, 
  onDrop, 
  onFileChange, 
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit} className="upload-form animate-in-delay-2">
      <div 
        className={`upload-section ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
      >
        <div className="upload-icon">
          {file ? '📄' : '📁'}
        </div>
        <div className="upload-text">
          {file ? (
            <p className="file-name">{file.name}</p>
          ) : (
            <>
              <p className="drag-text">Drop your resume here</p>
              <p className="or-text">or</p>
            </>
          )}
        </div>
        <input
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          className="file-input"
          id="file-input"
        />
        <label htmlFor="file-input" className="browse-button">
          Browse Files
        </label>
        {file && (
          <button 
            type="submit" 
            disabled={loading}
            className="analyze-button"
          >
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Analyzing Resume... {uploadProgress}%</span>
              </div>
            ) : 'Find Matching Jobs'}
          </button>
        )}
      </div>
    </form>
  );
};

export default FileUpload; 