import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import { User } from '../../types/user';

interface VerificationRequest {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  documents: string[];
  user: {
    id: string;
    displayName: string;
    email: string;
    title: string;
    specialization: string;
    institution: string;
  };
}

export const DoctorVerification: React.FC = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const q = query(
        collection(db, 'verificationRequests'),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      const requestsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate(),
      })) as VerificationRequest[];
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
    }
  };

  const handleVerification = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const requestRef = doc(db, 'verificationRequests', requestId);
      const request = requests.find((r) => r.id === requestId);

      if (!request) return;

      await updateDoc(requestRef, {
        status: action === 'approve' ? 'approved' : 'rejected',
        processedAt: new Date(),
      });

      if (action === 'approve') {
        const userRef = doc(db, 'users', request.userId);
        await updateDoc(userRef, {
          doctorVerificationStatus: 'verified',
        });
      }

      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error('Error processing verification request:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Doctor Verification
      </Typography>
      <Grid container spacing={3}>
        {requests.map((request) => (
          <Grid item xs={12} md={6} key={request.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {request.user.displayName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {request.user.email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Title: {request.user.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Specialization: {request.user.specialization}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Institution: {request.user.institution}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Verification Documents:
                  </Typography>
                  {request.documents.map((doc, index) => (
                    <Chip
                      key={index}
                      label={`Document ${index + 1}`}
                      onClick={() => window.open(doc, '_blank')}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  color="success"
                  onClick={() => handleVerification(request.id, 'approve')}
                >
                  Approve
                </Button>
                <Button
                  color="error"
                  onClick={() => handleVerification(request.id, 'reject')}
                >
                  Reject
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 