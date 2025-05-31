import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../../services/AuthService';
import { verificationService } from '../../services/VerificationService';
import { TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography, Button, Grid, Chip, Autocomplete, Alert, } from '@mui/material';
export function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [role, setRole] = useState('student');
    const [title, setTitle] = useState('');
    const [medicalSchool, setMedicalSchool] = useState('');
    const [yearOfStudy, setYearOfStudy] = useState('');
    const [areasOfInterest, setAreasOfInterest] = useState([]);
    const [verificationDocuments, setVerificationDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { register, error: authError, clearError } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        try {
            setLoading(true);
            clearError();
            const normalizedYearOfStudy = yearOfStudy === '' ? undefined : Number(yearOfStudy);
            const userCredential = await register(email, password, role, {
                displayName,
                title,
                medicalSchool: role === 'student' ? medicalSchool : undefined,
                yearOfStudy: role === 'student' ? normalizedYearOfStudy : undefined,
                areasOfInterest: role === 'student' ? areasOfInterest : undefined,
                verificationDocuments: verificationDocuments.map(file => file.name),
            });
            // If user is a doctor and has uploaded documents, create a verification request
            if (role === 'doctor' && verificationDocuments.length > 0) {
                await verificationService.submitVerificationRequest(userCredential.user.uid, verificationDocuments.map(file => file.name));
            }
            navigate('/dashboard');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to register');
        }
        finally {
            setLoading(false);
        }
    };
    const handleFileChange = (e) => {
        if (e.target.files) {
            setVerificationDocuments(Array.from(e.target.files));
        }
    };
    const commonAreasOfInterest = [
        'Radiology',
        'Cardiology',
        'Neurology',
        'Pediatrics',
        'Emergency Medicine',
        'Internal Medicine',
        'Surgery',
        'Obstetrics & Gynecology',
        'Psychiatry',
        'Dermatology',
    ];
    return (_jsxs(Box, { component: "form", onSubmit: handleSubmit, sx: { maxWidth: 600, mx: 'auto', p: 3 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "Create an Account" }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Display Name", value: displayName, onChange: (e) => setDisplayName(e.target.value), required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Confirm Password", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Role" }), _jsxs(Select, { value: role, label: "Role", onChange: (e) => setRole(e.target.value), required: true, children: [_jsx(MenuItem, { value: "student", children: "Medical Student" }), _jsx(MenuItem, { value: "doctor", children: "Doctor" })] })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Title", value: title, onChange: (e) => setTitle(e.target.value), required: true, placeholder: role === 'student' ? 'e.g., Medical Student' : 'e.g., Radiologist' }) }), role === 'student' && (_jsxs(_Fragment, { children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Medical School", value: medicalSchool, onChange: (e) => setMedicalSchool(e.target.value), required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Year of Study", type: "number", value: yearOfStudy, onChange: (e) => setYearOfStudy(e.target.value ? Number(e.target.value) : ''), required: true, inputProps: { min: 1, max: 6 } }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Autocomplete, { multiple: true, options: commonAreasOfInterest, value: areasOfInterest, onChange: (_, newValue) => setAreasOfInterest(newValue), renderInput: (params) => (_jsx(TextField, { ...params, label: "Areas of Interest", placeholder: "Select areas of interest" })), renderTags: (value, getTagProps) => value.map((option, index) => (_jsx(Chip, { label: option, ...getTagProps({ index }) }))) }) })] })), role === 'doctor' && (_jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Upload Verification Documents" }), _jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: "Please upload your medical license, board certification, or other relevant credentials. Your account will be reviewed by our team before you can access all features." }), _jsx("input", { type: "file", multiple: true, onChange: handleFileChange, accept: ".pdf,.jpg,.jpeg,.png", style: { display: 'none' }, id: "verification-documents" }), _jsx("label", { htmlFor: "verification-documents", children: _jsx(Button, { variant: "outlined", component: "span", fullWidth: true, sx: { mt: 1 }, children: "Choose Files" }) }), verificationDocuments.length > 0 && (_jsxs(Box, { sx: { mt: 2 }, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Selected Files:" }), verificationDocuments.map((file, index) => (_jsx(Chip, { label: file.name, onDelete: () => {
                                            setVerificationDocuments(docs => docs.filter((_, i) => i !== index));
                                        }, sx: { mr: 1, mb: 1 } }, index)))] }))] })), _jsx(Grid, { item: true, xs: 12, children: _jsx(Button, { type: "submit", variant: "contained", fullWidth: true, disabled: loading, sx: { mt: 2 }, children: loading ? 'Creating Account...' : 'Create Account' }) })] })] }));
}
