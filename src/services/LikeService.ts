import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  DocumentData,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { BaseService } from './BaseService';

interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'case' | 'comment';
  createdAt: Date;
}

export class LikeService extends BaseService {
  private readonly likesCollection = collection(db, 'likes');
  private readonly casesCollection = collection(db, 'cases');
  private readonly commentsCollection = collection(db, 'comments');

  async toggleLike(userId: string, targetId: string, targetType: 'case' | 'comment'): Promise<boolean> {
    try {
      const existingLike = await this.getLike(userId, targetId, targetType);
      if (existingLike) {
        await this.unlike(userId, targetId, targetType);
        return false;
      } else {
        await this.like(userId, targetId, targetType);
        return true;
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getLike(userId: string, targetId: string, targetType: 'case' | 'comment'): Promise<Like | null> {
    try {
      const q = query(
        this.likesCollection,
        where('userId', '==', userId),
        where('targetId', '==', targetId),
        where('targetType', '==', targetType)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return null;
      }
      const doc = snapshot.docs[0];
      return this.convertToLike(doc.data() as DocumentData);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getLikesByUser(userId: string): Promise<Like[]> {
    try {
      const q = query(
        this.likesCollection,
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => this.convertToLike(doc.data() as DocumentData));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getLikesByTarget(targetId: string, targetType: 'case' | 'comment'): Promise<Like[]> {
    try {
      const q = query(
        this.likesCollection,
        where('targetId', '==', targetId),
        where('targetType', '==', targetType)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => this.convertToLike(doc.data() as DocumentData));
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async like(userId: string, targetId: string, targetType: 'case' | 'comment'): Promise<void> {
    try {
      const newLike = {
        userId,
        targetId,
        targetType,
        createdAt: new Date(),
      };
      await addDoc(this.likesCollection, newLike);

      // Update like count on target
      const targetCollection = targetType === 'case' ? this.casesCollection : this.commentsCollection;
      const targetRef = doc(targetCollection, targetId);
      await updateDoc(targetRef, {
        likeCount: increment(1),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async unlike(userId: string, targetId: string, targetType: 'case' | 'comment'): Promise<void> {
    try {
      const q = query(
        this.likesCollection,
        where('userId', '==', userId),
        where('targetId', '==', targetId),
        where('targetType', '==', targetType)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const likeDoc = snapshot.docs[0];
        await deleteDoc(doc(this.likesCollection, likeDoc.id));

        // Update like count on target
        const targetCollection = targetType === 'case' ? this.casesCollection : this.commentsCollection;
        const targetRef = doc(targetCollection, targetId);
        await updateDoc(targetRef, {
          likeCount: increment(-1),
        });
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  private convertToLike(data: DocumentData): Like {
    return {
      id: data.id,
      userId: data.userId,
      targetId: data.targetId,
      targetType: data.targetType,
      createdAt: data.createdAt?.toDate(),
    };
  }
} 