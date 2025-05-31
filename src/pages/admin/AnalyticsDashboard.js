import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');
    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);
    const fetchAnalytics = async () => {
        try {
            // Get total users
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const totalUsers = usersSnapshot.size;
            // Get doctors and patients
            const doctorsSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'doctor')));
            const patientsSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'patient')));
            // Get total cases
            const casesSnapshot = await getDocs(collection(db, 'cases'));
            const totalCases = casesSnapshot.size;
            // Get recent activity (last 7 days)
            const lastWeek = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
            const newUsersSnapshot = await getDocs(query(collection(db, 'users'), where('createdAt', '>=', lastWeek)));
            const newCasesSnapshot = await getDocs(query(collection(db, 'cases'), where('createdAt', '>=', lastWeek)));
            const verificationsSnapshot = await getDocs(query(collection(db, 'verificationRequests'), where('status', '==', 'approved'), where('reviewedAt', '>=', lastWeek)));
            // Get case distribution by specialty
            const caseDistribution = casesSnapshot.docs.reduce((acc, doc) => {
                const specialty = doc.data().specialty || 'Other';
                acc[specialty] = (acc[specialty] || 0) + 1;
                return acc;
            }, {});
            // Get user growth data
            const userGrowth = await getUserGrowthData(timeRange);
            setAnalytics({
                totalUsers,
                totalDoctors: doctorsSnapshot.size,
                totalPatients: patientsSnapshot.size,
                totalCases,
                recentActivity: {
                    newUsers: newUsersSnapshot.size,
                    newCases: newCasesSnapshot.size,
                    verifications: verificationsSnapshot.size,
                },
                userGrowth,
                caseDistribution: Object.entries(caseDistribution).map(([specialty, count]) => ({
                    specialty,
                    count: count,
                })),
            });
        }
        catch (error) {
            console.error('Error fetching analytics:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getUserGrowthData = async (range) => {
        const now = new Date();
        let startDate;
        let interval;
        switch (range) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                interval = 24 * 60 * 60 * 1000; // 1 day
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                interval = 24 * 60 * 60 * 1000; // 1 day
                break;
            case 'year':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                interval = 30 * 24 * 60 * 60 * 1000; // 30 days
                break;
        }
        const data = [];
        for (let d = startDate; d <= now; d = new Date(d.getTime() + interval)) {
            const nextDate = new Date(d.getTime() + interval);
            const usersSnapshot = await getDocs(query(collection(db, 'users'), where('createdAt', '>=', Timestamp.fromDate(d)), where('createdAt', '<', Timestamp.fromDate(nextDate))));
            data.push({
                date: d.toLocaleDateString(),
                users: usersSnapshot.size,
            });
        }
        return data;
    };
    if (loading) {
        return _jsx("div", { className: "p-4", children: "Loading analytics..." });
    }
    if (!analytics) {
        return _jsx("div", { className: "p-4", children: "Error loading analytics" });
    }
    return (_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Analytics Dashboard" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setTimeRange('week'), className: `px-4 py-2 rounded ${timeRange === 'week'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'}`, children: "Week" }), _jsx("button", { onClick: () => setTimeRange('month'), className: `px-4 py-2 rounded ${timeRange === 'month'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'}`, children: "Month" }), _jsx("button", { onClick: () => setTimeRange('year'), className: `px-4 py-2 rounded ${timeRange === 'year'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'}`, children: "Year" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [_jsx("h3", { className: "text-gray-500 text-sm", children: "Total Users" }), _jsx("p", { className: "text-2xl font-bold", children: analytics.totalUsers })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [_jsx("h3", { className: "text-gray-500 text-sm", children: "Total Doctors" }), _jsx("p", { className: "text-2xl font-bold", children: analytics.totalDoctors })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [_jsx("h3", { className: "text-gray-500 text-sm", children: "Total Patients" }), _jsx("p", { className: "text-2xl font-bold", children: analytics.totalPatients })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [_jsx("h3", { className: "text-gray-500 text-sm", children: "Total Cases" }), _jsx("p", { className: "text-2xl font-bold", children: analytics.totalCases })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-4 mb-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Recent Activity (Last 7 Days)" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-gray-500 text-sm", children: "New Users" }), _jsx("p", { className: "text-xl font-bold", children: analytics.recentActivity.newUsers })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-gray-500 text-sm", children: "New Cases" }), _jsx("p", { className: "text-xl font-bold", children: analytics.recentActivity.newCases })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-gray-500 text-sm", children: "Doctor Verifications" }), _jsx("p", { className: "text-xl font-bold", children: analytics.recentActivity.verifications })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Case Distribution by Specialty" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: analytics.caseDistribution.map(({ specialty, count }) => (_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("h3", { className: "text-gray-500 text-sm", children: specialty }), _jsx("p", { className: "text-xl font-bold", children: count })] }, specialty))) })] })] }));
};
export default AnalyticsDashboard;
