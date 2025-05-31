import { db, auth, storage } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  startAfter,
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  Query,
  setDoc,
  DocumentData
} from 'firebase/firestore';
import type { Case, CaseMetadata, CaseUpload } from '../types/case';
import {
  ref, uploadBytes, getDownloadURL, deleteObject
} from 'firebase/storage';
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, sendPasswordResetEmail
} from 'firebase/auth';
import type { Comment } from '../types/comment';
import { BaseService } from './BaseService';
import { ServiceError } from '@/utils/errors';

export class CaseService extends BaseService {
  private readonly casesCollection = collection(db, 'cases');
  private readonly commentsCollection = collection(db, 'comments');
  private readonly likesCollection = collection(db, 'likes');
  private readonly savesCollection = collection(db, 'saves');

  async getCaseById(caseId: string): Promise<Case> {
    try {
      const caseDoc = await getDoc(doc(this.casesCollection, caseId));
      if (!caseDoc.exists()) {
        throw new ServiceError('Case not found', 'not-found');
      }
      return this.convertToCase(caseDoc.data());
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createCase(caseData: CaseUpload): Promise<string> {
    try {
      const caseRef = doc(this.casesCollection);
      const now = new Date();
      await setDoc(caseRef, {
        ...caseData,
        createdAt: now,
        updatedAt: now,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        saveCount: 0
      });
      return caseRef.id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async saveDraft(caseData: CaseUpload): Promise<string> {
    try {
      const caseRef = doc(this.casesCollection);
      const now = new Date();
      await setDoc(caseRef, {
        ...caseData,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        saveCount: 0
      });
      return caseRef.id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateDraft(caseId: string, caseData: Partial<CaseUpload>): Promise<void> {
    try {
      const caseRef = doc(this.casesCollection, caseId);
      await updateDoc(caseRef, {
        ...caseData,
        updatedAt: new Date()
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCase(caseId: string): Promise<CaseUpload | null> {
    try {
      const caseDoc = await getDoc(doc(this.casesCollection, caseId));
      if (!caseDoc.exists()) {
        return null;
      }
      const data = caseDoc.data();
      return {
        title: data.title,
        description: data.description,
        authorId: data.authorId,
        status: data.status,
        tags: data.tags,
        category: data.category,
        difficulty: data.difficulty,
        clinicalHistory: data.clinicalHistory,
        patientDemographics: data.patientDemographics,
        images: data.images,
        teachingPoints: data.teachingPoints
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getDrafts(doctorId: string): Promise<CaseUpload[]> {
    try {
      const q = query(
        this.casesCollection,
        where('authorId', '==', doctorId),
        where('status', '==', 'draft')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        title: doc.data().title,
        description: doc.data().description,
        authorId: doc.data().authorId,
        status: doc.data().status,
        tags: doc.data().tags,
        category: doc.data().category,
        difficulty: doc.data().difficulty,
        clinicalHistory: doc.data().clinicalHistory,
        patientDemographics: doc.data().patientDemographics,
        images: doc.data().images,
        teachingPoints: doc.data().teachingPoints
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getRecentCases(limitCount: number = 10): Promise<CaseMetadata[]> {
    try {
      const q = query(
        this.casesCollection,
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        firestoreLimit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.convertToCaseMetadata(doc.data()));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async searchCases(searchQuery: string): Promise<CaseMetadata[]> {
    try {
      const q = query(
        this.casesCollection,
        where('status', '==', 'published'),
        where('title', '>=', searchQuery),
        where('title', '<=', searchQuery + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.convertToCaseMetadata(doc.data()));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCasesForNewsfeed(options: {
    pageSize?: number;
    lastDoc?: DocumentData;
    filters?: {
      tags?: string[];
      category?: string;
      sortBy?: 'recent' | 'popular' | 'trending';
    };
  }): Promise<{ cases: CaseMetadata[]; lastDoc: DocumentData | null }> {
    try {
      const { pageSize = 10, lastDoc, filters } = options;
      
      let q: Query = query(
        this.casesCollection,
        where('status', '==', 'published')
      );

      // Apply filters
      if (filters?.tags?.length) {
        q = query(q, where('tags', 'array-contains-any', filters.tags));
      }
      if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
      }

      // Apply sorting
      if (filters?.sortBy === 'popular') {
        q = query(q, orderBy('viewCount', 'desc'));
      } else if (filters?.sortBy === 'trending') {
        q = query(q, orderBy('likeCount', 'desc'));
      } else {
        q = query(q, orderBy('publishedAt', 'desc'));
      }

      // Apply pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      q = query(q, firestoreLimit(pageSize));

      const querySnapshot = await getDocs(q);
      const cases = querySnapshot.docs.map(doc => this.convertToCaseMetadata(doc.data()));
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return {
        cases,
        lastDoc: lastVisible,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  subscribeToNewsfeed(
    callback: (cases: CaseMetadata[]) => void,
    options: {
      filters?: {
        tags?: string[];
        category?: string;
        sortBy?: 'recent' | 'popular' | 'trending';
      };
    } = {}
  ): () => void {
    const { filters } = options;
    
    let q: Query = query(
      this.casesCollection,
      where('status', '==', 'published')
    );

    // Apply filters
    if (filters?.tags?.length) {
      q = query(q, where('tags', 'array-contains-any', filters.tags));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }

    // Apply sorting
    if (filters?.sortBy === 'popular') {
      q = query(q, orderBy('viewCount', 'desc'));
    } else if (filters?.sortBy === 'trending') {
      q = query(q, orderBy('likeCount', 'desc'));
    } else {
      q = query(q, orderBy('publishedAt', 'desc'));
    }

    return onSnapshot(q, (snapshot) => {
      const cases = snapshot.docs.map((doc) => this.convertToCaseMetadata(doc.data()));
      callback(cases);
    });
  }

  async getCategories(): Promise<string[]> {
    try {
      const q = query(
        this.casesCollection,
        where('status', '==', 'published')
      );
      const snapshot = await getDocs(q);
      const categories = new Set<string>();
      snapshot.docs.forEach((doc) => {
        const category = doc.data().category;
        if (category) {
          categories.add(category);
        }
      });
      return Array.from(categories);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getPopularTags(limit: number = 10): Promise<string[]> {
    try {
      const q = query(
        this.casesCollection,
        where('status', '==', 'published')
      );
      const snapshot = await getDocs(q);
      const tagCounts = new Map<string, number>();
      
      snapshot.docs.forEach((doc) => {
        const tags = doc.data().tags || [];
        tags.forEach((tag: string) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });

      return Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([tag]) => tag);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async likeCase(caseId: string, userId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Add like document
      const likeRef = doc(this.likesCollection);
      batch.set(likeRef, {
        userId,
        caseId,
        createdAt: new Date(),
      });

      // Update case document
      const caseRef = doc(this.casesCollection, caseId);
      batch.update(caseRef, {
        likeCount: increment(1),
        likes: arrayUnion(userId),
      });

      await batch.commit();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async unlikeCase(caseId: string, userId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Remove like document
      const q = query(
        this.likesCollection,
        where('userId', '==', userId),
        where('caseId', '==', caseId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const likeDoc = snapshot.docs[0];
        batch.delete(doc(this.likesCollection, likeDoc.id));
      }

      // Update case document
      const caseRef = doc(this.casesCollection, caseId);
      batch.update(caseRef, {
        likeCount: increment(-1),
        likes: arrayRemove(userId),
      });

      await batch.commit();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async saveCase(caseId: string, userId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Add save document
      const saveRef = doc(this.savesCollection);
      batch.set(saveRef, {
        userId,
        caseId,
        createdAt: new Date(),
      });

      // Update case document
      const caseRef = doc(this.casesCollection, caseId);
      batch.update(caseRef, {
        saveCount: increment(1),
        saves: arrayUnion(userId),
      });

      await batch.commit();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async unsaveCase(caseId: string, userId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Remove save document
      const q = query(
        this.savesCollection,
        where('userId', '==', userId),
        where('caseId', '==', caseId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const saveDoc = snapshot.docs[0];
        batch.delete(doc(this.savesCollection, saveDoc.id));
      }

      // Update case document
      const caseRef = doc(this.casesCollection, caseId);
      batch.update(caseRef, {
        saveCount: increment(-1),
        saves: arrayRemove(userId),
      });

      await batch.commit();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addComment(caseId: string, userId: string, text: string): Promise<string> {
    try {
      const batch = writeBatch(db);
      
      // Add comment document
      const commentRef = doc(this.commentsCollection);
      batch.set(commentRef, {
        caseId,
        userId,
        text,
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 0,
        isEdited: false,
        isDeleted: false,
      });

      // Update case document
      const caseRef = doc(this.casesCollection, caseId);
      batch.update(caseRef, {
        commentCount: increment(1),
      });

      await batch.commit();
      return commentRef.id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getComments(caseId: string): Promise<Comment[]> {
    try {
      const q = query(
        this.commentsCollection,
        where('caseId', '==', caseId),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        caseId: doc.data().caseId,
        userId: doc.data().userId,
        text: doc.data().text,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        likeCount: doc.data().likeCount,
        isEdited: doc.data().isEdited,
        isDeleted: doc.data().isDeleted,
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteComment(commentId: string, caseId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Update comment document
      const commentRef = doc(this.commentsCollection, commentId);
      batch.update(commentRef, {
        isDeleted: true,
        updatedAt: new Date(),
      });

      // Update case document
      const caseRef = doc(this.casesCollection, caseId);
      batch.update(caseRef, {
        commentCount: increment(-1),
      });

      await batch.commit();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async isLiked(caseId: string, userId: string): Promise<boolean> {
    try {
      const q = query(
        this.likesCollection,
        where('userId', '==', userId),
        where('caseId', '==', caseId)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async isSaved(caseId: string, userId: string): Promise<boolean> {
    try {
      const q = query(
        this.savesCollection,
        where('userId', '==', userId),
        where('caseId', '==', caseId)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getDoctorCases(doctorId: string): Promise<CaseMetadata[]> {
    try {
      const q = query(
        this.casesCollection,
        where('authorId', '==', doctorId),
        where('status', '==', 'published')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => this.convertToCaseMetadata(doc.data()));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCasesByAuthor(authorId: string): Promise<CaseMetadata[]> {
    try {
      const q = query(
        this.casesCollection,
        where('authorId', '==', authorId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => this.convertToCaseMetadata(doc.data()));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateCase(caseId: string, caseData: Partial<Case>): Promise<void> {
    try {
      const caseRef = doc(this.casesCollection, caseId);
      await updateDoc(caseRef, {
        ...caseData,
        updatedAt: new Date()
      });
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

  async toggleCaseVisibility(caseId: string, isPublished: boolean): Promise<void> {
    try {
      const caseRef = doc(this.casesCollection, caseId);
      await updateDoc(caseRef, {
        status: isPublished ? 'published' : 'draft',
        publishedAt: isPublished ? new Date() : null,
        updatedAt: new Date(),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  private convertToCase(data: DocumentData): Case {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      authorId: data.authorId,
      status: data.status,
      tags: data.tags,
      category: data.category,
      difficulty: data.difficulty,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      publishedAt: data.publishedAt?.toDate(),
      viewCount: data.viewCount,
      likeCount: data.likeCount,
      commentCount: data.commentCount,
      saveCount: data.saveCount,
      clinicalHistory: data.clinicalHistory,
      patientDemographics: data.patientDemographics,
      images: data.images,
      teachingPoints: data.teachingPoints
    };
  }

  private convertToCaseMetadata(data: DocumentData): CaseMetadata {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      authorId: data.authorId,
      status: data.status,
      tags: data.tags,
      category: data.category,
      difficulty: data.difficulty,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      publishedAt: data.publishedAt?.toDate(),
      viewCount: data.viewCount,
      likeCount: data.likeCount,
      commentCount: data.commentCount,
      saveCount: data.saveCount
    };
  }
}

export const caseService = new CaseService(); 