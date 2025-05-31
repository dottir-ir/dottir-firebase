import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Paper, Typography, Alert } from '@mui/material';
import { CaseUpload, Case, CaseFormData } from '../../types/case';
import { PatientDemographicsStep } from './steps/PatientDemographicsStep';
import { ClinicalHistoryStep } from './steps/ClinicalHistoryStep';
import { FindingsStep } from './steps/FindingsStep';
import TeachingPointsStep from './steps/TeachingPointsStep';
import TagsStep from './steps/TagsStep';
import { useAuth } from '../../contexts/AuthContext';
const steps = [
    'Patient Demographics',
    'Clinical History',
    'Image Upload',
    'Findings & Diagnosis',
    'Teaching Points',
    'Tags'
];
const CaseUploadForm = () => {
    const { currentUser } = useAuth();
    const isDoctor = currentUser?.role === 'doctor';
    const isVerified = currentUser?.doctorVerificationStatus === 'verified';
    const [activeStep, setActiveStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        patientDemographics: {
            age: 0,
            gender: 'male'
        },
        clinicalHistory: {
            presentation: '',
            history: ''
        },
        images: [],
        imagingFindings: '',
        differentialDiagnosis: [],
        finalDiagnosis: '',
        teachingPoints: { keyPoints: [] },
        tags: [],
        difficulty: 'beginner',
        title: '',
        description: '',
        content: '',
        category: '',
        status: 'draft'
    });
    const updateFormData = (data) => {
        setFormData(prev => ({
            ...prev,
            ...data
        }));
    };
    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };
    const handleSaveDraft = async () => {
        setIsSubmitting(true);
        try {
            // TODO: Implement draft saving to Firebase
            console.log('Saving draft:', formData);
        }
        catch (error) {
            console.error('Error saving draft:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Process formData and submit
        console.log(formData);
        setIsSubmitting(false);
    };
    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return _jsx(PatientDemographicsStep, { formData: formData, updateFormData: updateFormData, nextStep: handleNext, prevStep: handleBack, isSubmitting: isSubmitting }, "demographics");
            case 1:
                return _jsx(ClinicalHistoryStep, { formData: formData, updateFormData: updateFormData, nextStep: handleNext, prevStep: handleBack, isSubmitting: isSubmitting }, "clinical");
            case 2:
                return _jsx(FindingsStep, { formData: formData, updateFormData: updateFormData, nextStep: handleNext, prevStep: handleBack, isSubmitting: isSubmitting }, "findings");
            case 3:
                return _jsx(TeachingPointsStep, {});
            case 4:
                return _jsx(TagsStep, {});
            default:
                return null;
        }
    };
    if (isDoctor && !isVerified) {
        return (_jsx(Paper, { sx: { p: 3, maxWidth: 800, mx: 'auto', my: 4 }, children: _jsx(Alert, { severity: "warning", children: "Your account is not verified. You cannot upload cases until your verification is approved." }) }));
    }
    return (_jsxs("form", { onSubmit: handleSubmit, children: [renderStepContent(activeStep), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mt: 3 }, children: [_jsx(Button, { disabled: activeStep === 0, onClick: handleBack, children: "Back" }), _jsxs(Box, { children: [_jsx(Button, { onClick: handleSaveDraft, disabled: isSubmitting, sx: { mr: 1 }, children: "Save Draft" }), activeStep === steps.length - 1 ? (_jsx(Button, { variant: "contained", type: "submit", disabled: isSubmitting, children: "Submit Case" })) : (_jsx(Button, { variant: "contained", onClick: handleNext, children: "Next" }))] })] })] }));
};
export default CaseUploadForm;
