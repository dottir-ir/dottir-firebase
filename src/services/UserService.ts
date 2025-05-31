import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import type { User, UserProfile } from '../types/user';
import { BaseService } from './BaseService';
import { ServiceError } from '@/utils/errors';

export class UserService extends BaseService {
  private readonly usersCollection = collection(db, 'users');

  async getUserById(userId: string): Promise<User> {
    try {
      const userDoc = await getDoc(doc(this.usersCollection, userId));
      if (!userDoc.exists()) {
        throw new ServiceError('User not found', 'not-found');
      }
      return { id: userDoc.id, ...userDoc.data() } as User;
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

  async createUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      await setDoc(doc(this.usersCollection, userId), userData);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(this.usersCollection, where('email', '==', email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return null;
      }
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    } catch (error) {
      return this.handleError(error);
    }
  }
} 