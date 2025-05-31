import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Link } from 'react-router-dom';
import { CaseMetadata } from '../../models/Case';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Eye } from 'lucide-react';
import { LikeButton } from '../interactions/LikeButton';
import { SaveButton } from '../interactions/SaveButton';
import { Button } from '../ui/Button';
export const CasePreview = ({ case: caseData, onComment, }) => {
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow", children: [_jsx(Link, { to: `/cases/${caseData.id}`, className: "block", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: caseData.title }), _jsx("p", { className: "text-gray-600 mb-4 line-clamp-2", children: caseData.description }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: caseData.tags.map((tag) => (_jsx("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full", children: tag }, tag))) }), _jsxs("div", { className: "flex items-center text-sm text-gray-500 mb-4", children: [_jsx("span", { className: "mr-4", children: formatDistanceToNow(caseData.publishedAt || caseData.createdAt, { addSuffix: true }) }), _jsxs("span", { className: "flex items-center", children: [_jsx(Eye, { className: "w-4 h-4 mr-1" }), caseData.viewCount] })] })] }), caseData.thumbnailUrl && (_jsx("div", { className: "ml-4 flex-shrink-0", children: _jsx("img", { src: caseData.thumbnailUrl, alt: caseData.title, className: "w-24 h-24 object-cover rounded-lg" }) }))] }) }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(LikeButton, { caseId: caseData.id, initialLikeCount: caseData.likeCount }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: onComment, className: "flex items-center text-gray-600 hover:text-blue-500 transition-colors", children: [_jsx(MessageCircle, { className: "w-5 h-5 mr-1" }), _jsx("span", { children: caseData.commentCount })] })] }), _jsx(SaveButton, { caseId: caseData.id, initialSaveCount: caseData.saveCount })] })] }));
};
