import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { StepProps } from '../types';
import { CaseFormData } from '../../../types/case';
export const PatientDemographicsStep = ({ formData, updateFormData, nextStep, prevStep, errors }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Handle nested fields with dot notation
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            const sectionData = formData[section];
            updateFormData({
                [section]: {
                    ...sectionData,
                    [field]: field === 'age' ? (value === '' ? undefined : Number(value)) : value
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
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsx("h2", { children: "Patient Demographics" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "patientDemographics.age", children: "Age" }), _jsx("input", { type: "number", id: "patientDemographics.age", name: "patientDemographics.age", value: formData.patientDemographics?.age || '', onChange: handleChange, required: true }), errors?.patientDemographics?.age && (_jsx("span", { className: "error", children: errors.patientDemographics.age.message }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "patientDemographics.gender", children: "Gender" }), _jsxs("select", { id: "patientDemographics.gender", name: "patientDemographics.gender", value: formData.patientDemographics?.gender || '', onChange: handleChange, required: true, children: [_jsx("option", { value: "", children: "Select gender" }), _jsx("option", { value: "male", children: "Male" }), _jsx("option", { value: "female", children: "Female" }), _jsx("option", { value: "other", children: "Other" })] }), errors?.patientDemographics?.gender && (_jsx("span", { className: "error", children: errors.patientDemographics.gender.message }))] }), _jsxs("div", { className: "button-group", children: [_jsx("button", { type: "button", onClick: prevStep, children: "Back" }), _jsx("button", { type: "submit", children: "Next" })] })] }));
};
