import React from 'react';
import type { User } from '../types/user';
import { useNavigate } from 'react-router-dom';

interface VerificationPendingProps {
  user: User;
  onContactSupport?: () => void;
}

export const VerificationPending: React.FC<VerificationPendingProps> = ({ 
  user,
  onContactSupport
}) => {
  const navigate = useNavigate();

  return (
    <div className="verification-pending">
      <h1>Verification Pending</h1>
      <div className="verification-content">
        <p>
          Hello {user.displayName}, your account verification is currently pending review.
          This process typically takes 1-2 business days.
        </p>
        
        <div className="verification-status">
          <h2>Current Status</h2>
          <p>Role: {user.role}</p>
          <p>Title: {user.title}</p>
          {user.institution && <p>Institution: {user.institution}</p>}
          {user.specialization && <p>Specialization: {user.specialization}</p>}
        </div>

        <div className="verification-actions">
          <button 
            onClick={() => navigate('/')}
            className="home-button"
          >
            Return to Home
          </button>
          
          {onContactSupport && (
            <button 
              onClick={onContactSupport}
              className="support-button"
            >
              Contact Support
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 