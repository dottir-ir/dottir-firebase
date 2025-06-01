import type { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'patient' | 'doctor' | 'admin' | 'student';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  title?: string;
  specialization?: string;
  institution?: string;
  bio?: string;
  experience?: string;
  areasOfInterest?: string[];
  verificationDocuments?: string[];
  medicalSchool?: string;
  yearOfStudy?: number;
  doctorVerificationStatus?: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
  // Optional profile fields
  phoneNumber?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

// For backward compatibility
export type UserProfile = User;

// Type guard to check if a user is a doctor
export function isDoctor(user: User): boolean {
  return user.role === 'doctor';
}

// Type guard to check if a user is a student
export function isStudent(user: User): boolean {
  return user.role === 'student';
}

// Type guard to check if a user is an admin
export function isAdmin(user: User): boolean {
  return user.role === 'admin';
}

// Type guard to check if a user is a patient
export function isPatient(user: User): boolean {
  return user.role === 'patient';
} 