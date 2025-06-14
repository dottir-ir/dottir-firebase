import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Avatar,
  Autocomplete,
  Chip,
} from '@mui/material';
import { UserService } from '@/services/UserService';
import type { User } from '@/types/user';

interface EditProfileProps {
  user: User;
  onProfileUpdated: (updatedUser: User) => void;
}

const commonAreasOfInterest = [
  'Radiology',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Emergency Medicine',
  'Internal Medicine',
  'Surgery',
  'Oncology',
  'Orthopedics',
  'Dermatology',
];

export const EditProfile: React.FC<EditProfileProps> = ({ user, onProfileUpdated }) => {
  const userService = new UserService();
  const [formData, setFormData] = useState<Partial<User>>({
    displayName: user.displayName,
    title: user.title,
    bio: user.bio,
    specialization: user.specialization,
    institution: user.institution,
    medicalSchool: user.medicalSchool,
    yearOfStudy: user.yearOfStudy,
    areasOfInterest: user.areasOfInterest || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<User>) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await userService.updateUserProfile(user.uid, formData);
      const updatedUser = await userService.getUserById(user.uid);
      onProfileUpdated(updatedUser as User);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', my: 2 }}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                src={user.photoURL}
                alt={user.displayName}
                sx={{ width: 150, height: 150 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Display Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
                required
                placeholder={user.role === 'student' ? 'e.g., Medical Student' : 'e.g., Radiologist'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>

            {user.role === 'doctor' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
              </>
            )}

            {user.role === 'student' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Medical School"
                    name="medicalSchool"
                    value={formData.medicalSchool}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Year of Study"
                    name="yearOfStudy"
                    type="number"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    margin="normal"
                    required
                    inputProps={{ min: 1, max: 6 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={commonAreasOfInterest}
                    value={formData.areasOfInterest || []}
                    onChange={(_, newValue) => {
                      setFormData((prev: Partial<User>) => ({ ...prev, areasOfInterest: newValue }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Areas of Interest"
                        placeholder="Select areas of interest"
                        margin="normal"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                  />
                </Grid>
              </>
            )}

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}; 