import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';
export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md', }) => {
    const { theme } = useTheme();
    const modalRef = useRef(null);
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const sizeStyles = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: _jsxs("div", { className: "flex min-h-screen items-center justify-center p-4 text-center", children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 transition-opacity", "aria-hidden": "true" }), _jsxs("div", { ref: modalRef, className: `
            relative transform overflow-hidden rounded-lg
            bg-${theme.colors.background}
            text-${theme.colors.text}
            shadow-xl transition-all
            ${sizeStyles[size]}
            w-full
          `, children: [_jsxs("div", { className: "px-6 py-4", children: [title && (_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-medium", children: title }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, className: "p-1", children: _jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] })), _jsx("div", { className: "mt-2", children: children })] }), footer && (_jsx("div", { className: `
                px-6 py-4
                bg-${theme.colors.surface}
                border-t border-gray-200
              `, children: footer }))] })] }) }));
};
