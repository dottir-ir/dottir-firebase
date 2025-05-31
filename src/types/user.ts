import type { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'doctor' | 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  title: string;
  specialization?: string;
  institution?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  doctorVerificationStatus?: 'pending' | 'verified' | 'rejected';
  verificationDocuments?: string[];
  // Student-specific fields
  medicalSchool?: string;
  yearOfStudy?: number;
  areasOfInterest?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  doctorVerificationStatus?: 'pending' | 'verified' | 'rejected';
  medicalSchool?: string;
  yearOfStudy?: number;
  areasOfInterest?: string[];
  verificationDocuments?: string[];
  rejectionReason?: string;
} 