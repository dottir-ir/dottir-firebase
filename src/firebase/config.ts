import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}

// Custom claims type for user roles
export type UserRole = 'admin' | 'doctor' | 'user';

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Case interface
export interface Case {
  id: string;
  authorId: string;
  title: string;
  description: string;
  status: 'open' | 'closed' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  images: string[];
}

// Comment interface
export interface Comment {
  id: string;
  caseId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Social interaction interfaces
export interface Like {
  id: string;
  caseId: string;
  userId: string;
  createdAt: Date;
}

export interface Save {
  id: string;
  caseId: string;
  userId: string;
  createdAt: Date;
}

let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics }; 