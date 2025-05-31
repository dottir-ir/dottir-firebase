import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CaseService } from '../../services/CaseService';
import { Case } from '../../models/Case';
import { toast } from 'react-hot-toast';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Paper, Typography, Chip, Autocomplete, } from '@mui/material';
const caseService = new CaseService();
export const CaseEditForm = ({ onSave }) => {
    const { caseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [caseData, setCaseData] = useState({
        title: '',
        description: '',
        content: '',
        status: 'draft',
        tags: [],
        category: '',
        difficulty: 'beginner',
        patientAge: 0,
        patientGender: 'male',
        clinicalPresentation: '',
        imagingFindings: '',
        diagnosis: '',
        treatment: '',
        outcome: '',
        references: [],
        teachingPoints: {
            keyPoints: [],
            references: [],
            relatedCases: []
        }
    });
    useEffect(() => {
        loadCase();
    }, [caseId]);
    const loadCase = async () => {
        if (!caseId)
            return;
        try {
            setLoading(true);
            const case_ = await caseService.getCaseById(caseId);
            setCaseData(case_);
        }
        catch (error) {
            toast.error('Failed to load case');
            console.error('Error loading case:', error);
            navigate('/doctor/cases');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caseId)
            return;
        try {
            setSaving(true);
            await caseService.updateCase(caseId, caseData);
            toast.success('Case updated successfully');
            onSave?.();
            navigate('/doctor/cases');
        }
        catch (error) {
            toast.error('Failed to update case');
            console.error('Error updating case:', error);
        }
        finally {
            setSaving(false);
        }
    };
    const handleChange = (field) => (e) => {
        setCaseData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };
    if (loading) {
        return (_jsx(Box, { sx: { p: 3, textAlign: 'center' }, children: _jsx(Typography, { children: "Loading case..." }) }));
    }
    return (_jsx(Paper, { sx: { p: 3 }, children: _jsx("form", { onSubmit: handleSubmit, children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Title", value: caseData.title, onChange: handleChange('title'), required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Description", value: caseData.description, onChange: handleChange('description'), multiline: true, rows: 3, required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Content", value: caseData.content, onChange: handleChange('content'), multiline: true, rows: 10, required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Category" }), _jsxs(Select, { value: caseData.category, label: "Category", onChange: handleChange('category'), required: true, children: [_jsx(MenuItem, { value: "cardiology", children: "Cardiology" }), _jsx(MenuItem, { value: "neurology", children: "Neurology" }), _jsx(MenuItem, { value: "orthopedics", children: "Orthopedics" }), _jsx(MenuItem, { value: "pediatrics", children: "Pediatrics" }), _jsx(MenuItem, { value: "radiology", children: "Radiology" })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Difficulty" }), _jsxs(Select, { value: caseData.difficulty, label: "Difficulty", onChange: handleChange('difficulty'), required: true, children: [_jsx(MenuItem, { value: "beginner", children: "Beginner" }), _jsx(MenuItem, { value: "intermediate", children: "Intermediate" }), _jsx(MenuItem, { value: "advanced", children: "Advanced" })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, type: "number", label: "Patient Age", value: caseData.patientAge, onChange: handleChange('patientAge'), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Patient Gender" }), _jsxs(Select, { value: caseData.patientGender, label: "Patient Gender", onChange: handleChange('patientGender'), required: true, children: [_jsx(MenuItem, { value: "male", children: "Male" }), _jsx(MenuItem, { value: "female", children: "Female" }), _jsx(MenuItem, { value: "other", children: "Other" })] })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Clinical Presentation", value: caseData.clinicalPresentation, onChange: handleChange('clinicalPresentation'), multiline: true, rows: 4, required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Imaging Findings", value: caseData.imagingFindings, onChange: handleChange('imagingFindings'), multiline: true, rows: 4, required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Diagnosis", value: caseData.diagnosis, onChange: handleChange('diagnosis'), multiline: true, rows: 4, required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Treatment", value: caseData.treatment, onChange: handleChange('treatment'), multiline: true, rows: 4, required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Outcome", value: caseData.outcome, onChange: handleChange('outcome'), multiline: true, rows: 4, required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Autocomplete, { multiple: true, freeSolo: true, options: [], value: caseData.tags || [], onChange: (_, newValue) => {
                                setCaseData(prev => ({
                                    ...prev,
                                    tags: newValue
                                }));
                            }, renderTags: (value, getTagProps) => value.map((option, index) => (_jsx(Chip, { label: option, ...getTagProps({ index }) }))), renderInput: (params) => (_jsx(TextField, { ...params, label: "Tags", placeholder: "Add tags" })) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Key Teaching Points", value: caseData.teachingPoints?.keyPoints?.join('\n') || '', onChange: (e) => {
                                const points = e.target.value.split('\n').filter(Boolean);
                                setCaseData(prev => ({
                                    ...prev,
                                    teachingPoints: {
                                        ...prev.teachingPoints,
                                        keyPoints: points,
                                        references: prev.teachingPoints?.references ?? [],
                                        relatedCases: prev.teachingPoints?.relatedCases ?? []
                                    }
                                }));
                            }, multiline: true, rows: 4, required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "References", value: caseData.teachingPoints?.references?.join('\n') || '', onChange: (e) => {
                                const refs = e.target.value.split('\n').filter(Boolean);
                                setCaseData(prev => ({
                                    ...prev,
                                    teachingPoints: {
                                        ...prev.teachingPoints,
                                        references: refs,
                                        keyPoints: prev.teachingPoints?.keyPoints ?? [],
                                        relatedCases: prev.teachingPoints?.relatedCases ?? []
                                    }
                                }));
                            }, multiline: true, rows: 4 }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Related Cases", value: caseData.teachingPoints?.relatedCases?.join('\n') || '', onChange: (e) => {
                                const cases = e.target.value.split('\n').filter(Boolean);
                                setCaseData(prev => ({
                                    ...prev,
                                    teachingPoints: {
                                        ...prev.teachingPoints,
                                        relatedCases: cases,
                                        keyPoints: prev.teachingPoints?.keyPoints ?? [],
                                        references: prev.teachingPoints?.references ?? []
                                    }
                                }));
                            }, multiline: true, rows: 4 }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Box, { sx: { display: 'flex', gap: 2, justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "outlined", onClick: () => navigate('/doctor/cases'), children: "Cancel" }), _jsx(Button, { type: "submit", variant: "contained", disabled: saving, children: saving ? 'Saving...' : 'Save Changes' })] }) })] }) }) }));
};
