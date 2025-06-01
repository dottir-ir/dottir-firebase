import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit as firestoreLimit, Timestamp, startAfter, onSnapshot, increment, arrayUnion, arrayRemove, writeBatch, Query, } from 'firebase/firestore';
import { db } from '../firebase/config';
import { BaseService } from './BaseService';
import { ServiceError } from '@/utils/errors';
export class CaseService extends BaseService {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "casesCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'cases')
        });
        Object.defineProperty(this, "commentsCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'comments')
        });
        Object.defineProperty(this, "likesCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'likes')
        });
        Object.defineProperty(this, "savesCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'saves')
        });
    }
    async getCaseById(caseId) {
        try {
            const caseDoc = await getDoc(doc(this.casesCollection, caseId));
            if (!caseDoc.exists()) {
                throw new ServiceError('Case not found', 'not-found');
            }
            return this.convertToCase(caseDoc.data());
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async createCase(caseData) {
        try {
            const docRef = await addDoc(this.casesCollection, {
                ...caseData,
                createdAt: new Date(),
                updatedAt: new Date(),
                viewCount: 0,
                likeCount: 0,
                commentCount: 0,
                saveCount: 0,
                likes: [],
                saves: [],
            });
            return docRef.id;
        }
        catch (error) {
            console.error('Error creating case:', error);
            throw error;
        }
    }
    async saveDraft(caseData) {
        try {
            const docRef = await addDoc(this.casesCollection, {
                ...caseData,
                status: 'draft',
                createdAt: new Date(),
                updatedAt: new Date(),
                viewCount: 0,
                likeCount: 0,
                commentCount: 0,
                saveCount: 0,
                likes: [],
                saves: [],
            });
            return docRef.id;
        }
        catch (error) {
            console.error('Error saving draft:', error);
            throw error;
        }
    }
    async updateDraft(caseId, caseData) {
        try {
            const caseRef = doc(this.casesCollection, caseId);
            await updateDoc(caseRef, {
                ...caseData,
                updatedAt: new Date(),
            });
        }
        catch (error) {
            console.error('Error updating draft:', error);
            throw error;
        }
    }
    async getCase(caseId) {
        try {
            const caseRef = doc(this.casesCollection, caseId);
            const caseDoc = await getDoc(caseRef);
            if (caseDoc.exists()) {
                const data = caseDoc.data();
                return {
                    title: data.title,
                    description: data.description,
                    content: data.content,
                    status: data.status,
                    category: data.category,
                    difficulty: data.difficulty,
                    patientAge: data.patientAge,
                    patientGender: data.patientGender,
                    clinicalPresentation: data.clinicalPresentation,
                    imagingFindings: data.imagingFindings,
                    images: data.images.map((img) => ({
                        id: img.id,
                        url: img.url,
                        fileName: img.fileName,
                        alt: img.alt
                    })),
                    authorId: data.authorId,
                    authorName: data.authorName,
                    authorImage: data.authorImage,
                    tags: data.tags || [],
                    teachingPoints: data.teachingPoints
                };
            }
            return null;
        }
        catch (error) {
            console.error('Error getting case:', error);
            throw error;
        }
    }
    async getDrafts(doctorId) {
        try {
            const q = query(this.casesCollection, where('authorId', '==', doctorId), where('status', '==', 'draft'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    title: data.title,
                    description: data.description,
                    content: data.content,
                    status: data.status,
                    category: data.category,
                    difficulty: data.difficulty,
                    patientAge: data.patientAge,
                    patientGender: data.patientGender,
                    clinicalPresentation: data.clinicalPresentation,
                    imagingFindings: data.imagingFindings,
                    images: data.images.map((img) => ({
                        id: img.id,
                        url: img.url,
                        fileName: img.fileName,
                        alt: img.alt
                    })),
                    authorId: data.authorId,
                    authorName: data.authorName,
                    authorImage: data.authorImage,
                    tags: data.tags || [],
                    teachingPoints: data.teachingPoints
                };
            });
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getRecentCases(limitCount = 10) {
        try {
            const q = query(this.casesCollection, where('status', '==', 'published'), orderBy('publishedAt', 'desc'), firestoreLimit(limitCount));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => this.convertToCaseMetadata(doc.data()));
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async searchCases(searchQuery) {
        try {
            const q = query(this.casesCollection, where('title', '>=', searchQuery), where('title', '<=', `${searchQuery}\uf8ff`), where('status', '==', 'published'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => this.convertToCaseMetadata(doc.data()));
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getCasesForNewsfeed(options) {
        try {
            const { pageSize = 10, lastDoc, filters } = options;
            let q = query(this.casesCollection, where('status', '==', 'published'));
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
            }
            else if (filters?.sortBy === 'trending') {
                q = query(q, orderBy('likeCount', 'desc'));
            }
            else {
                q = query(q, orderBy('publishedAt', 'desc'));
            }
            // Apply pagination
            if (lastDoc) {
                q = query(q, startAfter(lastDoc));
            }
            q = query(q, firestoreLimit(pageSize));
            const snapshot = await getDocs(q);
            const cases = snapshot.docs.map((doc) => this.convertToCaseMetadata(doc.data()));
            const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
            return {
                cases,
                lastDoc: lastVisible,
            };
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    subscribeToNewsfeed(callback, options = {}) {
        const { filters } = options;
        let q = query(this.casesCollection, where('status', '==', 'published'));
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
        }
        else if (filters?.sortBy === 'trending') {
            q = query(q, orderBy('likeCount', 'desc'));
        }
        else {
            q = query(q, orderBy('publishedAt', 'desc'));
        }
        return onSnapshot(q, (snapshot) => {
            const cases = snapshot.docs.map((doc) => this.convertToCaseMetadata(doc.data()));
            callback(cases);
        });
    }
    async getCategories() {
        try {
            const q = query(this.casesCollection, where('status', '==', 'published'));
            const snapshot = await getDocs(q);
            const categories = new Set();
            snapshot.docs.forEach((doc) => {
                const category = doc.data().category;
                if (category) {
                    categories.add(category);
                }
            });
            return Array.from(categories);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getPopularTags(limit = 10) {
        try {
            const q = query(this.casesCollection, where('status', '==', 'published'));
            const snapshot = await getDocs(q);
            const tagCounts = new Map();
            snapshot.docs.forEach((doc) => {
                const tags = doc.data().tags || [];
                tags.forEach((tag) => {
                    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
                });
            });
            return Array.from(tagCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, limit)
                .map(([tag]) => tag);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async likeCase(caseId, userId) {
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
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async unlikeCase(caseId, userId) {
        try {
            const batch = writeBatch(db);
            // Remove like document
            const q = query(this.likesCollection, where('userId', '==', userId), where('caseId', '==', caseId));
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
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async saveCase(caseId, userId) {
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
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async unsaveCase(caseId, userId) {
        try {
            const batch = writeBatch(db);
            // Remove save document
            const q = query(this.savesCollection, where('userId', '==', userId), where('caseId', '==', caseId));
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
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async addComment(caseId, userId, text) {
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
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getComments(caseId) {
        try {
            const q = query(this.commentsCollection, where('caseId', '==', caseId), where('isDeleted', '==', false), orderBy('createdAt', 'asc'));
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
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async deleteComment(commentId, caseId) {
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
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async isLiked(caseId, userId) {
        try {
            const q = query(this.likesCollection, where('userId', '==', userId), where('caseId', '==', caseId));
            const snapshot = await getDocs(q);
            return !snapshot.empty;
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async isSaved(caseId, userId) {
        try {
            const q = query(this.savesCollection, where('userId', '==', userId), where('caseId', '==', caseId));
            const snapshot = await getDocs(q);
            return !snapshot.empty;
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getDoctorCases(doctorId) {
        try {
            const q = query(this.casesCollection, where('authorId', '==', doctorId), where('status', '==', 'published'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => this.convertToCaseMetadata(doc.data()));
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getCasesByAuthor(authorId) {
        try {
            const q = query(this.casesCollection, where('authorId', '==', authorId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => this.convertToCaseMetadata(doc.data()));
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async updateCase(caseId, caseData) {
        try {
            const caseRef = doc(this.casesCollection, caseId);
            await updateDoc(caseRef, {
                ...caseData,
                updatedAt: new Date(),
            });
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async deleteCase(caseId) {
        try {
            await deleteDoc(doc(this.casesCollection, caseId));
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async toggleCaseVisibility(caseId, isPublished) {
        try {
            const caseRef = doc(this.casesCollection, caseId);
            await updateDoc(caseRef, {
                status: isPublished ? 'published' : 'draft',
                publishedAt: isPublished ? new Date() : null,
                updatedAt: new Date(),
            });
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    convertToCase(data) {
        return {
            id: data.id,
            title: data.title,
            description: data.description,
            content: data.content,
            status: data.status,
            category: data.category,
            difficulty: data.difficulty,
            patientAge: data.patientAge,
            patientGender: data.patientGender,
            clinicalPresentation: data.clinicalPresentation,
            imagingFindings: data.imagingFindings,
            images: data.images.map((img) => ({
                id: img.id,
                url: img.url,
                fileName: img.fileName,
                alt: img.alt
            })),
            authorId: data.authorId,
            authorName: data.authorName,
            authorImage: data.authorImage,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            publishedAt: data.publishedAt?.toDate(),
            viewCount: data.viewCount,
            likeCount: data.likeCount,
            commentCount: data.commentCount,
            saveCount: data.saveCount,
            likes: data.likes || [],
            saves: data.saves || [],
            tags: data.tags || [],
            teachingPoints: data.teachingPoints,
        };
    }
    convertToCaseMetadata(data) {
        return {
            id: data.id,
            title: data.title,
            description: data.description,
            authorId: data.authorId,
            status: data.status,
            tags: data.tags || [],
            category: data.category,
            difficulty: data.difficulty,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            publishedAt: data.publishedAt?.toDate(),
            viewCount: data.viewCount,
            likeCount: data.likeCount,
            commentCount: data.commentCount,
            saveCount: data.saveCount,
        };
    }
}
export const caseService = new CaseService();
