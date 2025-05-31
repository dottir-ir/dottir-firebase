import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import CaseUploadForm from '../components/case-upload/CaseUploadForm';
import { useAuth } from '../contexts/AuthContext';
export default function CaseUploadPage() {
    const { currentUser } = useAuth();
    if (!currentUser || currentUser.role !== 'doctor')
        return null;
    if (currentUser.doctorVerificationStatus !== 'verified') {
        return (_jsx(Container, { maxWidth: "lg", children: _jsx(Box, { sx: { py: 4 }, children: _jsx(Alert, { severity: "warning", sx: { mb: 2 }, children: "Your account must be verified before you can upload cases. Please wait for admin approval." }) }) }));
    }
    return (_jsx(Container, { maxWidth: "lg", children: _jsxs(Box, { sx: { py: 4 }, children: [_jsx(Typography, { variant: "h4", component: "h1", gutterBottom: true, children: "Upload New Case" }), _jsx(Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: "Fill out the form below to upload a new medical case. You can save your progress as a draft and come back later to complete it." }), _jsx(CaseUploadForm, {})] }) }));
}
