import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { User, UserProfile } from '../../models/User';
import { Card, CardContent, TextField, Button, Grid, Typography, Box, Avatar, Autocomplete, Chip, } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/UserService';
const commonAreasOfInterest = [
    'Radiology',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Emergency Medicine',
    'Internal Medicine',
    'Surgery',
    'Oncology',
    'Orthopedics',
    'Dermatology',
];
export const EditProfile = ({ user, onProfileUpdated }) => {
    const [formData, setFormData] = useState({
        displayName: user.displayName,
        title: user.title,
        bio: user.bio,
        specialization: user.specialization,
        institution: user.institution,
        medicalSchool: user.medicalSchool,
        yearOfStudy: user.yearOfStudy,
        areasOfInterest: user.areasOfInterest || [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const updatedUser = await userService.updateUserProfile(user.id, formData);
            onProfileUpdated(updatedUser);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Card, { sx: { maxWidth: 800, mx: 'auto', my: 2 }, children: _jsx(CardContent, { children: _jsx("form", { onSubmit: handleSubmit, children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, sx: { display: 'flex', justifyContent: 'center' }, children: _jsx(Avatar, { src: user.photoURL, alt: user.displayName, sx: { width: 150, height: 150 } }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Display Name", name: "displayName", value: formData.displayName, onChange: handleChange, margin: "normal", required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Title", name: "title", value: formData.title, onChange: handleChange, margin: "normal", required: true, placeholder: user.role === 'student' ? 'e.g., Medical Student' : 'e.g., Radiologist' }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Bio", name: "bio", value: formData.bio, onChange: handleChange, multiline: true, rows: 4, margin: "normal" }) }), user.role === 'doctor' && (_jsxs(_Fragment, { children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Specialization", name: "specialization", value: formData.specialization, onChange: handleChange, margin: "normal" }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Institution", name: "institution", value: formData.institution, onChange: handleChange, margin: "normal" }) })] })), user.role === 'student' && (_jsxs(_Fragment, { children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Medical School", name: "medicalSchool", value: formData.medicalSchool, onChange: handleChange, margin: "normal", required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Year of Study", name: "yearOfStudy", type: "number", value: formData.yearOfStudy, onChange: handleChange, margin: "normal", required: true, inputProps: { min: 1, max: 6 } }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Autocomplete, { multiple: true, options: commonAreasOfInterest, value: formData.areasOfInterest || [], onChange: (_, newValue) => {
                                            setFormData(prev => ({ ...prev, areasOfInterest: newValue }));
                                        }, renderInput: (params) => (_jsx(TextField, { ...params, label: "Areas of Interest", placeholder: "Select areas of interest", margin: "normal" })), renderTags: (value, getTagProps) => value.map((option, index) => (_jsx(Chip, { label: option, ...getTagProps({ index }) }))) }) })] })), error && (_jsx(Grid, { item: true, xs: 12, children: _jsx(Typography, { color: "error", children: error }) })), _jsx(Grid, { item: true, xs: 12, children: _jsx(Box, { sx: { display: 'flex', justifyContent: 'flex-end', gap: 2 }, children: _jsx(Button, { type: "submit", variant: "contained", color: "primary", disabled: loading, children: loading ? 'Saving...' : 'Save Changes' }) }) })] }) }) }) }));
};
