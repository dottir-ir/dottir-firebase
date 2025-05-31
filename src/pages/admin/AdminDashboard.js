import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
const AdminDashboard = () => {
    const { currentUser } = useAuth();
    return (_jsx("div", { className: "min-h-screen bg-gray-100", children: _jsxs("div", { className: "flex", children: [_jsxs("div", { className: "w-64 min-h-screen bg-white shadow-lg", children: [_jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800", children: "Admin Panel" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Welcome, ", currentUser?.displayName] })] }), _jsxs("nav", { className: "mt-4", children: [_jsx(Link, { to: "/admin/dashboard", className: "block px-4 py-2 text-gray-600 hover:bg-gray-100", children: "Dashboard" }), _jsx(Link, { to: "/admin/doctor-verification", className: "block px-4 py-2 text-gray-600 hover:bg-gray-100", children: "Doctor Verification" }), _jsx(Link, { to: "/admin/content-moderation", className: "block px-4 py-2 text-gray-600 hover:bg-gray-100", children: "Content Moderation" }), _jsx(Link, { to: "/admin/analytics", className: "block px-4 py-2 text-gray-600 hover:bg-gray-100", children: "Analytics" })] })] }), _jsx("div", { className: "flex-1 p-8", children: _jsx(Outlet, {}) })] }) }));
};
export default AdminDashboard;
