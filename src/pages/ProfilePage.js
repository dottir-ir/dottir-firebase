import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/UserService';
import { User } from '../models/User';
import { UserProfile } from '../components/profiles/UserProfile';
import { EditProfile } from '../components/profiles/EditProfile';
import { DoctorProfile } from '../components/profiles/DoctorProfile';
import { StudentProfile } from '../components/profiles/StudentProfile';
import { Container, Box, Button, CircularProgress, Alert, } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { CaseMetadata } from '../types/case';
import { caseService } from '../services/CaseService';
export const ProfilePage = () => {
    const { userId } = useParams();
    const { currentUser, updateProfile, error, clearError } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [publishedCases, setPublishedCases] = useState([]);
    const [savedCases, setSavedCases] = useState([]);
    const [learningMetrics, setLearningMetrics] = useState({
        casesCompleted: 0,
        averageScore: 0,
        timeSpent: 0,
        lastActive: new Date(),
    });
    const isOwnProfile = currentUser?.id === userId;
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userData = await userService.getUserById(userId);
                setUser(userData);
                if (userData.role === 'doctor') {
                    // Fetch published cases
                    const cases = await userService.getUserPublishedCases(userId);
                    setPublishedCases(cases);
                }
                else if (userData.role === 'student') {
                    // Fetch saved cases and learning metrics
                    const [saved, metrics] = await Promise.all([
                        userService.getUserSavedCases(userId),
                        userService.getUserLearningMetrics(userId),
                    ]);
                    // Fetch case details for each saved case
                    const savedCasesWithDetails = await Promise.all(saved.map(async (savedCase) => {
                        try {
                            const caseDetails = await caseService.getCaseById(savedCase.caseId);
                            return {
                                id: savedCase.id,
                                title: caseDetails.title,
                                savedAt: savedCase.savedAt,
                                progress: savedCase.progress,
                            };
                        }
                        catch (error) {
                            console.error(`Error fetching case ${savedCase.caseId}:`, error);
                            return null;
                        }
                    }));
                    setSavedCases(savedCasesWithDetails.filter((case_) => case_ !== null));
                    setLearningMetrics(metrics);
                }
            }
            catch (err) {
                // Use context error handling
                clearError();
                if (err instanceof Error) {
                    throw err;
                }
            }
            finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchUserData();
        }
    }, [userId, clearError]);
    const handleProfileUpdate = async (updatedUser) => {
        setUser(updatedUser);
        setIsEditing(false);
    };
    const handleEditCase = (caseId) => {
        navigate(`/cases/${caseId}/edit`);
    };
    const handleDeleteCase = async (caseId) => {
        if (window.confirm('Are you sure you want to delete this case?')) {
            try {
                await userService.deleteCase(caseId);
                setPublishedCases((prev) => prev.filter((c) => c.id !== caseId));
            }
            catch (err) {
                clearError();
                if (err instanceof Error) {
                    throw err;
                }
            }
        }
    };
    if (loading) {
        return (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', mt: 4 }, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Container, { maxWidth: "md", sx: { mt: 4 }, children: _jsx(Alert, { severity: "error", children: error }) }));
    }
    if (!user) {
        return (_jsx(Container, { maxWidth: "md", sx: { mt: 4 }, children: _jsx(Alert, { severity: "warning", children: "User not found" }) }));
    }
    return (_jsx(Container, { maxWidth: "md", sx: { mt: 4 }, children: isEditing ? (_jsx(EditProfile, { user: user, onProfileUpdated: handleProfileUpdate })) : (_jsxs(_Fragment, { children: [isOwnProfile && (_jsx(Box, { sx: { display: 'flex', justifyContent: 'flex-end', mb: 2 }, children: _jsx(Button, { variant: "contained", startIcon: _jsx(EditIcon, {}), onClick: () => setIsEditing(true), children: "Edit Profile" }) })), user.role === 'doctor' ? (_jsx(DoctorProfile, { user: user, publishedCases: publishedCases, onEditCase: handleEditCase, onDeleteCase: handleDeleteCase })) : user.role === 'student' ? (_jsx(StudentProfile, { user: user, savedCases: savedCases, learningMetrics: learningMetrics })) : (_jsx(UserProfile, { user: user, isOwnProfile: isOwnProfile }))] })) }));
};
