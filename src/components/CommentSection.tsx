import React, { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { User } from '../types/user';
import { Comment, CommentWithUser } from '../types/comment';
import { CommentService } from '../services/CommentService';

interface CommentSectionProps {
  caseId: string;
  user: User | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({ caseId, user }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const commentService = new CommentService();

  useEffect(() => {
    loadComments();
  }, [caseId]);

  const loadComments = async () => {
    try {
      const loadedComments = await commentService.getCommentsByCaseId(caseId);
      setComments(loadedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user?.uid) return;

    try {
      const newComment: Omit<Comment, 'id'> = {
        content: comment,
        authorId: user.uid,
        caseId: caseId,
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 0,
        replyCount: 0
      };

      await commentService.createComment(newComment);
      setComment('');
      loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!user?.uid) return;
    try {
      await commentService.deleteComment(commentId);
      loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="mt-8">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-semibold">{comment.author.displayName}</span>
              <span className="text-gray-500 text-sm ml-2">
                {comment.createdAt.toLocaleDateString()}
              </span>
            </div>
            {user?.uid === comment.authorId && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          <p className="text-gray-700">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentSection; 