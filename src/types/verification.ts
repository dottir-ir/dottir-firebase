import type { Timestamp } from 'firebase/firestore';
import type { User } from './user';

export interface VerificationRequest {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface VerificationRequestWithUser extends VerificationRequest {
  user: User;
} 