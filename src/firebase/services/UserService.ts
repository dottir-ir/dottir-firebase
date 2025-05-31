import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import type { UserProfile, UserRole } from '../config';
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
  DocumentData,
} from 'firebase/firestore';
import { User } from '../../types/user';

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
      role: 'user',
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
  }

  static async updateUserRole(uid: string, role: UserRole): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      role,
      updatedAt: new Date(),
    });
  }

  static async verifyDoctor(uid: string): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      isVerified: true,
      role: 'doctor',
      updatedAt: new Date(),
    });
  }

  async createUser(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date()
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }

    const data = userSnap.data() as DocumentData;
    return {
      ...data,
      id: userSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastLoginAt: data.lastLoginAt?.toDate() || new Date()
    } as User;
  }

  async updateUserProfile(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
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
      id: doc.id,
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
        id: doc.id,
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

  async deleteUser(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
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
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date()
      } as User;
    });
  }
} 