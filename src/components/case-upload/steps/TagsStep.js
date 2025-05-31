import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Typography, TextField, Grid, Chip, Stack, FormControl, InputLabel, Select, MenuItem, IconButton, SelectChangeEvent, } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { CaseUpload } from '../../../types/case';
const SPECIALTIES = [
    'Radiology',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Oncology',
    'Emergency Medicine',
    'Internal Medicine',
];
const MODALITIES = [
    'X-Ray',
    'CT',
    'MRI',
    'Ultrasound',
    'Nuclear Medicine',
    'PET',
    'Angiography',
];
export default function TagsStep() {
    const { register, formState: { errors }, setValue, watch } = useFormContext();
    const [newCustomTag, setNewCustomTag] = React.useState('');
    const [difficulty, setDifficulty] = React.useState('intermediate');
    const tags = watch('tags') || [];
    const specialties = tags.filter(tag => SPECIALTIES.includes(tag));
    const modalities = tags.filter(tag => MODALITIES.includes(tag));
    const customTags = tags.filter(tag => !SPECIALTIES.includes(tag) && !MODALITIES.includes(tag));
    const handleAddSpecialty = (specialty) => {
        if (!tags.includes(specialty)) {
            setValue('tags', [...tags, specialty]);
        }
    };
    const handleAddModality = (modality) => {
        if (!tags.includes(modality)) {
            setValue('tags', [...tags, modality]);
        }
    };
    const handleAddCustomTag = () => {
        if (newCustomTag.trim() && !tags.includes(newCustomTag.trim())) {
            setValue('tags', [...tags, newCustomTag.trim()]);
            setNewCustomTag('');
        }
    };
    const handleRemoveSpecialty = (specialty) => {
        setValue('tags', tags.filter((t) => t !== specialty));
    };
    const handleRemoveModality = (modality) => {
        setValue('tags', tags.filter((t) => t !== modality));
    };
    const handleRemoveCustomTag = (tag) => {
        setValue('tags', tags.filter((t) => t !== tag));
    };
    const handleDifficultyChange = (event) => {
        const newDifficulty = event.target.value;
        setDifficulty(newDifficulty);
        setValue('difficulty', newDifficulty);
    };
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Tags" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { gutterBottom: true, children: "Specialties" }), _jsx(Stack, { direction: "row", spacing: 1, flexWrap: "wrap", useFlexGap: true, children: SPECIALTIES.map((specialty) => (_jsx(Chip, { label: specialty, onClick: () => handleAddSpecialty(specialty), color: specialties.includes(specialty) ? 'primary' : 'default', onDelete: specialties.includes(specialty) ? () => handleRemoveSpecialty(specialty) : undefined, sx: { mb: 1 } }, specialty))) })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { gutterBottom: true, children: "Imaging Modalities" }), _jsx(Stack, { direction: "row", spacing: 1, flexWrap: "wrap", useFlexGap: true, children: MODALITIES.map((modality) => (_jsx(Chip, { label: modality, onClick: () => handleAddModality(modality), color: modalities.includes(modality) ? 'primary' : 'default', onDelete: modalities.includes(modality) ? () => handleRemoveModality(modality) : undefined, sx: { mb: 1 } }, modality))) })] }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Difficulty Level" }), _jsxs(Select, { value: difficulty, label: "Difficulty Level", onChange: handleDifficultyChange, children: [_jsx(MenuItem, { value: "beginner", children: "Beginner" }), _jsx(MenuItem, { value: "intermediate", children: "Intermediate" }), _jsx(MenuItem, { value: "advanced", children: "Advanced" })] })] }) }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { gutterBottom: true, children: "Custom Tags" }), _jsx(Box, { sx: { mb: 2 }, children: _jsx(TextField, { fullWidth: true, label: "Add Custom Tag", value: newCustomTag, onChange: (e) => setNewCustomTag(e.target.value), onKeyPress: (e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddCustomTag();
                                        }
                                    }, InputProps: {
                                        endAdornment: (_jsx(IconButton, { onClick: handleAddCustomTag, color: "primary", children: _jsx(AddIcon, {}) })),
                                    } }) }), _jsx(Stack, { direction: "row", spacing: 1, flexWrap: "wrap", useFlexGap: true, children: customTags.map((tag, index) => (_jsx(Chip, { label: tag, onDelete: () => handleRemoveCustomTag(tag), sx: { mb: 1 } }, index))) })] })] })] }));
}
