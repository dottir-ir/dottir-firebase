import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { StepProps } from '../types';
export const FindingsStep = ({ formData, updateFormData, nextStep, prevStep, errors }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    };
    // Handle differential diagnosis as an array
    const handleDifferentialChange = (e) => {
        const { value } = e.target;
        // Split by new lines to create an array
        const diagnoses = value.split('\n').filter(d => d.trim() !== '');
        updateFormData({ differentialDiagnosis: diagnoses });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsx("h2", { children: "Findings and Diagnosis" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "imagingFindings", children: "Imaging Findings" }), _jsx("textarea", { id: "imagingFindings", name: "imagingFindings", value: formData.imagingFindings || '', onChange: handleChange, required: true }), errors?.imagingFindings && (_jsx("span", { className: "error", children: errors.imagingFindings.message }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "differentialDiagnosis", children: "Differential Diagnosis (one per line)" }), _jsx("textarea", { id: "differentialDiagnosis", name: "differentialDiagnosis", value: Array.isArray(formData.differentialDiagnosis) ? formData.differentialDiagnosis.join('\n') : '', onChange: handleDifferentialChange, required: true }), errors?.differentialDiagnosis && (_jsx("span", { className: "error", children: errors.differentialDiagnosis.message }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "finalDiagnosis", children: "Final Diagnosis" }), _jsx("input", { type: "text", id: "finalDiagnosis", name: "finalDiagnosis", value: formData.finalDiagnosis || '', onChange: handleChange, required: true }), errors?.finalDiagnosis && (_jsx("span", { className: "error", children: errors.finalDiagnosis.message }))] }), _jsxs("div", { className: "button-group", children: [_jsx("button", { type: "button", onClick: prevStep, children: "Back" }), _jsx("button", { type: "submit", children: "Next" })] })] }));
};
