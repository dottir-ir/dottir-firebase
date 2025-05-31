import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { CaseService } from '../../services/CaseService';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Trash2 } from 'lucide-react';
import { Comment } from '../../models/Comment';
export const CommentSection = ({ caseId, initialCommentCount, onCommentChange, }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { currentUser } = useAuth();
    const caseService = new CaseService();
    useEffect(() => {
        loadComments();
    }, [caseId]);
    const loadComments = async () => {
        setIsLoading(true);
        try {
            const loadedComments = await caseService.getComments(caseId);
            setComments(loadedComments);
        }
        catch (error) {
            console.error('Error loading comments:', error);
            toast.error('Failed to load comments');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSubmitComment = async (e) => {
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
        }
        catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDeleteComment = async (commentId) => {
        if (!currentUser)
            return;
        try {
            await caseService.deleteComment(commentId, caseId);
            setComments(prev => prev.filter(c => c.id !== commentId));
            onCommentChange?.(comments.length - 1);
            toast.success('Comment deleted successfully');
        }
        catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["Comments (", comments.length, ")"] }), isLoading ? (_jsx("div", { className: "flex justify-center py-4", children: _jsx(Loader2, { className: "w-6 h-6 text-blue-600 animate-spin" }) })) : comments.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-4", children: "No comments yet. Be the first to comment!" })) : (_jsx("div", { className: "space-y-4", children: comments.map((comment) => (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: comment.userId }), _jsx("p", { className: "text-sm text-gray-500", children: formatDistanceToNow(comment.createdAt, { addSuffix: true }) })] }), currentUser?.uid === comment.userId && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteComment(comment.id), className: "text-red-500 hover:text-red-600", children: _jsx(Trash2, { className: "w-4 h-4" }) }))] }), _jsx("p", { className: "text-gray-700", children: comment.text })] }, comment.id))) }))] }), currentUser && (_jsxs("form", { onSubmit: handleSubmitComment, className: "space-y-4", children: [_jsx(Textarea, { value: newComment, onChange: (e) => setNewComment(e.target.value), placeholder: "Write a comment...", className: "min-h-[100px]", disabled: isSubmitting }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { type: "submit", disabled: isSubmitting || !newComment.trim(), children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Posting..."] })) : ('Post Comment') }) })] }))] }));
};
