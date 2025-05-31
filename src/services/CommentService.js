import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, DocumentData, increment, } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BaseService, ServiceError } from './BaseService';
import { Comment } from '../types/comment';
import { userService } from './UserService';
export class CommentService extends BaseService {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "commentsCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'comments')
        });
    }
    async getCommentById(commentId) {
        try {
            const commentDoc = await getDoc(doc(this.commentsCollection, commentId));
            if (!commentDoc.exists()) {
                throw new ServiceError('Comment not found', 'not-found');
            }
            const comment = this.convertToComment(commentDoc.data());
            const author = await userService.getUserById(comment.userId);
            return {
                ...comment,
                author: {
                    id: author.id,
                    displayName: author.displayName,
                    photoURL: author.photoURL,
                },
            };
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async createComment(commentData) {
        try {
            const now = new Date();
            const newComment = {
                ...commentData,
                createdAt: now,
                updatedAt: now,
                likeCount: 0,
                isEdited: false,
                isDeleted: false,
            };
            const docRef = await addDoc(this.commentsCollection, newComment);
            return this.getCommentById(docRef.id);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async updateComment(commentId, text) {
        try {
            const commentRef = doc(this.commentsCollection, commentId);
            await updateDoc(commentRef, {
                text,
                updatedAt: new Date(),
                isEdited: true,
            });
            return this.getCommentById(commentId);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async deleteComment(commentId) {
        try {
            const commentRef = doc(this.commentsCollection, commentId);
            await updateDoc(commentRef, {
                isDeleted: true,
                updatedAt: new Date(),
            });
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getCommentsByCase(caseId) {
        try {
            const q = query(this.commentsCollection, where('caseId', '==', caseId), where('isDeleted', '==', false), orderBy('createdAt', 'asc'));
            const snapshot = await getDocs(q);
            const comments = await Promise.all(snapshot.docs.map(async (doc) => {
                const comment = this.convertToComment(doc.data());
                const author = await userService.getUserById(comment.userId);
                return {
                    ...comment,
                    author: {
                        id: author.id,
                        displayName: author.displayName,
                        photoURL: author.photoURL,
                    },
                };
            }));
            return comments;
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getReplies(commentId) {
        try {
            const q = query(this.commentsCollection, where('parentId', '==', commentId), where('isDeleted', '==', false), orderBy('createdAt', 'asc'));
            const snapshot = await getDocs(q);
            const replies = await Promise.all(snapshot.docs.map(async (doc) => {
                const comment = this.convertToComment(doc.data());
                const author = await userService.getUserById(comment.userId);
                return {
                    ...comment,
                    author: {
                        id: author.id,
                        displayName: author.displayName,
                        photoURL: author.photoURL,
                    },
                };
            }));
            return replies;
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    convertToComment(data) {
        return {
            id: data.id,
            caseId: data.caseId,
            userId: data.userId,
            text: data.text,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            likeCount: data.likeCount,
            isEdited: data.isEdited,
            isDeleted: data.isDeleted,
        };
    }
}
