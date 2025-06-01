import type { User } from '../../types/user';
import type { Case } from '../../types/case';
import type { Comment } from '../../types/comment';

export const mockUser: User = {
  uid: 'user1',
  email: 'test@example.com',
  displayName: 'Test User',
  role: 'doctor',
  bio: 'Test bio',
  specialization: 'General Medicine',
  experience: '5 years',
  areasOfInterest: ['Cardiology', 'Neurology'],
  verificationDocuments: ['doc1.pdf', 'doc2.pdf'],
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date()
};

export const mockCase: Case = {
  id: 'case1',
  title: 'Test Case',
  description: 'A test case',
  authorId: 'user1',
  status: 'published',
  tags: ['test', 'example'],
  category: 'radiology',
  difficulty: 'beginner',
  createdAt: new Date(),
  updatedAt: new Date(),
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  saveCount: 0,
  likes: [],
  saves: [],
  clinicalHistory: 'Test clinical history',
  clinicalPresentation: 'Test clinical presentation',
  imagingFindings: 'Test imaging findings',
  differentialDiagnosis: ['Test diagnosis 1', 'Test diagnosis 2'],
  finalDiagnosis: 'Test final diagnosis',
  patientDemographics: {
    age: 30,
    gender: 'male',
    presentingComplaint: 'Test complaint'
  },
  images: [],
  teachingPoints: [
    {
      title: 'Test teaching point',
      description: 'Test description',
      order: 1
    }
  ]
};

export const mockComment: Comment = {
  id: 'comment1',
  caseId: 'case1',
  authorId: 'user1',
  content: 'Test comment',
  createdAt: new Date(),
  updatedAt: new Date(),
  likeCount: 0,
  replyCount: 0,
}; 