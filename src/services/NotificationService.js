import { collection, addDoc, getDocs, updateDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
export class NotificationService {
    constructor() {
        Object.defineProperty(this, "notificationsCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'notifications')
        });
    }
    async createNotification(userId, message, type) {
        await addDoc(this.notificationsCollection, {
            userId,
            message,
            type,
            read: false,
            createdAt: Timestamp.now(),
        });
    }
    async getUserNotifications(userId) {
        const q = query(this.notificationsCollection, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    }
    async markNotificationAsRead(notificationId) {
        await updateDoc(doc(this.notificationsCollection, notificationId), { read: true });
    }
}
export const notificationService = new NotificationService();
