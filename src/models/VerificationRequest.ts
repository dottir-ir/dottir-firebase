
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
  user: {
    id: string;
    displayName: string;
    email: string;
    title: string;
    specialization?: string;
    institution?: string;
  };
} 