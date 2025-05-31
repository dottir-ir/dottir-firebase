export interface User {
  id: string;
  uid?: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'doctor' | 'student' | 'admin';
  title: string;
  specialization?: string;
  institution?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  doctorVerificationStatus?: 'pending' | 'verified' | 'rejected';
  verificationDocuments?: string[];
  rejectionReason?: string;
  // Student-specific fields
  medicalSchool?: string;
  yearOfStudy?: number;
  areasOfInterest?: string[];
}

export interface UserProfile extends Omit<User, 'email'> {
  email?: string;
  phoneNumber?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  rejectionReason?: string;
} 