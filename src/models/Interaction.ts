export interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'case' | 'comment';
  createdAt: Date;
}

export interface Save {
  id: string;
  userId: string;
  caseId: string;
  createdAt: Date;
  note?: string;
  tags?: string[];
} 