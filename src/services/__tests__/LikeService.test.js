import { LikeService } from '../LikeService';
import { collection, doc, getDoc, getDocs, addDoc, deleteDoc, query, where, increment, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Like } from '../../models/Interaction';
// Mock Firebase
jest.mock('firebase/firestore');
jest.mock('../../config/firebase');
describe('LikeService', () => {
    let likeService;
    const mockLike = {
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
            getDocs.mockResolvedValue({
                empty: true,
            });
            const result = await likeService.toggleLike('user1', 'case1', 'case');
            expect(result).toBe(true);
            expect(addDoc).toHaveBeenCalled();
            expect(updateDoc).toHaveBeenCalledWith(doc(collection(db, 'cases'), 'case1'), { likeCount: increment(1) });
        });
        it('should remove like when exists', async () => {
            getDocs.mockResolvedValue({
                empty: false,
                docs: [{ id: 'like1', data: () => mockLike }],
            });
            const result = await likeService.toggleLike('user1', 'case1', 'case');
            expect(result).toBe(false);
            expect(deleteDoc).toHaveBeenCalled();
            expect(updateDoc).toHaveBeenCalledWith(doc(collection(db, 'cases'), 'case1'), { likeCount: increment(-1) });
        });
    });
    describe('getLike', () => {
        it('should return like when exists', async () => {
            getDocs.mockResolvedValue({
                empty: false,
                docs: [{ id: 'like1', data: () => mockLike }],
            });
            const result = await likeService.getLike('user1', 'case1', 'case');
            expect(result).toEqual(mockLike);
        });
        it('should return null when like does not exist', async () => {
            getDocs.mockResolvedValue({
                empty: true,
            });
            const result = await likeService.getLike('user1', 'case1', 'case');
            expect(result).toBeNull();
        });
    });
    describe('getLikesByUser', () => {
        it('should return all likes by user', async () => {
            const mockLikes = [mockLike];
            getDocs.mockResolvedValue({
                docs: mockLikes.map(like => ({ data: () => like })),
            });
            const result = await likeService.getLikesByUser('user1');
            expect(result).toEqual(mockLikes);
        });
    });
    describe('getLikesByTarget', () => {
        it('should return all likes for a target', async () => {
            const mockLikes = [mockLike];
            getDocs.mockResolvedValue({
                docs: mockLikes.map(like => ({ data: () => like })),
            });
            const result = await likeService.getLikesByTarget('case1', 'case');
            expect(result).toEqual(mockLikes);
        });
    });
});
