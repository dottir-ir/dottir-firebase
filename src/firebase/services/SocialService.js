import { collection, doc, addDoc, deleteDoc, getDoc, getDocs, query, where, orderBy, } from 'firebase/firestore';
import { db, Comment, Like, Save } from '../config';
export class SocialService {
    static async addComment(caseId, userId, content) {
        const commentData = {
            caseId,
            authorId: userId,
            content,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const docRef = await addDoc(collection(db, 'comments'), commentData);
        return docRef.id;
    }
    static async deleteComment(commentId, userId) {
        const commentDoc = await getDoc(doc(db, 'comments', commentId));
        if (!commentDoc.exists()) {
            throw new Error('Comment not found');
        }
        const commentData = commentDoc.data();
        if (commentData.authorId !== userId) {
            throw new Error('Only the author can delete comments');
        }
        await deleteDoc(doc(db, 'comments', commentId));
    }
    static async getCaseComments(caseId) {
        const q = query(collection(db, 'comments'), where('caseId', '==', caseId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    static async toggleLike(caseId, userId) {
        const likeQuery = query(collection(db, 'likes'), where('caseId', '==', caseId), where('userId', '==', userId));
        const likeSnapshot = await getDocs(likeQuery);
        if (likeSnapshot.empty) {
            // Add like
            const likeData = {
                caseId,
                userId,
                createdAt: new Date(),
            };
            await addDoc(collection(db, 'likes'), likeData);
            return true;
        }
        else {
            // Remove like
            await deleteDoc(doc(db, 'likes', likeSnapshot.docs[0].id));
            return false;
        }
    }
    static async toggleSave(caseId, userId) {
        const saveQuery = query(collection(db, 'saves'), where('caseId', '==', caseId), where('userId', '==', userId));
        const saveSnapshot = await getDocs(saveQuery);
        if (saveSnapshot.empty) {
            // Add save
            const saveData = {
                caseId,
                userId,
                createdAt: new Date(),
            };
            await addDoc(collection(db, 'saves'), saveData);
            return true;
        }
        else {
            // Remove save
            await deleteDoc(doc(db, 'saves', saveSnapshot.docs[0].id));
            return false;
        }
    }
    static async getCaseLikes(caseId) {
        const q = query(collection(db, 'likes'), where('caseId', '==', caseId));
        const snapshot = await getDocs(q);
        return snapshot.size;
    }
    static async getUserSavedCases(userId) {
        const q = query(collection(db, 'saves'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => doc.data().caseId);
    }
}
