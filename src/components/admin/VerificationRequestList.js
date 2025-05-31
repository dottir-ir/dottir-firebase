import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { verificationService } from '../../services/VerificationService';
import { VerificationRequestWithUser } from '../../models/VerificationRequest';
import { format } from 'date-fns';
export const VerificationRequestList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadRequests = async () => {
            try {
                const data = await verificationService.getVerificationRequests();
                setRequests(data);
            }
            catch (err) {
                setError('Failed to load verification requests');
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        loadRequests();
    }, []);
    if (loading) {
        return _jsx("div", { className: "flex justify-center p-4", children: "Loading..." });
    }
    if (error) {
        return _jsx("div", { className: "text-red-500 p-4", children: error });
    }
    return (_jsxs("div", { className: "container mx-auto p-4", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "Verification Requests" }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Doctor" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Submitted" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: requests.map((request) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "flex items-center", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: request.user.displayName }), _jsx("div", { className: "text-sm text-gray-500", children: request.user.email })] }) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${request.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                    ${request.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                  `, children: request.status }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: format(request.submittedAt.toDate(), 'MMM d, yyyy') }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsx(Link, { to: `/admin/verification/${request.id}`, className: "text-indigo-600 hover:text-indigo-900", children: "Review" }) })] }, request.id))) })] }) })] }));
};
