import { db } from '../config/firebase';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Timestamp;
}

export class NotificationService {
  private notificationsCollection = collection(db, 'notifications');

  async createNotification(userId: string, message: string, type: 'info' | 'success' | 'warning' | 'error'): Promise<void> {
    await addDoc(this.notificationsCollection, {
      userId,
      message,
      type,
      read: false,
      createdAt: Timestamp.now(),
    });
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    const q = query(this.notificationsCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Notification));
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await updateDoc(doc(this.notificationsCollection, notificationId), { read: true });
  }
}

export const notificationService = new NotificationService(); 