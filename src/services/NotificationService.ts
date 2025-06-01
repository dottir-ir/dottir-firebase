import { db } from '@/firebase/config';
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
  Timestamp,
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import type { Notification as NotificationType } from '../types/notification';
import { BaseService } from './BaseService';
import { ServiceError } from '@/utils/errors';

type NotificationData = {
  caseId?: string;
  commentId?: string;
  userId?: string;
};

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
  type?: 'success' | 'error' | 'info';
  title: string;
  data?: NotificationData;
}

export class NotificationService extends BaseService {
  private readonly notificationsCollection = collection(db, 'notifications');

  async createNotification(
    userId: string,
    type: NotificationType['type'],
    title: string,
    message: string,
    data?: NotificationData
  ): Promise<NotificationType> {
    const notification = {
      userId,
      type,
      title,
      message,
      read: false,
      createdAt: new Date(),
      data
    };

    const docRef = await addDoc(this.notificationsCollection, notification);
    return {
      id: docRef.id,
      ...notification
    } as NotificationType;
  }

  async getNotifications(userId: string): Promise<NotificationType[]> {
    const q = query(
      this.notificationsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return this.convertToNotifications(snapshot);
  }

  async markAsRead(notificationId: string): Promise<void> {
    const docRef = doc(this.notificationsCollection, notificationId);
    await updateDoc(docRef, { read: true });
  }

  private convertToNotifications(snapshot: DocumentData): NotificationType[] {
    return snapshot.docs.map((doc: DocumentData) => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}

export const notificationService = new NotificationService(); 