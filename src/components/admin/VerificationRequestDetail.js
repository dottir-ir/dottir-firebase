import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verificationService } from '../../services/VerificationService';
import { VerificationRequestWithUser } from '../../models/VerificationRequest';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
export const VerificationRequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        const loadRequest = async () => {
            if (!id)
                return;
            try {
                const data = await verificationService.getVerificationRequestById(id);
                setRequest(data);
            }
            catch (err) {
                setError('Failed to load verification request');
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        loadRequest();
    }, [id]);
    const handleApprove = async () => {
        if (!id || !currentUser)
            return;
        setIsSubmitting(true);
        try {
            await verificationService.approveVerificationRequest(id, currentUser.uid);
            navigate('/admin/verification');
        }
        catch (err) {
            setError('Failed to approve request');
            console.error(err);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleReject = async () => {
        if (!id || !currentUser || !rejectionReason)
            return;
        setIsSubmitting(true);
        try {
            await verificationService.rejectVerificationRequest(id, currentUser.uid, rejectionReason);
            navigate('/admin/verification');
        }
        catch (err) {
            setError('Failed to reject request');
            console.error(err);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (loading) {
        return _jsx("div", { className: "flex justify-center p-4", children: "Loading..." });
    }
    if (error) {
        return _jsx("div", { className: "text-red-500 p-4", children: error });
    }
    if (!request) {
        return _jsx("div", { className: "text-red-500 p-4", children: "Request not found" });
    }
    return (_jsx("div", { className: "container mx-auto p-4", children: _jsxs("div", { className: "bg-white shadow-md rounded-lg p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Verification Request" }), _jsx("span", { className: `px-3 py-1 rounded-full text-sm font-semibold
            ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${request.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
            ${request.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
          `, children: request.status })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Doctor Information" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Name:" }), " ", request.user.displayName] }), _jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Email:" }), " ", request.user.email] }), _jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Title:" }), " ", request.user.title] }), request.user.specialization && (_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Specialization:" }), " ", request.user.specialization] })), request.user.institution && (_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Institution:" }), " ", request.user.institution] }))] })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Request Details" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Submitted:" }), " ", format(request.submittedAt.toDate(), 'MMM d, yyyy')] }), request.reviewedAt && (_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Reviewed:" }), " ", format(request.reviewedAt.toDate(), 'MMM d, yyyy')] })), request.rejectionReason && (_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Rejection Reason:" }), " ", request.rejectionReason] }))] })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Verification Documents" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: request.documents.map((doc, index) => (_jsx("div", { className: "border rounded-lg p-4", children: _jsxs("a", { href: doc, target: "_blank", rel: "noopener noreferrer", className: "text-indigo-600 hover:text-indigo-900", children: ["View Document ", index + 1] }) }, index))) })] }), request.status === 'pending' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "rejectionReason", className: "block text-sm font-medium text-gray-700", children: "Rejection Reason (if rejecting)" }), _jsx("textarea", { id: "rejectionReason", value: rejectionReason, onChange: (e) => setRejectionReason(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500", rows: 3 })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { onClick: handleApprove, disabled: isSubmitting, className: "bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50", children: isSubmitting ? 'Approving...' : 'Approve' }), _jsx("button", { onClick: handleReject, disabled: isSubmitting || !rejectionReason, className: "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50", children: isSubmitting ? 'Rejecting...' : 'Reject' })] })] }))] }) }));
};
