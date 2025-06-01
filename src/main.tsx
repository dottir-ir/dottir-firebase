import React from 'react';
import ReactDOM from 'react-dom/client';
// Import Firebase config first, before any other imports
import './firebase-config';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 