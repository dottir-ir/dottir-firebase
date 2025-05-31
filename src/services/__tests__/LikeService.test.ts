import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  DocumentData,
  increment,
  updateDoc,
} from 'firebase/firestore';
import type { Like } from '../../models/Interaction';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MockAuthProvider } from '@/test/mocks/AuthProvider';
import { mockUser, mockCase, mockComment } from '@/test/mocks/data';

// Mock Firebase
jest.mock('firebase/firestore');
jest.mock('../../config/firebase');

describe('LikeService', () => {
  let likeService: LikeService;
  const mockLike: Like = {
    id: 'like1',
    userId: 'user1',
    targetId: 'case1',
    targetType: 'case',
    createdAt: new Date(),
  };

  beforeEach(() => {
    likeService = new LikeService();
    jest.clearAllMocks();
  });

  describe('toggleLike', () => {
    it('should add like when not exists', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: true,
      });

      const result = await likeService.toggleLike('user1', 'case1', 'case');
      expect(result).toBe(true);
      expect(addDoc).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalledWith(
        doc(collection(db, 'cases'), 'case1'),
        { likeCount: increment(1) }
      );
    });

    it('should remove like when exists', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [{ id: 'like1', data: () => mockLike }],
      });

      const result = await likeService.toggleLike('user1', 'case1', 'case');
      expect(result).toBe(false);
      expect(deleteDoc).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalledWith(
        doc(collection(db, 'cases'), 'case1'),
        { likeCount: increment(-1) }
      );
    });
  });

  describe('getLike', () => {
    it('should return like when exists', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [{ id: 'like1', data: () => mockLike }],
      });

      const result = await likeService.getLike('user1', 'case1', 'case');
      expect(result).toEqual(mockLike);
    });

    it('should return null when like does not exist', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: true,
      });

      const result = await likeService.getLike('user1', 'case1', 'case');
      expect(result).toBeNull();
    });
  });

  describe('getLikesByUser', () => {
    it('should return all likes by user', async () => {
      const mockLikes = [mockLike];
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockLikes.map(like => ({ data: () => like })),
      });

      const result = await likeService.getLikesByUser('user1');
      expect(result).toEqual(mockLikes);
    });
  });

  describe('getLikesByTarget', () => {
    it('should return all likes for a target', async () => {
      const mockLikes = [mockLike];
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockLikes.map(like => ({ data: () => like })),
      });

      const result = await likeService.getLikesByTarget('case1', 'case');
      expect(result).toEqual(mockLikes);
    });
  });
}); 