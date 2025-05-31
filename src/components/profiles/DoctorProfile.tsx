import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  IconButton,
  Alert,
  Chip,
  Tooltip,
  Paper,
  Divider,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserProfile } from './UserProfile';
import type { User } from '../../models/User';

interface DoctorProfileProps {
  user: User;
  publishedCases: Array<{
    id: string;
    title: string;
    createdAt: Date;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    status: string;
  }>;
  onEditCase: (caseId: string) => void;
  onDeleteCase: (caseId: string) => void;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({
  user,
  publishedCases,
  onEditCase,
  onDeleteCase,
}) => {
  // Determine status
  const status = user.doctorVerificationStatus || 'pending';
  let statusColor: 'info' | 'success' | 'error' = 'info';
  let statusText = 'Pending Verification';
  let statusIcon = <VerifiedIcon color="disabled" fontSize="small" />;
  if (status === 'verified') {
    statusColor = 'success';
    statusText = 'Verified';
    statusIcon = <VerifiedIcon color="success" fontSize="small" />;
  } else if (status === 'rejected') {
    statusColor = 'error';
    statusText = 'Verification Rejected';
    statusIcon = <ErrorOutlineIcon color="error" fontSize="small" />;
  }

  const totalViews = publishedCases.reduce((sum, case_) => sum + case_.viewCount, 0);
  const totalLikes = publishedCases.reduce((sum, case_) => sum + case_.likeCount, 0);
  const totalComments = publishedCases.reduce((sum, case_) => sum + case_.commentCount, 0);

  return (
    <Box>
      {/* Status Banner */}
      <Alert severity={statusColor} sx={{ mb: 2 }}>
        {statusText}
        {status === 'rejected' && user.rejectionReason && (
          <>
            <br />
            <strong>Reason:</strong> {user.rejectionReason}
          </>
        )}
      </Alert>

      {/* Profile with badge */}
      <UserProfile user={user} />

      {/* Case Management Section */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Case Management</Typography>
          <Button
            component={Link}
            to="/doctor/cases/new"
            variant="contained"
            color="primary"
          >
            Create New Case
          </Button>
        </Box>

        {/* Case Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Views
                </Typography>
                <Typography variant="h4">
                  {totalViews.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Likes
                </Typography>
                <Typography variant="h4">
                  {totalLikes.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Comments
                </Typography>
                <Typography variant="h4">
                  {totalComments.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Published Cases Grid */}
        <Typography variant="h6" gutterBottom>
          Published Cases
        </Typography>
        <Grid container spacing={3}>
          {publishedCases.map((case_) => (
            <Grid item xs={12} md={6} lg={4} key={case_.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {case_.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={case_.status}
                      color={case_.status === 'published' ? 'success' : 'default'}
                      size="small"
                    />
                    <Chip
                      label={`${case_.viewCount} views`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {case_.likeCount} likes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {case_.commentCount} comments
                      </Typography>
                    </Box>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => onEditCase(case_.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDeleteCase(case_.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {publishedCases.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No published cases yet. Create your first case to get started!
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}; 