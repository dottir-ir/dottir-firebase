import { db, auth } from '@/firebase-config';
import { 
  getDoc, setDoc, updateDoc, 
  collection, doc, query, where, 
  getDocs
} from 'firebase/firestore';
import { 
  ref, uploadBytes, getDownloadURL, deleteObject 
} from 'firebase/storage';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';
import type { UserProfile, UserRole } from '../types/user';
import { BaseService } from './BaseService';
import { ServiceError } from '@/utils/errors';

interface RegisterOptions {
  title: string;
  medicalSchool?: string;
  yearOfStudy?: number;
  areasOfInterest?: string[];
  verificationDocuments?: string[];
}

export class AuthService extends BaseService {
  private readonly usersCollection = collection(db, 'users');

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
        uid: user.uid,
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
      await setDoc(doc(this.usersCollection, user.uid), userProfile);

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
      const userDoc = await getDoc(doc(this.usersCollection, user.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const data = userDoc.data();
      return {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || '',
        role: data.role || 'patient',
        photoURL: user.photoURL || undefined,
        title: data.title,
        specialization: data.specialization,
        institution: data.institution,
        bio: data.bio,
        experience: data.experience,
        areasOfInterest: data.areasOfInterest,
        verificationDocuments: data.verificationDocuments,
        medicalSchool: data.medicalSchool,
        yearOfStudy: data.yearOfStudy,
        doctorVerificationStatus: data.doctorVerificationStatus,
        rejectionReason: data.rejectionReason,
        lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        phoneNumber: data.phoneNumber,
        location: data.location,
        website: data.website,
        socialLinks: data.socialLinks
      };
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
      const userDoc = await getDoc(doc(this.usersCollection, user.uid));
      if (!userDoc.exists()) return null;
      
      const data = userDoc.data();
      return {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || '',
        role: data.role || 'patient',
        photoURL: user.photoURL || undefined,
        title: data.title,
        specialization: data.specialization,
        institution: data.institution,
        bio: data.bio,
        experience: data.experience,
        areasOfInterest: data.areasOfInterest,
        verificationDocuments: data.verificationDocuments,
        medicalSchool: data.medicalSchool,
        yearOfStudy: data.yearOfStudy,
        doctorVerificationStatus: data.doctorVerificationStatus,
        rejectionReason: data.rejectionReason,
        lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        phoneNumber: data.phoneNumber,
        location: data.location,
        website: data.website,
        socialLinks: data.socialLinks
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadDoctorVerification(userId: string, documentUrl: string): Promise<void> {
    try {
      await setDoc(doc(this.usersCollection, userId), {
        doctorVerificationDoc: documentUrl,
        doctorVerificationStatus: 'pending',
        updatedAt: new Date(),
      }, { merge: true });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserById(userId: string): Promise<UserProfile> {
    try {
      const userDoc = await getDoc(doc(this.usersCollection, userId));
      if (!userDoc.exists()) {
        throw new ServiceError('User not found', 'not-found');
      }
      const data = userDoc.data();
      return {
        uid: userId,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
        photoURL: data.photoURL,
        title: data.title,
        specialization: data.specialization,
        institution: data.institution,
        bio: data.bio,
        experience: data.experience,
        areasOfInterest: data.areasOfInterest,
        verificationDocuments: data.verificationDocuments,
        medicalSchool: data.medicalSchool,
        yearOfStudy: data.yearOfStudy,
        doctorVerificationStatus: data.doctorVerificationStatus,
        rejectionReason: data.rejectionReason,
        lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        phoneNumber: data.phoneNumber,
        location: data.location,
        website: data.website,
        socialLinks: data.socialLinks
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    try {
      await updateDoc(doc(this.usersCollection, userId), profile);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createUser(userId: string, userData: Partial<UserProfile>): Promise<void> {
    try {
      await setDoc(doc(this.usersCollection, userId), userData);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      const q = query(this.usersCollection, where('email', '==', email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return null;
      }
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
        photoURL: data.photoURL,
        title: data.title,
        specialization: data.specialization,
        institution: data.institution,
        bio: data.bio,
        experience: data.experience,
        areasOfInterest: data.areasOfInterest,
        verificationDocuments: data.verificationDocuments,
        medicalSchool: data.medicalSchool,
        yearOfStudy: data.yearOfStudy,
        doctorVerificationStatus: data.doctorVerificationStatus,
        rejectionReason: data.rejectionReason,
        lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        phoneNumber: data.phoneNumber,
        location: data.location,
        website: data.website,
        socialLinks: data.socialLinks
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const authService = new AuthService(); 