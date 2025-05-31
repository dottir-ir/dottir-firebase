import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, ReactNode } from 'react';
const lightTheme = {
    colors: {
        primary: '#2563eb',
        secondary: '#475569',
        accent: '#7c3aed',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        error: '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        fontSize: {
            small: '0.875rem',
            medium: '1rem',
            large: '1.25rem',
            xlarge: '1.5rem',
        },
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
    },
    borderRadius: {
        small: '0.25rem',
        medium: '0.5rem',
        large: '1rem',
    },
};
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const theme = isDarkMode
        ? {
            ...lightTheme,
            colors: {
                ...lightTheme.colors,
                background: '#1e293b',
                surface: '#334155',
                text: '#f8fafc',
            },
        }
        : lightTheme;
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };
    return (_jsx(ThemeContext.Provider, { value: { theme, isDarkMode, toggleTheme }, children: children }));
};
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
