import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { StepProps } from '../types';
import { CaseFormData } from '../../../types/case';
export const ClinicalHistoryStep = ({ formData, updateFormData, nextStep, prevStep, errors }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Handle nested fields with dot notation
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            const sectionData = formData[section];
            updateFormData({
                [section]: {
                    ...sectionData,
                    [field]: value
                }
            });
        }
        else {
            updateFormData({ [name]: value });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsx("h2", { children: "Clinical History" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "clinicalHistory.presentation", children: "Presentation" }), _jsx("textarea", { id: "clinicalHistory.presentation", name: "clinicalHistory.presentation", value: formData.clinicalHistory?.presentation || '', onChange: handleChange, required: true }), errors?.clinicalHistory?.presentation && (_jsx("span", { className: "error", children: errors.clinicalHistory.presentation.message }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "clinicalHistory.history", children: "Medical History" }), _jsx("textarea", { id: "clinicalHistory.history", name: "clinicalHistory.history", value: formData.clinicalHistory?.history || '', onChange: handleChange, required: true }), errors?.clinicalHistory?.history && (_jsx("span", { className: "error", children: errors.clinicalHistory.history.message }))] }), _jsxs("div", { className: "button-group", children: [_jsx("button", { type: "button", onClick: prevStep, children: "Back" }), _jsx("button", { type: "submit", children: "Next" })] })] }));
};
