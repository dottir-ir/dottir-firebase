import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
const ContentModeration = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    useEffect(() => {
        fetchReportedContent();
    }, []);
    const fetchReportedContent = async () => {
        try {
            const q = query(collection(db, 'reportedContent'), where('status', '==', 'pending'));
            const querySnapshot = await getDocs(q);
            const reportsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                reportedAt: doc.data().reportedAt.toDate(),
            }));
            setReports(reportsData);
        }
        catch (error) {
            console.error('Error fetching reported content:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleModeration = async (reportId, action) => {
        try {
            const reportRef = doc(db, 'reportedContent', reportId);
            const report = reports.find(r => r.id === reportId);
            if (!report)
                return;
            // Update report status
            await updateDoc(reportRef, {
                status: action,
                moderatedBy: currentUser?.uid,
                moderatedAt: new Date(),
            });
            // If content is removed, delete the original content
            if (action === 'removed') {
                const contentRef = doc(db, report.contentType + 's', report.contentId);
                await deleteDoc(contentRef);
            }
            // Refresh the list
            await fetchReportedContent();
            setSelectedReport(null);
        }
        catch (error) {
            console.error('Error moderating content:', error);
        }
    };
    if (loading) {
        return _jsx("div", { className: "p-4", children: "Loading..." });
    }
    return (_jsxs("div", { className: "p-4", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Content Moderation" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Reported Content" }), reports.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No pending reports" })) : (_jsx("div", { className: "space-y-4", children: reports.map(report => (_jsx("div", { className: `p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedReport?.id === report.id ? 'border-blue-500' : ''}`, onClick: () => setSelectedReport(report), children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium capitalize", children: report.contentType }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Reported by: ", report.reportedByEmail] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Reported: ", report.reportedAt.toLocaleDateString()] })] }), _jsx("span", { className: "px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded", children: report.reason })] }) }, report.id))) }))] }), _jsx("div", { className: "bg-white rounded-lg shadow p-4", children: selectedReport ? (_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Content Review" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Content Type" }), _jsx("p", { className: "capitalize", children: selectedReport.contentType })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Report Reason" }), _jsx("p", { className: "text-red-600", children: selectedReport.reason })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Content" }), selectedReport.content.title && (_jsx("p", { className: "font-medium", children: selectedReport.content.title })), selectedReport.content.text && (_jsx("p", { className: "mt-2", children: selectedReport.content.text })), selectedReport.content.author && (_jsxs("p", { className: "text-sm text-gray-600 mt-2", children: ["Author: ", selectedReport.content.author] }))] }), _jsxs("div", { className: "flex space-x-4 mt-6", children: [_jsx("button", { onClick: () => handleModeration(selectedReport.id, 'reviewed'), className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", children: "Mark as Reviewed" }), _jsx("button", { onClick: () => handleModeration(selectedReport.id, 'removed'), className: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600", children: "Remove Content" })] })] })] })) : (_jsx("div", { className: "text-center text-gray-500 py-8", children: "Select a report to review content" })) })] })] }));
};
export default ContentModeration;
