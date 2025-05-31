import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { CaseService } from '@/services/CaseService';
import { UserService } from '@/services/UserService';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types/user';
import type { CaseMetadata } from '../types/case';
import { EditProfile } from '../components/profiles/EditProfile';
import { DoctorProfile } from '../components/profiles/DoctorProfile';
import { StudentProfile } from '../components/profiles/StudentProfile';
import { UserProfile } from '../components/profiles/UserProfile';

interface SavedCase {
  id: string;
  title: string;
  savedAt: Date;
  progress: number;
}

interface LearningMetrics {
  casesCompleted: number;
  averageScore: number;
  timeSpent: number;
  lastActive: Date;
}

export const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const userService = new UserService();
  const caseService = new CaseService();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [publishedCases, setPublishedCases] = useState<CaseMetadata[]>([]);
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  const [learningMetrics, setLearningMetrics] = useState<LearningMetrics>({
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
        const userData = await userService.getUserById(userId!);
        setUser(userData);

        if (userData.role === 'doctor') {
          // Fetch published cases
          const cases = await userService.getUserPublishedCases(userId!);
          setPublishedCases(cases);
        } else if (userData.role === 'student') {
          // Fetch saved cases and learning metrics
          const [saved, metrics] = await Promise.all([
            userService.getUserSavedCases(userId!),
            userService.getUserLearningMetrics(userId!),
          ]);

          // Fetch case details for each saved case
          const savedCasesWithDetails = await Promise.all(
            saved.map(async (savedCase: { caseId: string; id: string; savedAt: Date; progress: number }) => {
              try {
                const caseDetails = await caseService.getCaseById(savedCase.caseId);
                return {
                  id: savedCase.id,
                  title: caseDetails.title,
                  savedAt: savedCase.savedAt,
                  progress: savedCase.progress,
                };
              } catch (error) {
                console.error(`Error fetching case ${savedCase.caseId}:`, error);
                return null;
              }
            })
          );

          setSavedCases(savedCasesWithDetails.filter((case_: SavedCase | null): case_ is SavedCase => case_ !== null));
          setLearningMetrics(metrics);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (err instanceof Error) {
          throw err;
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleProfileUpdate = async (updatedUser: User) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleEditCase = (caseId: string) => {
    navigate(`/cases/${caseId}/edit`);
  };

  const handleDeleteCase = async (caseId: string) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await userService.deleteCase(caseId);
        setPublishedCases((prev) => prev.filter((c) => c.id !== caseId));
      } catch (err) {
        console.error('Error deleting case:', err);
        if (err instanceof Error) {
          throw err;
        }
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">User not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {isEditing ? (
        <EditProfile user={user} onProfileUpdated={handleProfileUpdate} />
      ) : (
        <>
          {isOwnProfile && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </Box>
          )}

          {user.role === 'doctor' ? (
            <DoctorProfile
              user={user}
              publishedCases={publishedCases}
              onEditCase={handleEditCase}
              onDeleteCase={handleDeleteCase}
            />
          ) : user.role === 'student' ? (
            <StudentProfile
              user={user}
              savedCases={savedCases}
              learningMetrics={learningMetrics}
            />
          ) : (
            <UserProfile user={user} isOwnProfile={isOwnProfile} />
          )}
        </>
      )}
    </Container>
  );
}; 