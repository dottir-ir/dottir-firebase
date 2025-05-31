import { User } from '../../types/user';
import { Case } from '../../types/case';
import { Comment } from '../../types/comment';

export const mockUser: User = {
  id: 'user1',
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
  title: 'Interesting Case Study',
  description: 'A detailed case study of a rare condition',
  authorId: 'user1',
  status: 'published',
  tags: ['cardiology', 'radiology'],
  category: 'cardiology',
  difficulty: 'beginner',
  createdAt: new Date(),
  updatedAt: new Date(),
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  saveCount: 0,
  clinicalHistory: 'Patient presented with chest pain',
  clinicalPresentation: 'Acute onset of chest pain',
  imagingFindings: 'Chest X-ray shows...',
  differentialDiagnosis: ['Myocardial Infarction', 'Pulmonary Embolism'],
  finalDiagnosis: 'Acute Coronary Syndrome',
  patientDemographics: {
    age: 45,
    gender: 'male',
    presentingComplaint: 'Chest pain'
  },
  images: [
    {
      url: 'https://example.com/image1.jpg',
      description: 'Chest X-ray',
      order: 1
    }
  ],
  teachingPoints: [
    {
      title: 'Key Learning Point',
      description: 'Important teaching point about this case',
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