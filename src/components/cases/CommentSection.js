import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '../ui/DropdownMenu';
export const CommentSection = ({ caseId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');
    const { currentUser } = useAuth();
    useEffect(() => {
        const q = query(collection(db, `cases/${caseId}/comments`), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComments(commentsData);
        });
        return () => unsubscribe();
    }, [caseId]);
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!currentUser || !newComment.trim())
            return;
        try {
            await addDoc(collection(db, `cases/${caseId}/comments`), {
                content: newComment.trim(),
                authorId: currentUser.uid,
                authorName: currentUser.displayName || 'Anonymous',
                authorImage: currentUser.photoURL,
                createdAt: Timestamp.now(),
            });
            setNewComment('');
        }
        catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    const handleEditComment = async (commentId) => {
        if (!editContent.trim())
            return;
        try {
            await updateDoc(doc(db, `cases/${caseId}/comments/${commentId}`), {
                content: editContent.trim(),
                updatedAt: Timestamp.now(),
            });
            setEditingComment(null);
            setEditContent('');
        }
        catch (error) {
            console.error('Error updating comment:', error);
        }
    };
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteDoc(doc(db, `cases/${caseId}/comments/${commentId}`));
        }
        catch (error) {
            console.error('Error deleting comment:', error);
        }
    };
    const startEditing = (comment) => {
        setEditingComment(comment.id);
        setEditContent(comment.content);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "Comments" }), currentUser && (_jsxs("form", { onSubmit: handleAddComment, className: "space-y-4", children: [_jsx(Textarea, { value: newComment, onChange: (e) => setNewComment(e.target.value), placeholder: "Add a comment...", className: "min-h-[100px]" }), _jsx(Button, { type: "submit", disabled: !newComment.trim(), children: "Post Comment" })] })), _jsx("div", { className: "space-y-4", children: comments.map((comment) => (_jsx("div", { className: "bg-gray-50 rounded-lg p-4", children: editingComment === comment.id ? (_jsxs("div", { className: "space-y-4", children: [_jsx(Textarea, { value: editContent, onChange: (e) => setEditContent(e.target.value), className: "min-h-[100px]" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => handleEditComment(comment.id), disabled: !editContent.trim(), children: "Save" }), _jsx(Button, { variant: "ghost", onClick: () => {
                                            setEditingComment(null);
                                            setEditContent('');
                                        }, children: "Cancel" })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Avatar, { children: comment.authorImage ? (_jsx(AvatarImage, { src: comment.authorImage, alt: comment.authorName })) : (_jsx(AvatarFallback, { children: comment.authorName.charAt(0).toUpperCase() })) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: comment.authorName }), _jsxs("p", { className: "text-sm text-gray-500", children: [new Date(comment.createdAt.toDate()).toLocaleString(), comment.updatedAt && ' (edited)'] })] })] }), currentUser?.uid === comment.authorId && (_jsx(DropdownMenu, { children: (context) => (_jsxs(_Fragment, { children: [_jsx(DropdownMenuTrigger, { asChild: true, setOpen: context.setOpen, children: _jsx(Button, { variant: "ghost", size: "icon", children: _jsx(MoreVertical, { className: "h-4 w-4" }) }) }), _jsxs(DropdownMenuContent, { align: "end", open: context.open, children: [_jsxs(DropdownMenuItem, { onClick: () => startEditing(comment), children: [_jsx(Pencil, { className: "h-4 w-4 mr-2" }), "Edit"] }), _jsxs(DropdownMenuItem, { onClick: () => handleDeleteComment(comment.id), className: "text-red-600", children: [_jsx(Trash2, { className: "h-4 w-4 mr-2" }), "Delete"] })] })] })) }))] }), _jsx("p", { className: "mt-2 text-gray-700 whitespace-pre-wrap", children: comment.content })] })) }, comment.id))) })] }));
};
