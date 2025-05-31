import { format } from 'date-fns';

interface UserProfileProps {
  user: User;
  isOwnProfile?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, isOwnProfile = false }) => {
  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', my: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flex: { md: '0 0 33.333%' } }}>
            <Avatar
              src={user.photoURL}
              alt={user.displayName}
              sx={{ width: 150, height: 150 }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {user.displayName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {user.title}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Typography>

            {user.role === 'student' && (
              <>
                {user.medicalSchool && (
                  <Typography variant="body1" gutterBottom>
                    Medical School: {user.medicalSchool}
                  </Typography>
                )}
                {user.yearOfStudy && (
                  <Typography variant="body1" gutterBottom>
                    Year of Study: {user.yearOfStudy}
                  </Typography>
                )}
                {user.areasOfInterest && user.areasOfInterest.length > 0 && (
                  <Box mt={1} mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Areas of Interest:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {user.areasOfInterest.map((area, index) => (
                        <Chip
                          key={index}
                          label={area}
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </>
            )}

            {user.role === 'doctor' && (
              <>
                {user.specialization && (
                  <Typography variant="body1" gutterBottom>
                    Specialization: {user.specialization}
                  </Typography>
                )}
                {user.institution && (
                  <Typography variant="body1" gutterBottom>
                    Institution: {user.institution}
                  </Typography>
                )}
                {user.verificationDocuments && user.verificationDocuments.length > 0 && (
                  <Box mt={1}>
                    <Typography variant="subtitle2" gutterBottom>
                      Verification Documents:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {user.verificationDocuments.map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc}
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </>
            )}

            {user.bio && (
              <Box mt={2}>
                <Typography variant="body1">{user.bio}</Typography>
              </Box>
            )}

            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Member since {format(user.createdAt, 'MMMM yyyy')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}; 