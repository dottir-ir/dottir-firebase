import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import type { VerificationRequest, VerificationRequestWithUser } from '../types/verification';
import { BaseService } from './BaseService';
import { ServiceError } from '@/utils/errors';
import { UserService } from './UserService';
import { NotificationService } from './NotificationService';

export class VerificationService extends BaseService {
  private readonly verificationRequestsCollection = collection(db, 'verificationRequests');
  private readonly userService: UserService;
  private readonly notificationService: NotificationService;

  constructor() {
    super();
    this.userService = new UserService();
    this.notificationService = new NotificationService();
  }

  async createVerificationRequest(
    userId: string,
    documents: string[]
  ): Promise<VerificationRequest> {
    try {
      const request: Omit<VerificationRequest, 'id'> = {
        userId,
        status: 'pending',
        documents,
        submittedAt: new Date()
      };

      const docRef = await addDoc(this.verificationRequestsCollection, request);
      return {
        id: docRef.id,
        ...request
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getVerificationRequests(): Promise<VerificationRequestWithUser[]> {
    try {
      const q = query(
        this.verificationRequestsCollection,
        orderBy('submittedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const requests = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data() as DocumentData;
          const user = await this.userService.getUserById(data.userId);
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
          } as VerificationRequestWithUser;
        })
      );
      return requests;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getVerificationRequestById(id: string): Promise<VerificationRequestWithUser> {
    try {
      const docRef = doc(this.verificationRequestsCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Verification request not found');
      }

      const data = docSnap.data() as DocumentData;
      const user = await this.userService.getUserById(data.userId);
      
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
      } as VerificationRequestWithUser;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async approveVerificationRequest(
    requestId: string,
    reviewerId: string
  ): Promise<void> {
    try {
      const request = await this.getVerificationRequestById(requestId);
      const docRef = doc(this.verificationRequestsCollection, requestId);

      await updateDoc(docRef, {
        status: 'approved',
        reviewedAt: new Date(),
        reviewedBy: reviewerId
      });

      await this.userService.updateUserProfile(request.userId, {
        doctorVerificationStatus: 'verified'
      });

      await this.notificationService.createNotification(
        request.userId,
        'verification',
        'Verification Approved',
        'Your doctor verification has been approved.',
        { userId: request.userId }
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  async rejectVerificationRequest(
    requestId: string,
    reviewerId: string,
    reason: string
  ): Promise<void> {
    try {
      const request = await this.getVerificationRequestById(requestId);
      const docRef = doc(this.verificationRequestsCollection, requestId);

      await updateDoc(docRef, {
        status: 'rejected',
        reviewedAt: new Date(),
        reviewedBy: reviewerId,
        rejectionReason: reason
      });

      await this.userService.updateUserProfile(request.userId, {
        doctorVerificationStatus: 'rejected',
        rejectionReason: reason
      });

      await this.notificationService.createNotification(
        request.userId,
        'verification',
        'Verification Rejected',
        `Your doctor verification has been rejected. Reason: ${reason}`,
        { userId: request.userId }
      );
    } catch (error) {
      return this.handleError(error);
    }
  }
}