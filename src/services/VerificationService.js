import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, Timestamp, DocumentData, } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BaseService } from './BaseService';
import { ServiceError } from '@/utils/errors';
import { VerificationRequest, VerificationRequestWithUser } from '../models/VerificationRequest';
import { userService } from './UserService';
import { notificationService } from './NotificationService';
export class VerificationService extends BaseService {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "verificationRequestsCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'verificationRequests')
        });
    }
    async submitVerificationRequest(userId, documents) {
        try {
            const verificationRequest = {
                userId,
                documents,
                status: 'pending',
                submittedAt: Timestamp.now(),
            };
            const docRef = await addDoc(this.verificationRequestsCollection, verificationRequest);
            return docRef.id;
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getVerificationRequests() {
        try {
            const q = query(this.verificationRequestsCollection, orderBy('submittedAt', 'desc'));
            const snapshot = await getDocs(q);
            const requests = await Promise.all(snapshot.docs.map(async (doc) => {
                const data = doc.data();
                const user = await userService.getUserById(data.userId);
                return {
                    id: doc.id,
                    ...data,
                    user: {
                        id: user.id,
                        displayName: user.displayName,
                        email: user.email,
                        title: user.title,
                        specialization: user.specialization,
                        institution: user.institution,
                    },
                };
            }));
            return requests;
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getVerificationRequestById(id) {
        try {
            const docRef = doc(this.verificationRequestsCollection, id);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                throw new ServiceError('Verification request not found', 'not-found');
            }
            const data = docSnap.data();
            const user = await userService.getUserById(data.userId);
            return {
                id: docSnap.id,
                ...data,
                user: {
                    id: user.id,
                    displayName: user.displayName,
                    email: user.email,
                    title: user.title,
                    specialization: user.specialization,
                    institution: user.institution,
                },
            };
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    // Mock email sending function
    async mockSendEmail(to, subject, body) {
        // In production, replace this with a real email service integration (e.g., SendGrid, Mailgun, etc.)
        console.log('[MOCK EMAIL]', { to, subject, body });
    }
    async approveVerificationRequest(id, reviewerId) {
        try {
            const request = await this.getVerificationRequestById(id);
            if (request.status !== 'pending') {
                throw new ServiceError('Can only approve pending requests', 'invalid-status');
            }
            await updateDoc(doc(this.verificationRequestsCollection, id), {
                status: 'approved',
                reviewedAt: Timestamp.now(),
                reviewerId,
            });
            // Update user's verification status
            await userService.updateUserProfile(request.userId, {
                doctorVerificationStatus: 'verified',
                rejectionReason: '',
            });
            // Send notification and mock email
            await notificationService.createNotification(request.userId, 'Your doctor verification has been approved. You can now access all doctor features.', 'success');
            await this.mockSendEmail(request.user.email, 'Your doctor verification has been approved', 'Congratulations! Your account has been verified. You can now access all doctor features.');
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async rejectVerificationRequest(id, reviewerId, reason) {
        try {
            const request = await this.getVerificationRequestById(id);
            if (request.status !== 'pending') {
                throw new ServiceError('Can only reject pending requests', 'invalid-status');
            }
            await updateDoc(doc(this.verificationRequestsCollection, id), {
                status: 'rejected',
                reviewedAt: Timestamp.now(),
                reviewerId,
                rejectionReason: reason,
            });
            // Update user's verification status
            await userService.updateUserProfile(request.userId, {
                doctorVerificationStatus: 'rejected',
                rejectionReason: reason,
            });
            // Send notification and mock email
            await notificationService.createNotification(request.userId, `Your doctor verification was rejected. Reason: ${reason}`, 'error');
            await this.mockSendEmail(request.user.email, 'Your doctor verification has been rejected', `Your verification was rejected for the following reason: ${reason}`);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
}
export const verificationService = new VerificationService();
