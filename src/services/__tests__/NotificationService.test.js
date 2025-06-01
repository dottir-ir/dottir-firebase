import { NotificationService, Notification } from '../NotificationService';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
// Mock Firebase
jest.mock('firebase/firestore');
jest.mock('../../config/firebase');
describe('NotificationService', () => {
    let notificationService;
    const mockNotification = {
        id: 'notification1',
        userId: 'user1',
        message: 'Test notification',
        type: 'info',
        read: false,
        createdAt: Timestamp.now()
    };
    beforeEach(() => {
        notificationService = new NotificationService();
        jest.clearAllMocks();
    });
    describe('createNotification', () => {
        it('should create notification successfully', async () => {
            await notificationService.createNotification('user1', 'Test notification', 'info');
            expect(addDoc).toHaveBeenCalledWith(collection(db, 'notifications'), expect.objectContaining({
                userId: 'user1',
                message: 'Test notification',
                type: 'info',
                read: false
            }));
        });
    });
    describe('getUserNotifications', () => {
        it('should return user notifications', async () => {
            const mockNotifications = [mockNotification];
            getDocs.mockResolvedValue({
                docs: mockNotifications.map(notification => ({ id: notification.id, data: () => notification })),
            });
            const result = await notificationService.getUserNotifications('user1');
            expect(result).toEqual(mockNotifications);
            expect(getDocs).toHaveBeenCalled();
        });
    });
    describe('markNotificationAsRead', () => {
        it('should mark notification as read', async () => {
            await notificationService.markNotificationAsRead('notification1');
            expect(updateDoc).toHaveBeenCalledWith(doc(collection(db, 'notifications'), 'notification1'), { read: true });
        });
    });
});
