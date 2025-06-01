import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import type { UserProfile, UserRole, User } from '../../types/user';
import { auth, db } from '../config';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  deleteDoc,
  type DocumentData,
} from 'firebase/firestore';

export class UserService {
  static async register(email: string, password: string, displayName: string): Promise<FirebaseUser> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role: 'patient',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      doctorVerificationStatus: 'pending'
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return user;
  }

  static async login(email: string, password: string): Promise<FirebaseUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  static async logout(): Promise<void> {
    await signOut(auth);
  }

  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return null;
    
    const data = userDoc.data();
    return {
      uid: userDoc.id,
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
  }

  static async updateUserRole(uid: string, role: UserRole): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      role,
      updatedAt: new Date(),
    });
  }

  static async verifyDoctor(uid: string): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      doctorVerificationStatus: 'verified',
      role: 'doctor',
      updatedAt: new Date(),
    });
  }

  async createUser(uid: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userData,
      uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date()
    });
  }

  async getUserById(uid: string): Promise<User | null> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }

    const data = userSnap.data() as DocumentData;
    return {
      ...data,
      uid: userSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastLoginAt: data.lastLoginAt?.toDate() || new Date()
    } as User;
  }

  async updateUserProfile(uid: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date()
    });
  }

  async updateUserRole(uid: string, role: User['role']): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      role,
      updatedAt: new Date().toISOString(),
    });
  }

  async getAllUsers(): Promise<User[]> {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map((doc) => ({
      ...doc.data(),
      uid: doc.id,
    })) as User[];
  }

  async getUsersByRole(role: User['role']): Promise<User[]> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', role));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        ...data,
        uid: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date()
      } as User;
    });
  }

  async getDoctors(): Promise<User[]> {
    return this.getUsersByRole('doctor');
  }

  async getPatients(): Promise<User[]> {
    return this.getUsersByRole('patient');
  }

  async deleteUser(uid: string): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
  }

  async searchUsers(searchQuery: string): Promise<User[]> {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('displayName', '>=', searchQuery),
      where('displayName', '<=', searchQuery + '\uf8ff')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        ...data,
        uid: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date()
      } as User;
    });
  }
} 