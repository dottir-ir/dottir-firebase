import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
export const Badge = ({ children, variant = 'default', size = 'md', className = '', }) => {
    const { theme } = useTheme();
    const variantStyles = {
        default: `bg-${theme.colors.surface} text-${theme.colors.text}`,
        primary: `bg-${theme.colors.primary} text-white`,
        secondary: `bg-${theme.colors.secondary} text-white`,
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        error: 'bg-red-500 text-white',
    };
    const sizeStyles = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
    };
    return (_jsx("span", { className: `
        inline-flex items-center
        rounded-full font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `, children: children }));
};
