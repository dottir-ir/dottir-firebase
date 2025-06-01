import { db } from '@/firebase/config';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import type { Comment, CommentWithUser } from '../types/comment';
import type { User } from '../types/user';
import { BaseService } from './BaseService';
import { ServiceError } from '@/utils/errors';
import { UserService } from './UserService';

const userService = new UserService();

export class CommentService extends BaseService {
  private readonly commentsCollection = collection(db, 'comments');

  async getCommentById(commentId: string): Promise<CommentWithUser> {
    try {
      const commentDoc = await getDoc(doc(this.commentsCollection, commentId));
      if (!commentDoc.exists()) {
        throw new ServiceError('Comment not found', 'not-found');
      }
      const comment = commentDoc.data() as Comment;
      const author = await userService.getUserById(comment.authorId);
      return {
        ...comment,
        author
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCommentsByCaseId(caseId: string): Promise<CommentWithUser[]> {
    try {
      const q = query(
        this.commentsCollection,
        where('caseId', '==', caseId),
        where('parentId', '==', null),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const comments = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const comment = doc.data() as Comment;
          const author = await userService.getUserById(comment.authorId);
          return {
            ...comment,
            author
          };
        })
      );
      return comments;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getReplies(commentId: string): Promise<CommentWithUser[]> {
    try {
      const q = query(
        this.commentsCollection,
        where('parentId', '==', commentId),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const comments = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const comment = doc.data() as Comment;
          const author = await userService.getUserById(comment.authorId);
          return {
            ...comment,
            author
          };
        })
      );
      return comments;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createComment(comment: Omit<Comment, 'id'>): Promise<string> {
    try {
      const commentRef = doc(this.commentsCollection);
      const now = new Date();
      await setDoc(commentRef, {
        ...comment,
        createdAt: now,
        updatedAt: now,
        likeCount: 0,
        replyCount: 0
      });
      return commentRef.id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateComment(commentId: string, content: string): Promise<void> {
    try {
      await updateDoc(doc(this.commentsCollection, commentId), {
        content,
        updatedAt: new Date()
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.commentsCollection, commentId));
    } catch (error) {
      return this.handleError(error);
    }
  }
} 