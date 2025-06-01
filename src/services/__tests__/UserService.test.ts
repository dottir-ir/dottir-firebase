import { db } from '../../lib/firebase';

// Mock Firebase
jest.mock('firebase/firestore');
jest.mock('../../config/firebase');

describe('UserService', () => {
  let userService: UserService;
  const mockUser = {
    id: 'user1',
    uid: 'user1',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
    role: 'doctor' as const,
    title: 'Dr.',
    specialization: 'Cardiology',
    institution: 'Test Hospital',
    bio: 'Test bio',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    doctorVerificationStatus: 'verified' as const,
    verificationDocuments: ['doc1.pdf', 'doc2.pdf']
  };

  const mockCase = {
    id: 'case1',
    title: 'Test Case',
    description: 'Test description',
    authorId: 'user1',
    status: 'published' as const,
    tags: ['cardiology', 'emergency'],
    category: 'cardiology',
    difficulty: 'intermediate',
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    viewCount: 10,
    likeCount: 5,
    commentCount: 2,
    saveCount: 3
  };

  const mockSavedCase = {
    id: 'saved1',
    userId: 'user1',
    caseId: 'case1',
    progress: 75,
    score: 85,
    timeSpent: 1200,
    lastActive: new Date(),
    savedAt: new Date()
  };

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => mockUser,
      });

      const result = await userService.getUserById('user1');
      expect(result).toEqual(mockUser);
      expect(getDoc).toHaveBeenCalledWith(doc(collection(db, 'users'), 'user1'));
    });

    it('should throw error when user not found', async () => {
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });

      await expect(userService.getUserById('user1')).rejects.toThrow('User not found');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        displayName: 'Updated Name',
        bio: 'Updated bio',
      };

      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ ...mockUser, ...updateData }),
      });

      const result = await userService.updateUserProfile('user1', updateData);
      expect(result).toEqual({ ...mockUser, ...updateData });
      expect(updateDoc).toHaveBeenCalled();
    });
  });

  describe('getUserPublishedCases', () => {
    it('should return user published cases', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        docs: [{ id: 'case1', data: () => mockCase }],
      });

      const result = await userService.getUserPublishedCases('user1');
      expect(result).toEqual([mockCase]);
      expect(getDocs).toHaveBeenCalledWith(
        expect.objectContaining({
          _queryConstraints: expect.arrayContaining([
            expect.objectContaining({ fieldPath: 'authorId', opStr: '==', value: 'user1' }),
            expect.objectContaining({ fieldPath: 'status', opStr: '==', value: 'published' }),
          ]),
        })
      );
    });
  });

  describe('getUserSavedCases', () => {
    it('should return user saved cases', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        docs: [{ id: 'saved1', data: () => mockSavedCase }],
      });

      const result = await userService.getUserSavedCases('user1');
      expect(result).toEqual([mockSavedCase]);
      expect(getDocs).toHaveBeenCalledWith(
        expect.objectContaining({
          _queryConstraints: expect.arrayContaining([
            expect.objectContaining({ fieldPath: 'userId', opStr: '==', value: 'user1' }),
          ]),
        })
      );
    });
  });

  describe('getUserLearningMetrics', () => {
    it('should return user learning metrics', async () => {
      const mockSavedCases = [
        { ...mockSavedCase, progress: 100, score: 90 },
        { ...mockSavedCase, id: 'saved2', progress: 100, score: 80 },
        { ...mockSavedCase, id: 'saved3', progress: 50, score: 70 },
      ];

      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockSavedCases.map(case_ => ({ id: case_.id, data: () => case_ })),
      });

      const result = await userService.getUserLearningMetrics('user1');
      expect(result).toEqual({
        casesCompleted: 2,
        averageScore: 85,
        timeSpent: 3600,
        lastActive: expect.any(Date),
      });
    });

    it('should handle empty saved cases', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        docs: [],
      });

      const result = await userService.getUserLearningMetrics('user1');
      expect(result).toEqual({
        casesCompleted: 0,
        averageScore: 0,
        timeSpent: 0,
        lastActive: expect.any(Date),
      });
    });
  });

  describe('deleteCase', () => {
    it('should delete case successfully', async () => {
      await userService.deleteCase('case1');
      expect(deleteDoc).toHaveBeenCalledWith(doc(collection(db, 'cases'), 'case1'));
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      await userService.deleteUser('user1');
      expect(deleteDoc).toHaveBeenCalledWith(doc(collection(db, 'users'), 'user1'));
    });
  });

  describe('searchUsers', () => {
    it('should return matching users', async () => {
      const mockUsers = [mockUser];
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockUsers.map(user => ({ data: () => user })),
      });

      const result = await userService.searchUsers('Test');
      expect(result).toEqual(mockUsers);
      expect(getDocs).toHaveBeenCalledWith(
        expect.objectContaining({
          _queryConstraints: expect.arrayContaining([
            expect.objectContaining({ fieldPath: 'displayName', opStr: '>=', value: 'Test' }),
            expect.objectContaining({ fieldPath: 'displayName', opStr: '<=', value: 'Test\uf8ff' }),
          ]),
        })
      );
    });
  });
}); 