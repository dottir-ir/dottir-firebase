import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Case } from '../../types/case';
import { ImageViewer } from './ImageViewer';
import { CommentSection } from './CommentSection';
import { Button } from '../ui/Button';
import { Heart, Bookmark } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
export const CaseDetail = () => {
    const { id } = useParams();
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { currentUser } = useAuth();
    useEffect(() => {
        const fetchCase = async () => {
            if (!id)
                return;
            try {
                const caseDoc = await getDoc(doc(db, 'cases', id));
                if (caseDoc.exists()) {
                    setCaseData(caseDoc.data());
                }
                else {
                    setError('Case not found');
                }
            }
            catch (err) {
                setError('Error loading case');
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchCase();
    }, [id]);
    const handleLike = async () => {
        if (!currentUser?.uid || !caseData || !id)
            return;
        try {
            const caseRef = doc(db, 'cases', id);
            const isLiked = caseData.likes.includes(currentUser.uid);
            await updateDoc(caseRef, {
                likes: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
            });
            setCaseData((prev) => {
                if (!prev)
                    return null;
                const newLikes = isLiked
                    ? prev.likes.filter((uid) => uid !== currentUser.uid)
                    : [...prev.likes, currentUser.uid];
                return {
                    ...prev,
                    likes: newLikes,
                };
            });
        }
        catch (err) {
            console.error('Error updating like:', err);
        }
    };
    const handleSave = async () => {
        if (!currentUser?.uid || !caseData || !id)
            return;
        try {
            const caseRef = doc(db, 'cases', id);
            const isSaved = caseData.saves.includes(currentUser.uid);
            await updateDoc(caseRef, {
                saves: isSaved ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
            });
            setCaseData((prev) => {
                if (!prev)
                    return null;
                const newSaves = isSaved
                    ? prev.saves.filter((uid) => uid !== currentUser.uid)
                    : [...prev.saves, currentUser.uid];
                return {
                    ...prev,
                    saves: newSaves,
                };
            });
        }
        catch (err) {
            console.error('Error updating save:', err);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }));
    }
    if (error || !caseData) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "text-red-500", children: error || 'Case not found' }) }));
    }
    const isLiked = currentUser?.uid ? caseData.likes.includes(currentUser.uid) : false;
    const isSaved = currentUser?.uid ? caseData.saves.includes(currentUser.uid) : false;
    return (_jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx(ImageViewer, { images: caseData.images, currentIndex: currentImageIndex, onIndexChange: setCurrentImageIndex }), _jsx("div", { className: "flex gap-2 overflow-x-auto pb-2", children: caseData.images.map((image, index) => (_jsx("button", { onClick: () => setCurrentImageIndex(index), className: `w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${currentImageIndex === index ? 'ring-2 ring-primary' : ''}`, children: _jsx("img", { src: image.url, alt: image.alt || `Case image ${index + 1}`, className: "w-full h-full object-cover" }) }, index))) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h1", { className: "text-3xl font-bold", children: caseData.title }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: handleLike, className: isLiked ? 'text-red-500' : '', disabled: !currentUser, children: _jsx(Heart, { className: isLiked ? 'fill-current' : '' }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: handleSave, className: isSaved ? 'text-primary' : '', disabled: !currentUser, children: _jsx(Bookmark, { className: isSaved ? 'fill-current' : '' }) })] })] }), _jsx("div", { className: "prose max-w-none", children: _jsx("p", { className: "text-gray-600", children: caseData.description }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-700", children: "Status" }), _jsx("p", { className: "text-gray-600", children: caseData.status })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-700", children: "Category" }), _jsx("p", { className: "text-gray-600", children: caseData.category })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-700", children: "Created" }), _jsx("p", { className: "text-gray-600", children: new Date(caseData.createdAt).toLocaleDateString() })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-700", children: "Author" }), _jsx("p", { className: "text-gray-600", children: caseData.authorName })] })] }), id && _jsx(CommentSection, { caseId: id })] })] }) }));
};
