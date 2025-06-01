import type { Case as CaseType } from '../types/case';
import { db } from '../firebase-config';
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
  limit,
  startAfter,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
  increment
} from 'firebase/firestore';

export class Case {
  private readonly casesCollection = collection(db, 'cases');

  async create(caseData: Omit<CaseType, 'id'>): Promise<CaseType> {
    const docRef = await addDoc(this.casesCollection, {
      ...caseData,
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      saveCount: 0,
      likes: [],
      saves: []
    });

    return {
      id: docRef.id,
      ...caseData,
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      saveCount: 0,
      likes: [],
      saves: []
    };
  }

  async getById(id: string): Promise<CaseType | null> {
    const docRef = doc(this.casesCollection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
      publishedAt: data.publishedAt ? (data.publishedAt as Timestamp).toDate() : undefined
    } as CaseType;
  }

  async update(id: string, caseData: Partial<CaseType>): Promise<void> {
    const docRef = doc(this.casesCollection, id);
    await updateDoc(docRef, {
      ...caseData,
      updatedAt: new Date()
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.casesCollection, id);
    await deleteDoc(docRef);
  }

  async list(
    filters: {
      authorId?: string;
      status?: CaseType['status'];
      category?: string;
      difficulty?: CaseType['difficulty'];
    } = {},
    options: {
      limit?: number;
      startAfter?: QueryDocumentSnapshot<DocumentData>;
      orderBy?: keyof CaseType;
      orderDirection?: 'asc' | 'desc';
    } = {}
  ): Promise<CaseType[]> {
    let q = query(this.casesCollection);

    // Apply filters
    if (filters.authorId) {
      q = query(q, where('authorId', '==', filters.authorId));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.difficulty) {
      q = query(q, where('difficulty', '==', filters.difficulty));
    }

    // Apply ordering
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
    }

    // Apply pagination
    if (options.limit) {
      q = query(q, limit(options.limit));
    }
    if (options.startAfter) {
      q = query(q, startAfter(options.startAfter));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate(),
        publishedAt: data.publishedAt ? (data.publishedAt as Timestamp).toDate() : undefined
      } as CaseType;
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    const docRef = doc(this.casesCollection, id);
    await updateDoc(docRef, {
      viewCount: increment(1)
    });
  }

  async toggleLike(id: string, userId: string): Promise<void> {
    const docRef = doc(this.casesCollection, id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data() as CaseType;

    const likes = data.likes || [];
    const hasLiked = likes.includes(userId);

    await updateDoc(docRef, {
      likes: hasLiked ? likes.filter(id => id !== userId) : [...likes, userId],
      likeCount: increment(hasLiked ? -1 : 1)
    });
  }

  async toggleSave(id: string, userId: string): Promise<void> {
    const docRef = doc(this.casesCollection, id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data() as CaseType;

    const saves = data.saves || [];
    const hasSaved = saves.includes(userId);

    await updateDoc(docRef, {
      saves: hasSaved ? saves.filter(id => id !== userId) : [...saves, userId],
      saveCount: increment(hasSaved ? -1 : 1)
    });
  }
}

export interface CaseMetadata {
  id: string;
  title: string;
  description: string;
  authorId: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  saveCount: number;
  thumbnailUrl?: string;
  likedBy?: string[];
  savedBy?: string[];
}

export interface Case extends CaseMetadata {
  content: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  clinicalPresentation: string;
  imagingFindings: string;
  diagnosis: string;
  treatment: string;
  outcome: string;
  references: string[];
} 