import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
const DoctorVerification = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    useEffect(() => {
        fetchVerificationRequests();
    }, []);
    const fetchVerificationRequests = async () => {
        try {
            const q = query(collection(db, 'verificationRequests'), where('status', '==', 'pending'));
            const querySnapshot = await getDocs(q);
            const requestsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                submittedAt: doc.data().submittedAt.toDate(),
            }));
            setRequests(requestsData);
        }
        catch (error) {
            console.error('Error fetching verification requests:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleVerification = async (requestId, status) => {
        try {
            const requestRef = doc(db, 'verificationRequests', requestId);
            await updateDoc(requestRef, {
                status,
                reviewedBy: currentUser?.uid,
                reviewedAt: new Date(),
            });
            // Update user role if approved
            if (status === 'approved') {
                const request = requests.find(r => r.id === requestId);
                if (request) {
                    const userRef = doc(db, 'users', request.userId);
                    await updateDoc(userRef, {
                        role: 'doctor',
                        isVerified: true,
                    });
                }
            }
            // Refresh the list
            await fetchVerificationRequests();
            setSelectedRequest(null);
        }
        catch (error) {
            console.error('Error updating verification status:', error);
        }
    };
    if (loading) {
        return _jsx("div", { className: "p-4", children: "Loading..." });
    }
    return (_jsxs("div", { className: "p-4", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Doctor Verification Requests" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Pending Requests" }), requests.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No pending verification requests" })) : (_jsx("div", { className: "space-y-4", children: requests.map(request => (_jsxs("div", { className: `p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedRequest?.id === request.id ? 'border-blue-500' : ''}`, onClick: () => setSelectedRequest(request), children: [_jsx("h3", { className: "font-medium", children: request.displayName }), _jsx("p", { className: "text-sm text-gray-600", children: request.email }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Submitted: ", request.submittedAt.toLocaleDateString()] })] }, request.id))) }))] }), _jsx("div", { className: "bg-white rounded-lg shadow p-4", children: selectedRequest ? (_jsxs("div", { children: [_jsxs("h2", { className: "text-lg font-semibold mb-4", children: ["Documents for ", selectedRequest.displayName] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Medical License" }), _jsx("img", { src: selectedRequest.documents.license, alt: "Medical License", className: "max-w-full h-auto rounded-lg" })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Certification" }), _jsx("img", { src: selectedRequest.documents.certification, alt: "Certification", className: "max-w-full h-auto rounded-lg" })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "ID Proof" }), _jsx("img", { src: selectedRequest.documents.idProof, alt: "ID Proof", className: "max-w-full h-auto rounded-lg" })] }), _jsxs("div", { className: "flex space-x-4 mt-6", children: [_jsx("button", { onClick: () => handleVerification(selectedRequest.id, 'approved'), className: "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600", children: "Approve" }), _jsx("button", { onClick: () => handleVerification(selectedRequest.id, 'rejected'), className: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600", children: "Reject" })] })] })] })) : (_jsx("div", { className: "text-center text-gray-500 py-8", children: "Select a request to view documents" })) })] })] }));
};
export default DoctorVerification;
