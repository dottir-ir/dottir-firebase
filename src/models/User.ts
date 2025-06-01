import type { User as UserType, UserRole } from '../types/user';
import { db } from '../firebase-config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  type DocumentData,
  type Timestamp
} from 'firebase/firestore';

export class User {
  private readonly usersCollection = collection(db, 'users');

  async create(userData: Omit<UserType, 'uid'>): Promise<UserType> {
    const docRef = doc(this.usersCollection);
    const user: UserType = {
      uid: docRef.id,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date()
    };

    await setDoc(docRef, user);
    return user;
  }

  async getById(uid: string): Promise<UserType | null> {
    const docRef = doc(this.usersCollection, uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      uid: docSnap.id,
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
      lastLoginAt: (data.lastLoginAt as Timestamp).toDate()
    } as UserType;
  }

  async update(uid: string, userData: Partial<UserType>): Promise<void> {
    const docRef = doc(this.usersCollection, uid);
    await updateDoc(docRef, {
      ...userData,
      updatedAt: new Date()
    });
  }

  async delete(uid: string): Promise<void> {
    const docRef = doc(this.usersCollection, uid);
    await deleteDoc(docRef);
  }

  async list(filters: {
    role?: UserRole;
    isVerified?: boolean;
  } = {}): Promise<UserType[]> {
    let q = query(this.usersCollection);

    if (filters.role) {
      q = query(q, where('role', '==', filters.role));
    }
    if (filters.isVerified !== undefined) {
      q = query(q, where('isVerified', '==', filters.isVerified));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate(),
        lastLoginAt: (data.lastLoginAt as Timestamp).toDate()
      } as UserType;
    });
  }

  async updateLastLogin(uid: string): Promise<void> {
    const docRef = doc(this.usersCollection, uid);
    await updateDoc(docRef, {
      lastLoginAt: new Date()
    });
  }

  async verifyDoctor(uid: string): Promise<void> {
    const docRef = doc(this.usersCollection, uid);
    await updateDoc(docRef, {
      doctorVerificationStatus: 'verified',
      role: 'doctor',
      updatedAt: new Date()
    });
  }

  async rejectDoctor(uid: string, reason: string): Promise<void> {
    const docRef = doc(this.usersCollection, uid);
    await updateDoc(docRef, {
      doctorVerificationStatus: 'rejected',
      rejectionReason: reason,
      updatedAt: new Date()
    });
  }
} 