import { VerificationService } from '../VerificationService';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { userService } from '../UserService';
import { notificationService } from '../NotificationService';
// Mock Firebase and services
jest.mock('firebase/firestore');
jest.mock('../../firebase/config');
jest.mock('../UserService');
jest.mock('../NotificationService');
describe('VerificationService', () => {
    let verificationService;
    const mockVerificationRequest = {
        id: 'request1',
        userId: 'user1',
        documents: ['doc1.pdf', 'doc2.pdf'],
        status: 'pending',
        submittedAt: Timestamp.now(),
    };
    const mockUser = {
        id: 'user1',
        displayName: 'Test User',
        email: 'test@example.com',
        title: 'Dr.',
        specialization: 'Cardiology',
        institution: 'Test Hospital',
    };
    beforeEach(() => {
        verificationService = new VerificationService();
        jest.clearAllMocks();
    });
    describe('submitVerificationRequest', () => {
        it('should submit verification request successfully', async () => {
            addDoc.mockResolvedValue({ id: 'newRequest1' });
            const result = await verificationService.submitVerificationRequest('user1', ['doc1.pdf']);
            expect(result).toBe('newRequest1');
            expect(addDoc).toHaveBeenCalledWith(collection(db, 'verificationRequests'), expect.objectContaining({
                userId: 'user1',
                documents: ['doc1.pdf'],
                status: 'pending',
            }));
        });
    });
    describe('getVerificationRequests', () => {
        it('should return all verification requests with user data', async () => {
            getDocs.mockResolvedValue({
                docs: [{ id: 'request1', data: () => mockVerificationRequest }],
            });
            userService.getUserById.mockResolvedValue(mockUser);
            const result = await verificationService.getVerificationRequests();
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                ...mockVerificationRequest,
                user: mockUser,
            });
        });
    });
    describe('getVerificationRequestById', () => {
        it('should return verification request with user data when found', async () => {
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockVerificationRequest,
            });
            userService.getUserById.mockResolvedValue(mockUser);
            const result = await verificationService.getVerificationRequestById('request1');
            expect(result).toEqual({
                ...mockVerificationRequest,
                user: mockUser,
            });
        });
        it('should throw error when request not found', async () => {
            getDoc.mockResolvedValue({
                exists: () => false,
            });
            await expect(verificationService.getVerificationRequestById('request1')).rejects.toThrow('Verification request not found');
        });
    });
    describe('approveVerificationRequest', () => {
        it('should approve verification request successfully', async () => {
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockVerificationRequest,
            });
            userService.getUserById.mockResolvedValue(mockUser);
            await verificationService.approveVerificationRequest('request1', 'reviewer1');
            expect(updateDoc).toHaveBeenCalledWith(doc(collection(db, 'verificationRequests'), 'request1'), expect.objectContaining({
                status: 'approved',
                reviewerId: 'reviewer1',
            }));
            expect(userService.updateUserProfile).toHaveBeenCalledWith('user1', expect.objectContaining({
                doctorVerificationStatus: 'verified',
                rejectionReason: '',
            }));
            expect(notificationService.createNotification).toHaveBeenCalled();
        });
        it('should throw error when request is not pending', async () => {
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => ({ ...mockVerificationRequest, status: 'approved' }),
            });
            await expect(verificationService.approveVerificationRequest('request1', 'reviewer1')).rejects.toThrow('Can only approve pending requests');
        });
    });
    describe('rejectVerificationRequest', () => {
        it('should reject verification request successfully', async () => {
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockVerificationRequest,
            });
            userService.getUserById.mockResolvedValue(mockUser);
            await verificationService.rejectVerificationRequest('request1', 'reviewer1', 'Invalid documents');
            expect(updateDoc).toHaveBeenCalledWith(doc(collection(db, 'verificationRequests'), 'request1'), expect.objectContaining({
                status: 'rejected',
                reviewerId: 'reviewer1',
                rejectionReason: 'Invalid documents',
            }));
            expect(userService.updateUserProfile).toHaveBeenCalledWith('user1', expect.objectContaining({
                doctorVerificationStatus: 'rejected',
                rejectionReason: 'Invalid documents',
            }));
            expect(notificationService.createNotification).toHaveBeenCalled();
        });
        it('should throw error when request is not pending', async () => {
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => ({ ...mockVerificationRequest, status: 'rejected' }),
            });
            await expect(verificationService.rejectVerificationRequest('request1', 'reviewer1', 'Invalid documents')).rejects.toThrow('Can only reject pending requests');
        });
    });
});
