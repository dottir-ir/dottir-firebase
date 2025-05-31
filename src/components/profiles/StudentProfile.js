import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { User } from '../../models/User';
import { UserProfile } from './UserProfile';
import { Card, CardContent, Typography, Grid, Box, LinearProgress, List, ListItem, ListItemText, Chip, } from '@mui/material';
import { Link } from 'react-router-dom';
export const StudentProfile = ({ user, savedCases, learningMetrics, }) => {
    return (_jsxs(Box, { children: [_jsx(UserProfile, { user: user }), _jsx(Card, { sx: { maxWidth: 800, mx: 'auto', my: 2 }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h5", gutterBottom: true, children: "Learning Progress" }), _jsxs(Grid, { container: true, spacing: 3, sx: { mb: 4 }, children: [_jsxs(Grid, { item: true, xs: 12, sm: 6, md: 3, children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", children: "Cases Completed" }), _jsx(Typography, { variant: "h4", children: learningMetrics.casesCompleted })] }), _jsxs(Grid, { item: true, xs: 12, sm: 6, md: 3, children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", children: "Average Score" }), _jsxs(Typography, { variant: "h4", children: [learningMetrics.averageScore, "%"] })] }), _jsxs(Grid, { item: true, xs: 12, sm: 6, md: 3, children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", children: "Time Spent" }), _jsxs(Typography, { variant: "h4", children: [Math.round(learningMetrics.timeSpent / 60), "h"] })] }), _jsxs(Grid, { item: true, xs: 12, sm: 6, md: 3, children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", children: "Last Active" }), _jsx(Typography, { variant: "h4", children: learningMetrics.lastActive.toLocaleDateString() })] })] }), _jsx(Typography, { variant: "h5", gutterBottom: true, children: "Saved Cases" }), _jsx(List, { children: savedCases.map((case_) => (_jsx(ListItem, { component: Link, to: `/cases/${case_.id}`, sx: {
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }, children: _jsx(ListItemText, { primary: case_.title, secondary: _jsxs(Box, { sx: { mt: 1 }, children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: ["Saved on ", case_.savedAt.toLocaleDateString()] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(LinearProgress, { variant: "determinate", value: case_.progress, sx: { flexGrow: 1 } }), _jsx(Chip, { label: `${case_.progress}%`, size: "small", color: case_.progress === 100 ? 'success' : 'primary' })] })] }) }) }, case_.id))) })] }) })] }));
};
