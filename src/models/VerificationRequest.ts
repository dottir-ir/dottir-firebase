import { Timestamp } from 'firebase/firestore';
import type { User } from '../types/user';

export interface VerificationRequest {
  id: string;
  userId: string;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewerId?: string;
  rejectionReason?: string;
}

export interface VerificationRequestWithUser extends VerificationRequest {
  user: User;
} 