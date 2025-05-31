import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { User } from '../../models/User';
import { UserProfile } from './UserProfile';
import { Card, CardContent, Typography, Grid, Button, Box, IconButton, Alert, Chip, Tooltip, Paper, Divider, } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
export const DoctorProfile = ({ user, publishedCases, onEditCase, onDeleteCase, }) => {
    // Determine status
    const status = user.doctorVerificationStatus || 'pending';
    let statusColor = 'info';
    let statusText = 'Pending Verification';
    let statusIcon = _jsx(VerifiedIcon, { color: "disabled", fontSize: "small" });
    if (status === 'verified') {
        statusColor = 'success';
        statusText = 'Verified';
        statusIcon = _jsx(VerifiedIcon, { color: "success", fontSize: "small" });
    }
    else if (status === 'rejected') {
        statusColor = 'error';
        statusText = 'Verification Rejected';
        statusIcon = _jsx(ErrorOutlineIcon, { color: "error", fontSize: "small" });
    }
    const totalViews = publishedCases.reduce((sum, case_) => sum + case_.viewCount, 0);
    const totalLikes = publishedCases.reduce((sum, case_) => sum + case_.likeCount, 0);
    const totalComments = publishedCases.reduce((sum, case_) => sum + case_.commentCount, 0);
    return (_jsxs(Box, { children: [_jsxs(Alert, { severity: statusColor, sx: { mb: 2 }, children: [statusText, status === 'rejected' && user.rejectionReason && (_jsxs(_Fragment, { children: [_jsx("br", {}), _jsx("strong", { children: "Reason:" }), " ", user.rejectionReason] }))] }), _jsx(UserProfile, { user: user }), _jsxs(Paper, { sx: { mt: 4, p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h5", children: "Case Management" }), _jsx(Button, { component: Link, to: "/doctor/cases/new", variant: "contained", color: "primary", children: "Create New Case" })] }), _jsxs(Grid, { container: true, spacing: 3, sx: { mb: 4 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", color: "text.secondary", gutterBottom: true, children: "Total Views" }), _jsx(Typography, { variant: "h4", children: totalViews.toLocaleString() })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", color: "text.secondary", gutterBottom: true, children: "Total Likes" }), _jsx(Typography, { variant: "h4", children: totalLikes.toLocaleString() })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", color: "text.secondary", gutterBottom: true, children: "Total Comments" }), _jsx(Typography, { variant: "h4", children: totalComments.toLocaleString() })] }) }) })] }), _jsx(Divider, { sx: { my: 3 } }), _jsx(Typography, { variant: "h6", gutterBottom: true, children: "Published Cases" }), _jsx(Grid, { container: true, spacing: 3, children: publishedCases.map((case_) => (_jsx(Grid, { item: true, xs: 12, md: 6, lg: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: case_.title }), _jsxs(Box, { sx: { display: 'flex', gap: 1, mb: 2 }, children: [_jsx(Chip, { label: case_.status, color: case_.status === 'published' ? 'success' : 'default', size: "small" }), _jsx(Chip, { label: `${case_.viewCount} views`, variant: "outlined", size: "small" })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs(Box, { sx: { display: 'flex', gap: 2 }, children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", children: [case_.likeCount, " likes"] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [case_.commentCount, " comments"] })] }), _jsxs(Box, { children: [_jsx(Tooltip, { title: "Edit", children: _jsx(IconButton, { size: "small", onClick: () => onEditCase(case_.id), children: _jsx(EditIcon, {}) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { size: "small", color: "error", onClick: () => onDeleteCase(case_.id), children: _jsx(DeleteIcon, {}) }) })] })] })] }) }) }, case_.id))) }), publishedCases.length === 0 && (_jsx(Box, { sx: { textAlign: 'center', py: 4 }, children: _jsx(Typography, { variant: "body1", color: "text.secondary", children: "No published cases yet. Create your first case to get started!" }) }))] })] }));
};
