export type UserRole = 'doctor' | 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  images: string[];
  diagnosis: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
} 