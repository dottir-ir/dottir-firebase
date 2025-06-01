import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { AuthService } from '../AuthService';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MockAuthProvider } from '@/test/mocks/AuthProvider';
import { mockUser, mockCase, mockComment } from '@/test/mocks/data';

// Mock Firebase
vi.mock('firebase/auth');
vi.mock('firebase/firestore');
vi.mock('../../config/firebase');

describe('AuthService', () => {
  const authService = new AuthService();
  
  const mockUser = {
    uid: 'user1',
    email: 'test@example.com',
  } as FirebaseUser;

  const mockUserProfile = {
    id: 'user1',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'doctor' as const,
    title: 'Dr.',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    doctorVerificationStatus: 'pending',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      });

      const result = await authService.register(
        'test@example.com',
        'password123',
        'doctor',
        'Test User',
        {
          title: 'Dr.',
          verificationDocuments: ['doc1.pdf'],
        }
      );

      expect(result).toEqual(expect.objectContaining({
        id: 'user1',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'doctor',
        title: 'Dr.',
        doctorVerificationStatus: 'pending',
        verificationDocuments: ['doc1.pdf'],
      }));

      expect(setDoc).toHaveBeenCalledWith(
        doc(db, 'users', 'user1'),
        expect.objectContaining({
          id: 'user1',
          email: 'test@example.com',
          displayName: 'Test User',
          role: 'doctor',
          title: 'Dr.',
          doctorVerificationStatus: 'pending',
          verificationDocuments: ['doc1.pdf'],
        })
      );
    });

    it('should register a student successfully', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      });

      const result = await authService.register(
        'test@example.com',
        'password123',
        'student',
        'Test Student',
        {
          title: 'Mr.',
          medicalSchool: 'Test Medical School',
          yearOfStudy: 3,
          areasOfInterest: ['Cardiology', 'Neurology'],
        }
      );

      expect(result).toEqual(expect.objectContaining({
        id: 'user1',
        email: 'test@example.com',
        displayName: 'Test Student',
        role: 'student',
        title: 'Mr.',
        medicalSchool: 'Test Medical School',
        yearOfStudy: 3,
        areasOfInterest: ['Cardiology', 'Neurology'],
      }));
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      });
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => mockUserProfile,
      });

      const result = await authService.login('test@example.com', 'password123');
      expect(result).toEqual(mockUserProfile);
    });

    it('should throw error when user profile not found', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      });
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });

      await expect(authService.login('test@example.com', 'password123')).rejects.toThrow('User profile not found');
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      await authService.logout();
      expect(signOut).toHaveBeenCalledWith(auth);
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email successfully', async () => {
      await authService.resetPassword('test@example.com');
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, 'test@example.com');
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', async () => {
      (auth.currentUser as any) = null;
      const result = await authService.getCurrentUser();
      expect(result).toBeNull();
    });

    it('should return user profile when user is logged in', async () => {
      (auth.currentUser as any) = mockUser;
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => mockUserProfile,
      });

      const result = await authService.getCurrentUser();
      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('uploadDoctorVerification', () => {
    it('should update user profile with verification document', async () => {
      await authService.uploadDoctorVerification('user1', 'doc1.pdf');
      expect(setDoc).toHaveBeenCalledWith(
        doc(db, 'users', 'user1'),
        {
          doctorVerificationDoc: 'doc1.pdf',
          doctorVerificationStatus: 'pending',
          updatedAt: expect.any(Date),
        },
        { merge: true }
      );
    });
  });
}); 