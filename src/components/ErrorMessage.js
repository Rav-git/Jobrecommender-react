import React from 'react';

const ErrorMessage = ({ message }) => {
  return message ? (
    <div className="error-message animate-in">
      <span className="error-icon">⚠️</span>
      {message}
    </div>
  ) : null;
};

export default ErrorMessage; 