import { collection, doc, getDoc, getDocs, addDoc, deleteDoc, query, where, DocumentData, increment, updateDoc, } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BaseService, ServiceError } from './BaseService';
export class LikeService extends BaseService {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "likesCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'likes')
        });
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
    }
    async toggleLike(userId, targetId, targetType) {
        try {
            const existingLike = await this.getLike(userId, targetId, targetType);
            if (existingLike) {
                await this.unlike(userId, targetId, targetType);
                return false;
            }
            else {
                await this.like(userId, targetId, targetType);
                return true;
            }
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getLike(userId, targetId, targetType) {
        try {
            const q = query(this.likesCollection, where('userId', '==', userId), where('targetId', '==', targetId), where('targetType', '==', targetType));
            const snapshot = await getDocs(q);
            if (snapshot.empty) {
                return null;
            }
            const doc = snapshot.docs[0];
            return this.convertToLike(doc.data());
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getLikesByUser(userId) {
        try {
            const q = query(this.likesCollection, where('userId', '==', userId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => this.convertToLike(doc.data()));
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getLikesByTarget(targetId, targetType) {
        try {
            const q = query(this.likesCollection, where('targetId', '==', targetId), where('targetType', '==', targetType));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => this.convertToLike(doc.data()));
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async like(userId, targetId, targetType) {
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
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async unlike(userId, targetId, targetType) {
        try {
            const q = query(this.likesCollection, where('userId', '==', userId), where('targetId', '==', targetId), where('targetType', '==', targetType));
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
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    convertToLike(data) {
        return {
            id: data.id,
            userId: data.userId,
            targetId: data.targetId,
            targetType: data.targetType,
            createdAt: data.createdAt?.toDate(),
        };
    }
}
