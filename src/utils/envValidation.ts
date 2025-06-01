import type { FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates all required environment variables
 */
export function validateEnvironmentVariables(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required environment variables
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  // Check for missing variables
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  // Check for empty values
  requiredVars.forEach(varName => {
    if (process.env[varName] === '') {
      errors.push(`Environment variable ${varName} is empty`);
    }
  });

  // Validate Firebase configuration format
  const config = getFirebaseConfig();
  if (config) {
    if (!config.apiKey.match(/^[A-Za-z0-9-_]+$/)) {
      errors.push('Invalid Firebase API key format');
    }
    if (!config.projectId.match(/^[a-z0-9-]+$/)) {
      errors.push('Invalid Firebase project ID format');
    }
    if (!config.authDomain.match(/^[a-z0-9-]+\.firebaseapp\.com$/)) {
      errors.push('Invalid Firebase auth domain format');
    }
  }

  // Check for development environment warnings
  if (process.env.NODE_ENV === 'development') {
    warnings.push('Running in development mode');
    if (process.env.VITE_FIREBASE_PROJECT_ID?.includes('prod')) {
      warnings.push('Warning: Using production Firebase project in development mode');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Gets the Firebase configuration from environment variables
 */
export function getFirebaseConfig(): FirebaseConfig | null {
  try {
    return {
      apiKey: process.env.VITE_FIREBASE_API_KEY!,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.VITE_FIREBASE_APP_ID!
    };
  } catch (error) {
    console.error('Error getting Firebase config:', error);
    return null;
  }
} 