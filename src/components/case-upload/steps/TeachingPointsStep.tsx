import React, { useState } from 'react';
import { Add as AddIcon } from '@mui/icons-material';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import type { CaseFormData } from '../../../types/case';
import type { StepProps } from '../../../types/form';

export const TeachingPointsStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  errors
}) => {
  const [newPoint, setNewPoint] = useState('');

  const handleAddPoint = () => {
    if (newPoint.trim()) {
      const updatedPoints = [
        ...(formData.teachingPoints || []),
        { title: newPoint.trim(), description: '', order: formData.teachingPoints?.length || 0 }
      ];
      updateFormData({ teachingPoints: updatedPoints });
      setNewPoint('');
    }
  };

  const handleRemovePoint = (index: number) => {
    const updatedPoints = formData.teachingPoints?.filter((_, i) => i !== index) || [];
    updateFormData({ teachingPoints: updatedPoints });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Teaching Points
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography gutterBottom>Teaching Points (one per line)</Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Add Teaching Point"
                value={newPoint}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPoint(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPoint();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleAddPoint} color="primary">
                      <AddIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {formData.teachingPoints?.map((point, index) => (
                <Chip
                  key={index}
                  label={point.title}
                  onDelete={() => handleRemovePoint(index)}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <div className="button-group">
        <button type="button" onClick={prevStep}>Back</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
}; 