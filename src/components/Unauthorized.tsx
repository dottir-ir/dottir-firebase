import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UnauthorizedProps {
  message?: string;
  redirectPath?: string;
}

export const Unauthorized: React.FC<UnauthorizedProps> = ({ 
  message = 'You do not have permission to access this page.',
  redirectPath = '/'
}) => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized">
      <h1>Unauthorized Access</h1>
      <p>{message}</p>
      <button 
        onClick={() => navigate(redirectPath)}
        className="back-button"
      >
        Go Back
      </button>
    </div>
  );
}; 