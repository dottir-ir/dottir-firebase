import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useForm, Controller, FieldValues, UseFormProps, SubmitHandler, DefaultValues } from 'react-hook-form';
import { useTheme } from '../../contexts/ThemeContext';
import { Input, InputProps } from './Input';
import { Button } from './Button';
export function Form({ fields, onSubmit, submitLabel = 'Submit', defaultValues, formOptions, className = '', }) {
    const { theme } = useTheme();
    const { control, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        defaultValues,
        ...formOptions,
    });
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: `space-y-6 ${className}`, children: [fields.map((field) => (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: field.name, className: "text-sm font-medium", children: field.label }), _jsx(Controller, { name: field.name, control: control, rules: field.validation, render: ({ field: { onChange, value, ref } }) => (_jsx(Input, { id: field.name, type: field.type || 'text', placeholder: field.placeholder, value: value, onChange: onChange, ref: ref, "aria-invalid": !!errors[field.name], "aria-describedby": errors[field.name] ? `${field.name}-error` : undefined })) }), errors[field.name] && (_jsx("p", { id: `${field.name}-error`, className: "text-sm text-red-500", children: errors[field.name]?.message }))] }, field.name))), _jsx(Button, { type: "submit", disabled: isSubmitting, className: `
          bg-${theme.colors.primary}
          text-white
          hover:bg-opacity-90
          w-full
        `, children: submitLabel })] }));
}
