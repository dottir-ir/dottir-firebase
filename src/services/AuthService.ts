import { db, auth, storage } from '@/lib/firebase';
import { 
  getDoc, setDoc, updateDoc, deleteDoc, 
  collection, doc, query, where, orderBy, 
  limit, startAfter, getDocs, onSnapshot,
  serverTimestamp, Timestamp 
} from 'firebase/firestore';
import { 
  ref, uploadBytes, getDownloadURL, deleteObject 
} from 'firebase/storage';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';
import type { User, UserProfile } from '../models/User';

export type UserRole = 'doctor' | 'student' | 'admin';

interface RegisterOptions {
  title: string;
  medicalSchool?: string;
  yearOfStudy?: number;
  areasOfInterest?: string[];
  verificationDocuments?: string[];
}

class AuthService {
  async register(
    email: string,
    password: string,
    role: UserRole,
    displayName?: string,
    options?: RegisterOptions
  ): Promise<UserProfile> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userProfile: UserProfile = {
        id: user.uid,
        email,
        displayName: displayName || '',
        role,
        title: options?.title || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        doctorVerificationStatus: role === 'doctor' ? 'pending' : undefined,
        // Student-specific fields
        medicalSchool: role === 'student' ? options?.medicalSchool : undefined,
        yearOfStudy: role === 'student' ? options?.yearOfStudy : undefined,
        areasOfInterest: role === 'student' ? options?.areasOfInterest : undefined,
        // Doctor-specific fields
        verificationDocuments: role === 'doctor' ? options?.verificationDocuments : undefined,
      };

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), userProfile);

      return userProfile;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const data = userDoc.data();
      return {
        ...data,
        id: user.uid,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        lastLoginAt: data.lastLoginAt?.toDate(),
      } as UserProfile;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return null;
      
      const data = userDoc.data();
      return {
        ...data,
        id: user.uid,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        lastLoginAt: data.lastLoginAt?.toDate(),
      } as UserProfile;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadDoctorVerification(userId: string, documentUrl: string): Promise<void> {
    try {
      await setDoc(doc(db, 'users', userId), {
        doctorVerificationDoc: documentUrl,
        doctorVerificationStatus: 'pending',
        updatedAt: new Date(),
      }, { merge: true });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    console.error('Auth Error:', error);
    return new Error(error.message || 'An authentication error occurred');
  }
}

export const authService = new AuthService(); 