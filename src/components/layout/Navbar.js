import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Home, TrendingUp, Star, User, Upload } from 'lucide-react';
export const Navbar = ({ userRole, onLogout, }) => {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navItems = [
        {
            label: 'Home',
            href: '/',
            icon: _jsx(Home, { className: "w-5 h-5" }),
        },
        {
            label: 'Trending',
            href: '/?sort=trending',
            icon: _jsx(TrendingUp, { className: "w-5 h-5" }),
        },
        {
            label: 'Popular',
            href: '/?sort=popular',
            icon: _jsx(Star, { className: "w-5 h-5" }),
        },
        {
            label: 'Upload Case',
            href: '/doctor/upload-case',
            icon: _jsx(Upload, { className: "w-5 h-5" }),
            roles: ['doctor'],
        },
    ];
    const filteredNavItems = navItems.filter((item) => !item.roles || item.roles.includes(userRole || ''));
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };
    return (_jsxs("nav", { className: `
        bg-${theme.colors.background}
        border-b border-gray-200
        sticky top-0 z-40
      `, children: [_jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between h-16", children: [_jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0 flex items-center", children: _jsx(Link, { to: "/", className: "text-xl font-bold text-primary", children: "MedCase" }) }), _jsx("div", { className: "hidden sm:ml-6 sm:flex sm:space-x-8", children: filteredNavItems.map((item) => (_jsxs(Link, { to: item.href, className: `
                    inline-flex items-center px-1 pt-1
                    text-sm font-medium
                    ${isActive(item.href)
                                            ? `text-${theme.colors.primary} border-b-2 border-${theme.colors.primary}`
                                            : `text-${theme.colors.text} border-b-2 border-transparent hover:text-${theme.colors.primary} hover:border-${theme.colors.primary}`}
                  `, children: [item.icon && (_jsx("span", { className: "mr-2", children: item.icon })), item.label] }, item.href))) })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: toggleTheme, className: "p-2", children: isDarkMode ? (_jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" }) })) : (_jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" }) })) }), userRole && (_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs(Link, { to: `/profile/${userRole}`, className: "flex items-center text-sm text-gray-500 hover:text-gray-700", children: [_jsx(User, { className: "w-5 h-5 mr-2" }), "Profile"] }), onLogout && (_jsx(Button, { variant: "outline", size: "sm", onClick: onLogout, children: "Logout" }))] }))] }), _jsx("div", { className: "flex items-center sm:hidden", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), className: "p-2", children: _jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: isMobileMenuOpen ? (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })) : (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" })) }) }) })] }) }), isMobileMenuOpen && (_jsxs("div", { className: "sm:hidden", children: [_jsx("div", { className: "pt-2 pb-3 space-y-1", children: filteredNavItems.map((item) => (_jsxs(Link, { to: item.href, className: `
                  flex items-center px-3 py-2
                  text-base font-medium
                  ${isActive(item.href)
                                ? `text-${theme.colors.primary} bg-${theme.colors.surface}`
                                : `text-${theme.colors.text} hover:bg-${theme.colors.surface} hover:text-${theme.colors.primary}`}
                `, children: [item.icon && (_jsx("span", { className: "mr-3", children: item.icon })), item.label] }, item.href))) }), userRole && (_jsx("div", { className: "pt-4 pb-3 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center px-4", children: [_jsxs(Link, { to: `/profile/${userRole}`, className: "flex items-center text-sm text-gray-500 hover:text-gray-700", children: [_jsx(User, { className: "w-5 h-5 mr-2" }), "Profile"] }), onLogout && (_jsx("div", { className: "ml-3", children: _jsx(Button, { variant: "outline", size: "sm", onClick: onLogout, children: "Logout" }) }))] }) }))] }))] }));
};
