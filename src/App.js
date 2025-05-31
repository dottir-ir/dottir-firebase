import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { NewsfeedPage } from './pages/Newsfeed';
import CaseUploadPage from './pages/CaseUploadPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContentModeration from './pages/admin/ContentModeration';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import VerificationRequests from './pages/admin/VerificationRequests';
import { ProfilePage } from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';
// Placeholder components - you'll need to create these
const Dashboard = () => _jsx("div", { children: "Dashboard" });
const Unauthorized = () => _jsx("div", { children: "Unauthorized Access" });
const VerificationPending = () => _jsx("div", { children: "Your verification is pending" });
function App() {
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, { position: "top-right", toastOptions: {
                    duration: 4000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#4aed88',
                            color: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: '#ff4b4b',
                            color: '#fff',
                        },
                    },
                } }), _jsx(Router, { children: _jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginForm, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterForm, {}) }), _jsx(Route, { path: "/unauthorized", element: _jsx(Unauthorized, {}) }), _jsx(Route, { path: "/verification-pending", element: _jsx(VerificationPending, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(NewsfeedPage, {}) }) }), _jsx(Route, { path: "/profile/:userId", element: _jsx(ProtectedRoute, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "/doctor/*", element: _jsx(ProtectedRoute, { requiredRole: "doctor", children: _jsxs(Routes, { children: [_jsx(Route, { path: "upload-case", element: _jsx(CaseUploadPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }), _jsx(Route, { path: "/admin/*", element: _jsx(ProtectedRoute, { requiredRole: "admin", children: _jsxs(Routes, { children: [_jsx(Route, { path: "dashboard", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "verification-requests/*", element: _jsx(VerificationRequests, {}) }), _jsx(Route, { path: "content-moderation", element: _jsx(ContentModeration, {}) }), _jsx(Route, { path: "analytics", element: _jsx(AnalyticsDashboard, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "dashboard", replace: true }) })] }) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) })] }));
}
export default App;
