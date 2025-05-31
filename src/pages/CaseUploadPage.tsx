import { Container, Box, Typography, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import CaseUploadForm from '../components/case-upload/CaseUploadForm';

export default function CaseUploadPage() {
  const { currentUser } = useAuth();
  if (!currentUser || currentUser.role !== 'doctor') return null;
  if (currentUser.doctorVerificationStatus !== 'verified') {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Your account must be verified before you can upload cases. Please wait for admin approval.
          </Alert>
        </Box>
      </Container>
    );
  }
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload New Case
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Fill out the form below to upload a new medical case. You can save your progress as a draft and come back later to complete it.
        </Typography>
        <CaseUploadForm />
      </Box>
    </Container>
  );
} 