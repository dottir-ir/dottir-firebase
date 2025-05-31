import type { Timestamp } from 'firebase/firestore';

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'reply' | 'verification' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: {
    caseId?: string;
    commentId?: string;
    userId?: string;
  };
} 