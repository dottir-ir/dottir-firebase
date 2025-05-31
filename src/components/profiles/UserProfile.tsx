import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Grid,
} from '@mui/material';
import { User } from '../../types/user';

interface UserProfileProps {
  user: User;
  isOwnProfile?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, isOwnProfile = false }) => {
  const areasOfInterest = user.areasOfInterest || [];
  const verificationDocuments = user.verificationDocuments || [];

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <img
                src={user.photoURL || '/default-avatar.png'}
                alt={user.displayName}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <Typography variant="h5" sx={{ mt: 2 }}>
                {user.displayName}
              </Typography>
              {user.title && (
                <Typography color="textSecondary">{user.title}</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography paragraph>{user.bio}</Typography>

            {areasOfInterest.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Areas of Interest
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {areasOfInterest.map((area: string, index: number) => (
                    <Chip
                      key={index}
                      label={area}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </>
            )}

            {user.specialization && (
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Specialization
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.specialization}
                </Typography>
              </Box>
            )}

            {user.experience && (
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Experience
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.experience} years
                </Typography>
              </Box>
            )}

            {verificationDocuments.length > 0 && (
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Verification Documents
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {verificationDocuments.map((doc: string, index: number) => (
                    <Chip
                      key={index}
                      label={`Document ${index + 1}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      onClick={() => window.open(doc, '_blank')}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {isOwnProfile && (
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Typography variant="body2">Email: {user.email}</Typography>
                {user.phoneNumber && (
                  <Typography variant="body2">Phone: {user.phoneNumber}</Typography>
                )}
                {user.location && (
                  <Typography variant="body2">Location: {user.location}</Typography>
                )}
                {user.website && (
                  <Typography variant="body2">
                    Website:{' '}
                    <a href={user.website} target="_blank" rel="noopener noreferrer">
                      {user.website}
                    </a>
                  </Typography>
                )}
              </Box>
            )}

            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}; 