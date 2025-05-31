import { db } from '../../config/firebase';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MockAuthProvider } from '@/test/mocks/AuthProvider';
import { mockUser, mockCase, mockComment } from '@/test/mocks/data';

// Mock Firebase
jest.mock('firebase/firestore');
jest.mock('../../config/firebase');

describe('NotificationService', () => {
  let notificationService: NotificationService;
  const mockNotification: Notification = {
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
      expect(addDoc).toHaveBeenCalledWith(
        collection(db, 'notifications'),
        expect.objectContaining({
          userId: 'user1',
          message: 'Test notification',
          type: 'info',
          read: false
        })
      );
    });
  });

  describe('getUserNotifications', () => {
    it('should return user notifications', async () => {
      const mockNotifications = [mockNotification];
      (getDocs as jest.Mock).mockResolvedValue({
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
      expect(updateDoc).toHaveBeenCalledWith(
        doc(collection(db, 'notifications'), 'notification1'),
        { read: true }
      );
    });
  });
}); 