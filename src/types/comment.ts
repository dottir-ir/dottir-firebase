import type { User } from './user';

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  replyCount: number;
  parentId?: string;
}

export interface CommentWithUser extends Comment {
  author: User;
}

export type CommentUpload = Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'isEdited' | 'isDeleted'>; 