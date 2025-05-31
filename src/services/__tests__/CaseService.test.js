import { CaseService } from '../CaseService';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Case } from '../../types/case';
// Mock Firebase
jest.mock('firebase/firestore');
jest.mock('../../config/firebase');
describe('CaseService', () => {
    let caseService;
    const mockCase = {
        id: 'case1',
        title: 'Test Case',
        description: 'Test Description',
        content: 'Test Content',
        authorId: 'user1',
        authorName: 'Test User',
        authorImage: 'https://example.com/avatar.jpg',
        status: 'published',
        tags: ['cardiology', 'emergency'],
        category: 'Cardiology',
        difficulty: 'intermediate',
        patientAge: 45,
        patientGender: 'male',
        clinicalPresentation: 'Test presentation',
        imagingFindings: 'Test findings',
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        saveCount: 0,
        likes: [],
        saves: [],
        teachingPoints: {
            keyPoints: ['Test point 1', 'Test point 2'],
            references: ['Test reference 1'],
            relatedCases: ['case2']
        }
    };
    beforeEach(() => {
        caseService = new CaseService();
        jest.clearAllMocks();
    });
    describe('getCaseById', () => {
        it('should return case when found', async () => {
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockCase,
            });
            const result = await caseService.getCaseById('case1');
            expect(result).toEqual(mockCase);
            expect(getDoc).toHaveBeenCalledWith(doc(collection(db, 'cases'), 'case1'));
        });
        it('should throw error when case not found', async () => {
            getDoc.mockResolvedValue({
                exists: () => false,
            });
            await expect(caseService.getCaseById('case1')).rejects.toThrow('Case not found');
        });
    });
    describe('createCase', () => {
        it('should create case successfully', async () => {
            const newCase = {
                title: 'New Case',
                description: 'New Description',
                content: 'New Content',
                authorId: 'user1',
                authorName: 'Test User',
                authorImage: 'https://example.com/avatar.jpg',
                status: 'draft',
                tags: ['test'],
                category: 'Test',
                difficulty: 'beginner',
                patientAge: 30,
                patientGender: 'female',
                clinicalPresentation: 'Test presentation',
                imagingFindings: 'Test findings',
                images: [],
                teachingPoints: {
                    keyPoints: ['Test point 1'],
                    references: ['Test reference 1'],
                    relatedCases: []
                }
            };
            addDoc.mockResolvedValue({ id: 'newCase1' });
            getDoc.mockResolvedValue({
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
            getDoc.mockResolvedValue({
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
            getDocs.mockResolvedValue({
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
            getDocs.mockResolvedValue({
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
            getDocs.mockResolvedValue({
                docs: mockCases.map(case_ => ({ data: () => case_ })),
            });
            const result = await caseService.searchCases('Test');
            expect(result).toHaveLength(1);
            expect(getDocs).toHaveBeenCalled();
        });
    });
});
