import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import type { Comment, CommentWithUser } from '../../types/comment';
import type { User } from '../../types/user';
import { CommentService } from '../CommentService';
import { UserService } from '../UserService';
import { db } from '../../config/firebase';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Firebase and UserService
vi.mock('firebase/firestore');
vi.mock('../../config/firebase');
vi.mock('../UserService');

describe('CommentService', () => {
  let commentService: CommentService;
  let mockUserService: UserService;

  const mockUser: User = {
    id: 'user1',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
    role: 'doctor',
    title: 'Dr.',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  };

  const mockComment: Comment = {
    id: 'comment1',
    content: 'Test comment',
    authorId: 'user1',
    caseId: 'case1',
    createdAt: new Date(),
    updatedAt: new Date(),
    likeCount: 0,
    replyCount: 0,
    parentId: undefined
  };

  const mockCommentWithUser: CommentWithUser = {
    ...mockComment,
    author: mockUser
  };

  beforeEach(() => {
    mockUserService = new UserService();
    vi.spyOn(mockUserService, 'getUserById').mockResolvedValue(mockUser);
    commentService = new CommentService();
    vi.clearAllMocks();
  });

  describe('getCommentById', () => {
    it('should return comment with author when found', async () => {
      (getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        exists: () => true,
        data: () => mockComment,
      });

      const result = await commentService.getCommentById('comment1');
      expect(result).toEqual(mockCommentWithUser);
      expect(getDoc).toHaveBeenCalledWith(doc(collection(db, 'comments'), 'comment1'));
    });

    it('should throw error when comment not found', async () => {
      (getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        exists: () => false,
      });

      await expect(commentService.getCommentById('comment1')).rejects.toThrow('Comment not found');
    });
  });

  describe('createComment', () => {
    it('should create comment successfully', async () => {
      const newComment: Omit<Comment, 'id'> = {
        content: 'New comment',
        authorId: 'user1',
        caseId: 'case1',
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 0,
        replyCount: 0,
        parentId: undefined
      };

      (addDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'newComment1' });
      (getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        exists: () => true,
        data: () => ({ ...newComment, id: 'newComment1' }),
      });

      const result = await commentService.createComment(newComment);
      expect(result).toBe('newComment1');
      expect(addDoc).toHaveBeenCalled();
    });
  });

  describe('updateComment', () => {
    it('should update comment successfully', async () => {
      const updatedContent = 'Updated comment';
      (getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        exists: () => true,
        data: () => ({ ...mockComment, content: updatedContent }),
      });

      const result = await commentService.updateComment('comment1', updatedContent);
      expect(result).toBeUndefined();
      expect(updateDoc).toHaveBeenCalled();
    });
  });

  describe('deleteComment', () => {
    it('should mark comment as deleted', async () => {
      await commentService.deleteComment('comment1');
      expect(updateDoc).toHaveBeenCalledWith(
        doc(collection(db, 'comments'), 'comment1'),
        expect.objectContaining({
          isDeleted: true,
        })
      );
    });
  });

  describe('getCommentsByCaseId', () => {
    it('should return comments for a case', async () => {
      const mockComments = [mockComment];
      (getDocs as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        docs: mockComments.map(comment => ({ data: () => comment })),
      });

      const result = await commentService.getCommentsByCaseId('case1');
      expect(result).toEqual([mockCommentWithUser]);
      expect(getDocs).toHaveBeenCalled();
    });
  });

  describe('getReplies', () => {
    it('should return replies to a comment', async () => {
      const mockReplies = [mockComment];
      (getDocs as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        docs: mockReplies.map(comment => ({ data: () => comment })),
      });

      const result = await commentService.getReplies('comment1');
      expect(result).toEqual([mockCommentWithUser]);
      expect(getDocs).toHaveBeenCalled();
    });
  });
}); 