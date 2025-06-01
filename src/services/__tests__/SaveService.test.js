import { SaveService } from '../SaveService';
import { collection, doc, getDoc, getDocs, addDoc, deleteDoc, query, where, increment, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Save } from '../../models/Interaction';
// Mock Firebase
jest.mock('firebase/firestore');
jest.mock('../../config/firebase');
describe('SaveService', () => {
    let saveService;
    const mockSave = {
        id: 'save1',
        userId: 'user1',
        caseId: 'case1',
        createdAt: new Date(),
        note: 'Test note',
        tags: ['test', 'example']
    };
    beforeEach(() => {
        saveService = new SaveService();
        jest.clearAllMocks();
    });
    describe('toggleSave', () => {
        it('should add save when not exists', async () => {
            getDocs.mockResolvedValue({
                empty: true,
            });
            const result = await saveService.toggleSave('user1', 'case1');
            expect(result).toBe(true);
            expect(addDoc).toHaveBeenCalled();
            expect(updateDoc).toHaveBeenCalledWith(doc(collection(db, 'cases'), 'case1'), { saveCount: increment(1) });
        });
        it('should remove save when exists', async () => {
            getDocs.mockResolvedValue({
                empty: false,
                docs: [{ id: 'save1', data: () => mockSave }],
            });
            const result = await saveService.toggleSave('user1', 'case1');
            expect(result).toBe(false);
            expect(deleteDoc).toHaveBeenCalled();
            expect(updateDoc).toHaveBeenCalledWith(doc(collection(db, 'cases'), 'case1'), { saveCount: increment(-1) });
        });
    });
    describe('getSave', () => {
        it('should return save when exists', async () => {
            getDocs.mockResolvedValue({
                empty: false,
                docs: [{ id: 'save1', data: () => mockSave }],
            });
            const result = await saveService.getSave('user1', 'case1');
            expect(result).toEqual(mockSave);
        });
        it('should return null when save does not exist', async () => {
            getDocs.mockResolvedValue({
                empty: true,
            });
            const result = await saveService.getSave('user1', 'case1');
            expect(result).toBeNull();
        });
    });
    describe('getSavedCases', () => {
        it('should return all saved cases by user', async () => {
            const mockSaves = [mockSave];
            getDocs.mockResolvedValue({
                docs: mockSaves.map(save => ({ data: () => save })),
            });
            const result = await saveService.getSavedCases('user1');
            expect(result).toBeDefined();
        });
    });
    describe('updateSaveNote', () => {
        it('should update save note', async () => {
            const newNote = 'Updated note';
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => ({ ...mockSave, note: newNote }),
            });
            const result = await saveService.updateSaveNote('save1', newNote);
            expect(result.note).toBe(newNote);
            expect(updateDoc).toHaveBeenCalled();
        });
    });
    describe('updateSaveTags', () => {
        it('should update save tags', async () => {
            const newTags = ['new', 'tags'];
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => ({ ...mockSave, tags: newTags }),
            });
            const result = await saveService.updateSaveTags('save1', newTags);
            expect(result.tags).toEqual(newTags);
            expect(updateDoc).toHaveBeenCalled();
        });
    });
});
