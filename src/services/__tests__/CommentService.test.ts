import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import type { Comment, CommentWithAuthor } from '../../models/Comment';
import { CommentService } from '../CommentService';
import { UserService } from '../UserService';
import { db } from '../../config/firebase';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MockAuthProvider } from '@/test/mocks/AuthProvider';
import { mockUser, mockCase, mockComment } from '@/test/mocks/data';

// Mock Firebase and UserService
jest.mock('firebase/firestore');
jest.mock('../../config/firebase');
jest.mock('../UserService');

describe('CommentService', () => {
  let commentService: CommentService;
  let mockUserService: jest.Mocked<UserService>;

  const mockUser = {
    id: 'user1',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
  };

  const mockComment: Comment = {
    id: 'comment1',
    caseId: 'case1',
    userId: 'user1',
    text: 'Test comment',
    createdAt: new Date(),
    updatedAt: new Date(),
    parentId: undefined,
    likeCount: 0,
    isEdited: false,
    isDeleted: false
  };

  const mockCommentWithAuthor: CommentWithAuthor = {
    ...mockComment,
    author: {
      id: 'user1',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg'
    }
  };

  beforeEach(() => {
    mockUserService = new UserService() as jest.Mocked<UserService>;
    mockUserService.getUserById.mockResolvedValue(mockUser as any);
    commentService = new CommentService();
    jest.clearAllMocks();
  });

  describe('getCommentById', () => {
    it('should return comment with author when found', async () => {
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => mockComment,
      });

      const result = await commentService.getCommentById('comment1');
      expect(result).toEqual(mockCommentWithAuthor);
      expect(getDoc).toHaveBeenCalledWith(doc(collection(db, 'comments'), 'comment1'));
    });

    it('should throw error when comment not found', async () => {
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });

      await expect(commentService.getCommentById('comment1')).rejects.toThrow('Comment not found');
    });
  });

  describe('createComment', () => {
    it('should create comment successfully', async () => {
      const newComment = {
        caseId: 'case1',
        userId: 'user1',
        text: 'New comment'
      };

      (addDoc as jest.Mock).mockResolvedValue({ id: 'newComment1' });
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ ...newComment, id: 'newComment1' }),
      });

      const result = await commentService.createComment(newComment);
      expect(result).toEqual({
        ...newComment,
        id: 'newComment1',
        author: mockUser,
      });
      expect(addDoc).toHaveBeenCalled();
    });
  });

  describe('updateComment', () => {
    it('should update comment successfully', async () => {
      const updatedContent = 'Updated comment';
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ ...mockComment, text: updatedContent, isEdited: true }),
      });

      const result = await commentService.updateComment('comment1', updatedContent);
      expect(result).toEqual({
        ...mockComment,
        text: updatedContent,
        isEdited: true,
        author: mockUser,
      });
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

  describe('getCommentsByCase', () => {
    it('should return comments for a case', async () => {
      const mockComments = [mockComment];
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockComments.map(comment => ({ data: () => comment })),
      });

      const result = await commentService.getCommentsByCase('case1');
      expect(result).toEqual([mockCommentWithAuthor]);
      expect(getDocs).toHaveBeenCalled();
    });
  });

  describe('getReplies', () => {
    it('should return replies to a comment', async () => {
      const mockReplies = [mockComment];
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockReplies.map(comment => ({ data: () => comment })),
      });

      const result = await commentService.getReplies('comment1');
      expect(result).toEqual([mockCommentWithAuthor]);
      expect(getDocs).toHaveBeenCalled();
    });
  });
}); 