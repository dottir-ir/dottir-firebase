import React from 'react';
import type { User } from '../types/user';

interface DashboardProps {
  user: User;
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="dashboard">
      <h1>Welcome, {user.displayName}</h1>
      <div className="dashboard-content">
        <div className="user-info">
          <h2>Your Profile</h2>
          <p>Role: {user.role}</p>
          <p>Title: {user.title}</p>
          {user.specialization && <p>Specialization: {user.specialization}</p>}
          {user.institution && <p>Institution: {user.institution}</p>}
        </div>
        {onLogout && (
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </div>
  );
}; 