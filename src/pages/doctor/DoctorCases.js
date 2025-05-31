import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CaseService } from '../../services/CaseService';
import { Case, CaseMetadata } from '../../models/Case';
import { toast } from 'react-hot-toast';
import { Box, Container, Typography, Grid, Card, CardContent, CardActions, Button, Chip, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip, } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon, } from '@mui/icons-material';
const caseService = new CaseService();
export const DoctorCasesPage = () => {
    const { currentUser } = useAuth();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    useEffect(() => {
        loadCases();
    }, [currentUser?.id]);
    const loadCases = async () => {
        if (!currentUser?.id)
            return;
        try {
            setLoading(true);
            const doctorCases = await caseService.getDoctorCases(currentUser.id);
            setCases(doctorCases);
        }
        catch (error) {
            toast.error('Failed to load cases');
            console.error('Error loading cases:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteCase = async (caseId) => {
        if (!confirm('Are you sure you want to delete this case?'))
            return;
        try {
            await caseService.deleteCase(caseId);
            setCases(cases.filter(c => c.id !== caseId));
            toast.success('Case deleted successfully');
        }
        catch (error) {
            toast.error('Failed to delete case');
            console.error('Error deleting case:', error);
        }
    };
    const handleToggleVisibility = async (caseId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'published' ? 'draft' : 'published';
            await caseService.updateCase(caseId, { status: newStatus });
            setCases(cases.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
            toast.success(`Case ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
        }
        catch (error) {
            toast.error('Failed to update case visibility');
            console.error('Error updating case visibility:', error);
        }
    };
    const filteredCases = cases
        .filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    })
        .sort((a, b) => {
        switch (sortBy) {
            case 'recent':
                return b.createdAt.getTime() - a.createdAt.getTime();
            case 'views':
                return b.viewCount - a.viewCount;
            case 'likes':
                return b.likeCount - a.likeCount;
            default:
                return 0;
        }
    });
    return (_jsxs(Container, { maxWidth: "lg", sx: { py: 4 }, children: [_jsx(Typography, { variant: "h4", component: "h1", gutterBottom: true, children: "My Cases" }), _jsxs(Box, { sx: { mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }, children: [_jsx(TextField, { label: "Search cases", variant: "outlined", size: "small", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), sx: { minWidth: 200 } }), _jsxs(FormControl, { size: "small", sx: { minWidth: 150 }, children: [_jsx(InputLabel, { children: "Status" }), _jsxs(Select, { value: statusFilter, label: "Status", onChange: (e) => setStatusFilter(e.target.value), children: [_jsx(MenuItem, { value: "all", children: "All" }), _jsx(MenuItem, { value: "draft", children: "Draft" }), _jsx(MenuItem, { value: "published", children: "Published" }), _jsx(MenuItem, { value: "archived", children: "Archived" })] })] }), _jsxs(FormControl, { size: "small", sx: { minWidth: 150 }, children: [_jsx(InputLabel, { children: "Sort by" }), _jsxs(Select, { value: sortBy, label: "Sort by", onChange: (e) => setSortBy(e.target.value), children: [_jsx(MenuItem, { value: "recent", children: "Most Recent" }), _jsx(MenuItem, { value: "views", children: "Most Views" }), _jsx(MenuItem, { value: "likes", children: "Most Likes" })] })] })] }), _jsx(Grid, { container: true, spacing: 3, children: filteredCases.map((case_) => (_jsx(Grid, { item: true, xs: 12, md: 6, lg: 4, children: _jsxs(Card, { children: [_jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: case_.title }), _jsx(Typography, { variant: "body2", color: "text.secondary", paragraph: true, children: case_.description }), _jsxs(Box, { sx: { display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }, children: [_jsx(Chip, { label: case_.status, color: case_.status === 'published' ? 'success' : 'default', size: "small" }), _jsx(Chip, { label: case_.difficulty, color: "primary", size: "small" }), case_.category && (_jsx(Chip, { label: case_.category, variant: "outlined", size: "small" }))] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Views: ", case_.viewCount, " \u2022 Likes: ", case_.likeCount, " \u2022 Comments: ", case_.commentCount] })] }), _jsxs(CardActions, { children: [_jsx(Button, { size: "small", startIcon: _jsx(EditIcon, {}), href: `/doctor/cases/edit/${case_.id}`, children: "Edit" }), _jsx(Tooltip, { title: case_.status === 'published' ? 'Unpublish' : 'Publish', children: _jsx(IconButton, { size: "small", onClick: () => handleToggleVisibility(case_.id, case_.status), children: case_.status === 'published' ? _jsx(VisibilityOffIcon, {}) : _jsx(VisibilityIcon, {}) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { size: "small", color: "error", onClick: () => handleDeleteCase(case_.id), children: _jsx(DeleteIcon, {}) }) })] })] }) }, case_.id))) }), filteredCases.length === 0 && !loading && (_jsx(Box, { sx: { textAlign: 'center', py: 4 }, children: _jsx(Typography, { variant: "h6", color: "text.secondary", children: "No cases found" }) }))] }));
};
