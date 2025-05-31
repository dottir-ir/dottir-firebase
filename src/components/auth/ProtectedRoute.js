import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../services/AuthService';
export function ProtectedRoute({ children, requiredRole }) {
    const { currentUser, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" }) }));
    }
    if (!currentUser) {
        // Redirect to login page but save the attempted url
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    if (requiredRole && currentUser.role !== requiredRole) {
        // Redirect to unauthorized page if user doesn't have the required role
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    // If user is a doctor, check verification status
    if (currentUser.role === 'doctor' && currentUser.doctorVerificationStatus === 'pending') {
        return _jsx(Navigate, { to: "/verification-pending", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
