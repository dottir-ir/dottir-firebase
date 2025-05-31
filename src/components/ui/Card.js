import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
export const Card = ({ children, title, subtitle, header, footer, variant = 'elevated', className = '', onClick, }) => {
    const { theme } = useTheme();
    const variantStyles = {
        elevated: `
      bg-${theme.colors.background}
      shadow-lg
    `,
        outlined: `
      bg-${theme.colors.background}
      border border-gray-200
    `,
        filled: `
      bg-${theme.colors.surface}
    `,
    };
    return (_jsxs("div", { className: `
        rounded-lg overflow-hidden
        ${variantStyles[variant]}
        ${className}
        ${onClick ? 'cursor-pointer' : ''}
      `, onClick: onClick, children: [(header || title) && (_jsx(CardHeader, { children: header || (_jsxs(_Fragment, { children: [title && (_jsx("h3", { className: `
                    text-lg font-medium
                    text-${theme.colors.text}
                  `, children: title })), subtitle && (_jsx("p", { className: `
                    mt-1 text-sm
                    text-${theme.colors.secondary}
                  `, children: subtitle }))] })) })), _jsx(CardContent, { children: children }), footer && _jsx(CardFooter, { children: footer })] }));
};
export const CardHeader = ({ children, className = '' }) => {
    const { theme } = useTheme();
    return (_jsx("div", { className: `
        px-6 py-4
        border-b border-gray-200
        ${className}
      `, children: children }));
};
export const CardContent = ({ children, className = '' }) => {
    return (_jsx("div", { className: `px-6 py-4 ${className}`, children: children }));
};
export const CardFooter = ({ children, className = '' }) => {
    const { theme } = useTheme();
    return (_jsx("div", { className: `
        px-6 py-4
        border-t border-gray-200
        bg-${theme.colors.surface}
        ${className}
      `, children: children }));
};
