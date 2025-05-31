export interface Comment {
  id: string;
  caseId: string;
  userId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  likeCount: number;
  isEdited: boolean;
  isDeleted: boolean;
}

export interface CommentWithAuthor extends Comment {
  author: {
    id: string;
    displayName: string;
    photoURL?: string;
  };
} 