import { db } from '../../firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import type { Case, CaseUpload } from '../../types/case';
import { CaseService } from '../CaseService';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Firebase
vi.mock('firebase/firestore');
vi.mock('../../config/firebase');

describe('CaseService', () => {
  let caseService: CaseService;
  const mockCase: Case = {
    id: 'case1',
    title: 'Test Case',
    description: 'Test Description',
    authorId: 'user1',
    status: 'published',
    tags: ['cardiology', 'emergency'],
    category: 'Cardiology',
    difficulty: 'intermediate',
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    saveCount: 0,
    clinicalHistory: 'Test clinical history',
    patientDemographics: {
      age: 45,
      gender: 'male',
      presentingComplaint: 'Test complaint'
    },
    images: [{
      url: 'https://example.com/image.jpg',
      description: 'Test image',
      order: 1
    }],
    teachingPoints: [{
      title: 'Test point 1',
      description: 'Test description 1',
      order: 1
    }]
  };

  beforeEach(() => {
    caseService = new CaseService();
    vi.clearAllMocks();
  });

  describe('getCaseById', () => {
    it('should return case when found', async () => {
      (getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        exists: () => true,
        data: () => mockCase,
      });

      const result = await caseService.getCaseById('case1');
      expect(result).toEqual(mockCase);
      expect(getDoc).toHaveBeenCalledWith(doc(collection(db, 'cases'), 'case1'));
    });

    it('should throw error when case not found', async () => {
      (getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        exists: () => false,
      });

      await expect(caseService.getCaseById('case1')).rejects.toThrow('Case not found');
    });
  });

  describe('createCase', () => {
    it('should create case successfully', async () => {
      const newCase: CaseUpload = {
        title: 'New Case',
        description: 'New Description',
        authorId: 'user1',
        status: 'draft',
        tags: ['test'],
        category: 'Test',
        difficulty: 'beginner',
        clinicalHistory: 'Test clinical history',
        patientDemographics: {
          age: 30,
          gender: 'female',
          presentingComplaint: 'Test complaint'
        },
        images: [{
          url: 'https://example.com/image.jpg',
          description: 'Test image',
          order: 1
        }],
        teachingPoints: [{
          title: 'Test point 1',
          description: 'Test description 1',
          order: 1
        }]
      };

      (addDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'newCase1' });
      (getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        exists: () => true,
        data: () => ({ ...newCase, id: 'newCase1' }),
      });

      const result = await caseService.createCase(newCase);
      expect(result).toBe('newCase1');
      expect(addDoc).toHaveBeenCalled();
    });
  });

  describe('updateCase', () => {
    it('should update case successfully', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ ...mockCase, ...updateData }),
      });

      const result = await caseService.updateCase('case1', updateData);
      expect(result).toEqual({ ...mockCase, ...updateData });
      expect(updateDoc).toHaveBeenCalled();
    });
  });

  describe('deleteCase', () => {
    it('should delete case successfully', async () => {
      await caseService.deleteCase('case1');
      expect(deleteDoc).toHaveBeenCalledWith(doc(collection(db, 'cases'), 'case1'));
    });
  });

  describe('getCasesByAuthor', () => {
    it('should return cases by author', async () => {
      const mockCases = [mockCase];
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockCases.map(case_ => ({ data: () => case_ })),
      });

      const result = await caseService.getCasesByAuthor('user1');
      expect(result).toHaveLength(1);
      expect(getDocs).toHaveBeenCalled();
    });
  });

  describe('getRecentCases', () => {
    it('should return recent cases', async () => {
      const mockCases = [mockCase];
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockCases.map(case_ => ({ data: () => case_ })),
      });

      const result = await caseService.getRecentCases(5);
      expect(result).toHaveLength(1);
      expect(getDocs).toHaveBeenCalled();
    });
  });

  describe('searchCases', () => {
    it('should return matching cases', async () => {
      const mockCases = [mockCase];
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockCases.map(case_ => ({ data: () => case_ })),
      });

      const result = await caseService.searchCases('Test');
      expect(result).toHaveLength(1);
      expect(getDocs).toHaveBeenCalled();
    });
  });
}); 