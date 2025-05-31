import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  Query,
  CollectionReference,
} from 'firebase/firestore';
import { UserService } from './UserService';

export class CaseService {
  static async createCase(
    authorId: string,
    title: string,
    description: string,
    tags: string[],
    images: File[]
  ): Promise<string> {
    // Verify user is a doctor
    const userProfile = await UserService.getUserProfile(authorId);
    if (!userProfile?.isVerified || userProfile.role !== 'doctor') {
      throw new Error('Only verified doctors can create cases');
    }

    // Upload images
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const imageRef = ref(storage, `cases/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        return getDownloadURL(imageRef);
      })
    );

    // Create case document
    const caseData: Omit<Case, 'id'> = {
      authorId,
      title,
      description,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags,
      images: imageUrls,
    };

    const docRef = await addDoc(collection(db, 'cases'), caseData);
    return docRef.id;
  }

  static async updateCase(
    caseId: string,
    userId: string,
    updates: Partial<Omit<Case, 'id' | 'authorId' | 'createdAt'>>
  ): Promise<void> {
    const caseDoc = await getDoc(doc(db, 'cases', caseId));
    if (!caseDoc.exists()) {
      throw new Error('Case not found');
    }

    const caseData = caseDoc.data() as Case;
    const userProfile = await UserService.getUserProfile(userId);

    // Check permissions
    if (caseData.authorId !== userId && userProfile?.role !== 'admin') {
      throw new Error('Only the author or admin can edit cases');
    }

    await updateDoc(doc(db, 'cases', caseId), {
      ...updates,
      updatedAt: new Date(),
    });
  }

  static async deleteCase(caseId: string, userId: string): Promise<void> {
    const caseDoc = await getDoc(doc(db, 'cases', caseId));
    if (!caseDoc.exists()) {
      throw new Error('Case not found');
    }

    const caseData = caseDoc.data() as Case;
    const userProfile = await UserService.getUserProfile(userId);

    // Check permissions
    if (caseData.authorId !== userId && userProfile?.role !== 'admin') {
      throw new Error('Only the author or admin can delete cases');
    }

    // Delete associated images
    await Promise.all(
      caseData.images.map(async (imageUrl) => {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      })
    );

    await deleteDoc(doc(db, 'cases', caseId));
  }

  static async getCase(caseId: string): Promise<Case | null> {
    const caseDoc = await getDoc(doc(db, 'cases', caseId));
    return caseDoc.exists() ? { id: caseDoc.id, ...caseDoc.data() } as Case : null;
  }

  static async listCases(filters?: {
    authorId?: string;
    status?: Case['status'];
    tags?: string[];
  }): Promise<Case[]> {
    let q: Query = collection(db, 'cases');

    if (filters) {
      const constraints = [];
      if (filters.authorId) {
        constraints.push(where('authorId', '==', filters.authorId));
      }
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }
      if (filters.tags?.length) {
        constraints.push(where('tags', 'array-contains-any', filters.tags));
      }
      q = query(q, ...constraints, orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Case));
  }
} 