import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';
import type { User, UserProfile } from '../types/user';
import type { CaseMetadata } from '../types/case';
import { BaseService } from './BaseService';
import { ServiceError } from '@/utils/errors';

export class UserService extends BaseService {
  private readonly usersCollection = collection(db, 'users');
  private readonly casesCollection = collection(db, 'cases');
  private readonly savedCasesCollection = collection(db, 'savedCases');

  async getUserById(userId: string): Promise<User> {
    try {
      const userDoc = await getDoc(doc(this.usersCollection, userId));
      if (!userDoc.exists()) {
        throw new ServiceError('User not found', 'not-found');
      }
      return { uid: userDoc.id, ...userDoc.data() } as User;
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
      return { uid: doc.id, ...doc.data() } as User;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserPublishedCases(userId: string): Promise<CaseMetadata[]> {
    try {
      const q = query(this.casesCollection, where('authorId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CaseMetadata));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserSavedCases(userId: string): Promise<Array<{ caseId: string; id: string; savedAt: Date; progress: number }>> {
    try {
      const q = query(this.savedCasesCollection, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as { caseId: string; id: string; savedAt: Date; progress: number }));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserLearningMetrics(userId: string): Promise<{ casesCompleted: number; averageScore: number; timeSpent: number; lastActive: Date }> {
    try {
      const userDoc = await getDoc(doc(this.usersCollection, userId));
      if (!userDoc.exists()) {
        throw new ServiceError('User not found', 'not-found');
      }
      const data = userDoc.data();
      return {
        casesCompleted: data.casesCompleted || 0,
        averageScore: data.averageScore || 0,
        timeSpent: data.timeSpent || 0,
        lastActive: data.lastActive?.toDate() || new Date(),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteCase(caseId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.casesCollection, caseId));
    } catch (error) {
      return this.handleError(error);
    }
  }
} 