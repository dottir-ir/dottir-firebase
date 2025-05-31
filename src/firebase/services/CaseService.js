import { collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where, orderBy, Timestamp, Query, CollectionReference, } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, Case } from '../config';
import { UserService } from './UserService';
export class CaseService {
    static async createCase(authorId, title, description, tags, images) {
        // Verify user is a doctor
        const userProfile = await UserService.getUserProfile(authorId);
        if (!userProfile?.isVerified || userProfile.role !== 'doctor') {
            throw new Error('Only verified doctors can create cases');
        }
        // Upload images
        const imageUrls = await Promise.all(images.map(async (image) => {
            const imageRef = ref(storage, `cases/${Date.now()}_${image.name}`);
            await uploadBytes(imageRef, image);
            return getDownloadURL(imageRef);
        }));
        // Create case document
        const caseData = {
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
    static async updateCase(caseId, userId, updates) {
        const caseDoc = await getDoc(doc(db, 'cases', caseId));
        if (!caseDoc.exists()) {
            throw new Error('Case not found');
        }
        const caseData = caseDoc.data();
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
    static async deleteCase(caseId, userId) {
        const caseDoc = await getDoc(doc(db, 'cases', caseId));
        if (!caseDoc.exists()) {
            throw new Error('Case not found');
        }
        const caseData = caseDoc.data();
        const userProfile = await UserService.getUserProfile(userId);
        // Check permissions
        if (caseData.authorId !== userId && userProfile?.role !== 'admin') {
            throw new Error('Only the author or admin can delete cases');
        }
        // Delete associated images
        await Promise.all(caseData.images.map(async (imageUrl) => {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
        }));
        await deleteDoc(doc(db, 'cases', caseId));
    }
    static async getCase(caseId) {
        const caseDoc = await getDoc(doc(db, 'cases', caseId));
        return caseDoc.exists() ? { id: caseDoc.id, ...caseDoc.data() } : null;
    }
    static async listCases(filters) {
        let q = collection(db, 'cases');
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
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
}
