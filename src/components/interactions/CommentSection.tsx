import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Loader2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { CaseService } from '@/services/CaseService';
import { useAuth } from '@/hooks/useAuth';
import type { Comment } from '@/types/comment';

interface CommentSectionProps {
  caseId: string;
  initialCommentCount: number;
  onCommentChange?: (newCommentCount: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  caseId,
  initialCommentCount,
  onCommentChange,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: currentUser } = useAuth();
  const caseService = new CaseService();

  useEffect(() => {
    loadComments();
  }, [caseId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const loadedComments = await caseService.getComments(caseId);
      setComments(loadedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.uid) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      await caseService.addComment(caseId, currentUser.uid, newComment.trim());
      setNewComment('');
      await loadComments();
      onCommentChange?.(comments.length + 1);
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser) return;

    try {
      await caseService.deleteComment(commentId, caseId);
      setComments((prev: Comment[]) => prev.filter((c: Comment) => c.id !== commentId));
      onCommentChange?.(comments.length - 1);
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment: Comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{comment.authorId}</p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  {currentUser?.uid === comment.authorId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {currentUser && (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[100px]"
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Comment'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}; 