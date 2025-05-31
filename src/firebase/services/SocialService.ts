import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import type { Comment, Like, Save } from '../config';
import { db } from '../config';

export class SocialService {
  static async addComment(caseId: string, userId: string, content: string): Promise<string> {
    const commentData: Omit<Comment, 'id'> = {
      caseId,
      authorId: userId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'comments'), commentData);
    return docRef.id;
  }

  static async deleteComment(commentId: string, userId: string): Promise<void> {
    const commentDoc = await getDoc(doc(db, 'comments', commentId));
    if (!commentDoc.exists()) {
      throw new Error('Comment not found');
    }

    const commentData = commentDoc.data() as Comment;
    if (commentData.authorId !== userId) {
      throw new Error('Only the author can delete comments');
    }

    await deleteDoc(doc(db, 'comments', commentId));
  }

  static async getCaseComments(caseId: string): Promise<Comment[]> {
    const q = query(
      collection(db, 'comments'),
      where('caseId', '==', caseId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Comment));
  }

  static async toggleLike(caseId: string, userId: string): Promise<boolean> {
    const likeQuery = query(
      collection(db, 'likes'),
      where('caseId', '==', caseId),
      where('userId', '==', userId)
    );
    const likeSnapshot = await getDocs(likeQuery);

    if (likeSnapshot.empty) {
      // Add like
      const likeData: Omit<Like, 'id'> = {
        caseId,
        userId,
        createdAt: new Date(),
      };
      await addDoc(collection(db, 'likes'), likeData);
      return true;
    } else {
      // Remove like
      await deleteDoc(doc(db, 'likes', likeSnapshot.docs[0].id));
      return false;
    }
  }

  static async toggleSave(caseId: string, userId: string): Promise<boolean> {
    const saveQuery = query(
      collection(db, 'saves'),
      where('caseId', '==', caseId),
      where('userId', '==', userId)
    );
    const saveSnapshot = await getDocs(saveQuery);

    if (saveSnapshot.empty) {
      // Add save
      const saveData: Omit<Save, 'id'> = {
        caseId,
        userId,
        createdAt: new Date(),
      };
      await addDoc(collection(db, 'saves'), saveData);
      return true;
    } else {
      // Remove save
      await deleteDoc(doc(db, 'saves', saveSnapshot.docs[0].id));
      return false;
    }
  }

  static async getCaseLikes(caseId: string): Promise<number> {
    const q = query(collection(db, 'likes'), where('caseId', '==', caseId));
    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  static async getUserSavedCases(userId: string): Promise<string[]> {
    const q = query(
      collection(db, 'saves'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => (doc.data() as Save).caseId);
  }
} 