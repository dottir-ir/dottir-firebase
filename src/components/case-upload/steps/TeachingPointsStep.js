import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Typography, TextField, Grid, Chip, Stack, IconButton, } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { CaseUpload } from '../../../types/case';
export default function TeachingPointsStep() {
    const { register, formState: { errors }, setValue, watch } = useFormContext();
    const [newKeyPoint, setNewKeyPoint] = React.useState('');
    const [newReference, setNewReference] = React.useState('');
    const [newRelatedCase, setNewRelatedCase] = React.useState('');
    const keyPoints = watch('teachingPoints.keyPoints') || [];
    const references = watch('teachingPoints.references') || [];
    const relatedCases = watch('teachingPoints.relatedCases') || [];
    const handleAddKeyPoint = () => {
        if (newKeyPoint.trim()) {
            setValue('teachingPoints.keyPoints', [...keyPoints, newKeyPoint.trim()]);
            setNewKeyPoint('');
        }
    };
    const handleAddReference = () => {
        if (newReference.trim()) {
            setValue('teachingPoints.references', [...references, newReference.trim()]);
            setNewReference('');
        }
    };
    const handleAddRelatedCase = () => {
        if (newRelatedCase.trim()) {
            setValue('teachingPoints.relatedCases', [...relatedCases, newRelatedCase.trim()]);
            setNewRelatedCase('');
        }
    };
    const handleRemoveKeyPoint = (index) => {
        setValue('teachingPoints.keyPoints', keyPoints.filter((_, i) => i !== index));
    };
    const handleRemoveReference = (index) => {
        setValue('teachingPoints.references', references.filter((_, i) => i !== index));
    };
    const handleRemoveRelatedCase = (index) => {
        setValue('teachingPoints.relatedCases', relatedCases.filter((_, i) => i !== index));
    };
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Teaching Points" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { gutterBottom: true, children: "Key Teaching Points" }), _jsx(Box, { sx: { mb: 2 }, children: _jsx(TextField, { fullWidth: true, label: "Add Key Teaching Point", value: newKeyPoint, onChange: (e) => setNewKeyPoint(e.target.value), onKeyPress: (e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddKeyPoint();
                                        }
                                    }, InputProps: {
                                        endAdornment: (_jsx(IconButton, { onClick: handleAddKeyPoint, color: "primary", children: _jsx(AddIcon, {}) })),
                                    } }) }), _jsx(Stack, { direction: "row", spacing: 1, flexWrap: "wrap", useFlexGap: true, children: keyPoints.map((point, index) => (_jsx(Chip, { label: point, onDelete: () => handleRemoveKeyPoint(index), sx: { mb: 1 } }, index))) })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { gutterBottom: true, children: "References" }), _jsx(Box, { sx: { mb: 2 }, children: _jsx(TextField, { fullWidth: true, label: "Add Reference", value: newReference, onChange: (e) => setNewReference(e.target.value), onKeyPress: (e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddReference();
                                        }
                                    }, InputProps: {
                                        endAdornment: (_jsx(IconButton, { onClick: handleAddReference, color: "primary", children: _jsx(AddIcon, {}) })),
                                    } }) }), _jsx(Stack, { direction: "row", spacing: 1, flexWrap: "wrap", useFlexGap: true, children: references.map((reference, index) => (_jsx(Chip, { label: reference, onDelete: () => handleRemoveReference(index), sx: { mb: 1 } }, index))) })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { gutterBottom: true, children: "Related Cases" }), _jsx(Box, { sx: { mb: 2 }, children: _jsx(TextField, { fullWidth: true, label: "Add Related Case", value: newRelatedCase, onChange: (e) => setNewRelatedCase(e.target.value), onKeyPress: (e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddRelatedCase();
                                        }
                                    }, InputProps: {
                                        endAdornment: (_jsx(IconButton, { onClick: handleAddRelatedCase, color: "primary", children: _jsx(AddIcon, {}) })),
                                    } }) }), _jsx(Stack, { direction: "row", spacing: 1, flexWrap: "wrap", useFlexGap: true, children: relatedCases.map((relatedCase, index) => (_jsx(Chip, { label: relatedCase, onDelete: () => handleRemoveRelatedCase(index), sx: { mb: 1 } }, index))) })] })] })] }));
}
