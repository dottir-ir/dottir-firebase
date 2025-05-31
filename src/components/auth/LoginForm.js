import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, error, clearError } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            clearError();
            await signIn(email, password);
            navigate('/dashboard');
        }
        catch (error) {
            // Error is handled by the auth context
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsx("div", { children: _jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Sign in to your account" }) }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [error && (_jsx("div", { className: "rounded-md bg-red-50 p-4", children: _jsx("div", { className: "text-sm text-red-700", children: error }) })), _jsxs("div", { className: "rounded-md shadow-sm -space-y-px", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email-address", className: "sr-only", children: "Email address" }), _jsx("input", { id: "email-address", name: "email", type: "email", autoComplete: "email", required: true, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Email address", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "sr-only", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", required: true, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value) })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-sm", children: _jsx(Link, { to: "/forgot-password", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "Forgot your password?" }) }), _jsx("div", { className: "text-sm", children: _jsx(Link, { to: "/register", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "Don't have an account? Register" }) })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: loading, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: loading ? 'Signing in...' : 'Sign in' }) })] })] }) }));
}
