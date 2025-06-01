import { CommentService } from '../CommentService';
import { UserService } from '../UserService';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Comment, CommentWithAuthor } from '../../models/Comment';
// Mock Firebase and UserService
jest.mock('firebase/firestore');
jest.mock('../../config/firebase');
jest.mock('../UserService');
describe('CommentService', () => {
    let commentService;
    let mockUserService;
    const mockUser = {
        id: 'user1',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
    };
    const mockComment = {
        id: 'comment1',
        caseId: 'case1',
        userId: 'user1',
        text: 'Test comment',
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: undefined,
        likeCount: 0,
        isEdited: false,
        isDeleted: false
    };
    const mockCommentWithAuthor = {
        ...mockComment,
        author: {
            id: 'user1',
            displayName: 'Test User',
            photoURL: 'https://example.com/photo.jpg'
        }
    };
    beforeEach(() => {
        mockUserService = new UserService();
        mockUserService.getUserById.mockResolvedValue(mockUser);
        commentService = new CommentService();
        jest.clearAllMocks();
    });
    describe('getCommentById', () => {
        it('should return comment with author when found', async () => {
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockComment,
            });
            const result = await commentService.getCommentById('comment1');
            expect(result).toEqual(mockCommentWithAuthor);
            expect(getDoc).toHaveBeenCalledWith(doc(collection(db, 'comments'), 'comment1'));
        });
        it('should throw error when comment not found', async () => {
            getDoc.mockResolvedValue({
                exists: () => false,
            });
            await expect(commentService.getCommentById('comment1')).rejects.toThrow('Comment not found');
        });
    });
    describe('createComment', () => {
        it('should create comment successfully', async () => {
            const newComment = {
                caseId: 'case1',
                userId: 'user1',
                text: 'New comment'
            };
            addDoc.mockResolvedValue({ id: 'newComment1' });
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => ({ ...newComment, id: 'newComment1' }),
            });
            const result = await commentService.createComment(newComment);
            expect(result).toEqual({
                ...newComment,
                id: 'newComment1',
                author: mockUser,
            });
            expect(addDoc).toHaveBeenCalled();
        });
    });
    describe('updateComment', () => {
        it('should update comment successfully', async () => {
            const updatedContent = 'Updated comment';
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => ({ ...mockComment, text: updatedContent, isEdited: true }),
            });
            const result = await commentService.updateComment('comment1', updatedContent);
            expect(result).toEqual({
                ...mockComment,
                text: updatedContent,
                isEdited: true,
                author: mockUser,
            });
            expect(updateDoc).toHaveBeenCalled();
        });
    });
    describe('deleteComment', () => {
        it('should mark comment as deleted', async () => {
            await commentService.deleteComment('comment1');
            expect(updateDoc).toHaveBeenCalledWith(doc(collection(db, 'comments'), 'comment1'), expect.objectContaining({
                isDeleted: true,
            }));
        });
    });
    describe('getCommentsByCase', () => {
        it('should return comments for a case', async () => {
            const mockComments = [mockComment];
            getDocs.mockResolvedValue({
                docs: mockComments.map(comment => ({ data: () => comment })),
            });
            const result = await commentService.getCommentsByCase('case1');
            expect(result).toEqual([mockCommentWithAuthor]);
            expect(getDocs).toHaveBeenCalled();
        });
    });
    describe('getReplies', () => {
        it('should return replies to a comment', async () => {
            const mockReplies = [mockComment];
            getDocs.mockResolvedValue({
                docs: mockReplies.map(comment => ({ data: () => comment })),
            });
            const result = await commentService.getReplies('comment1');
            expect(result).toEqual([mockCommentWithAuthor]);
            expect(getDocs).toHaveBeenCalled();
        });
    });
});
