import type { User } from '@/types/user';
import type { Case } from '@/types/case';
import type { Comment } from '@/types/comment';

export const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
  role: 'doctor',
  title: 'Dr.',
  specialization: 'Cardiology',
  institution: 'Test Hospital',
  lastLoginAt: new Date(),
  doctorVerificationStatus: 'verified',
  isDeleted: false
};

export const mockCase: Case = {
  id: 'test-case-id',
  title: 'Test Case',
  description: 'This is a test case',
  content: 'Test content',
  authorId: mockUser.id,
  authorName: mockUser.displayName,
  authorImage: mockUser.photoURL,
  status: 'published',
  tags: ['test'],
  category: 'Cardiology',
  difficulty: 'intermediate',
  patientAge: 45,
  patientGender: 'male',
  clinicalPresentation: 'Test presentation',
  imagingFindings: 'Test findings',
  images: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: new Date(),
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  saveCount: 0,
  likes: [],
  saves: [],
  teachingPoints: {
    keyPoints: ['Test point 1'],
    references: ['Test reference 1'],
    relatedCases: []
  },
  isDeleted: false
};

export const mockComment: Comment = {
  id: 'test-comment-id',
  caseId: mockCase.id,
  userId: mockUser.id,
  text: 'This is a test comment',
  createdAt: new Date(),
  updatedAt: new Date(),
  parentId: undefined,
  likeCount: 0,
  isEdited: false,
  isDeleted: false
}; 