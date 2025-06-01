import React from 'react';
import { Box, Typography, TextField, Grid, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import type { CaseFormData } from '../../../types/case';
import type { StepProps } from '../../../types/form';

export const TeachingPointsStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  isSubmitting
}) => {
  const [newTitle, setNewTitle] = React.useState('');
  const [newDescription, setNewDescription] = React.useState('');

  const handleAddTeachingPoint = () => {
    if (newTitle.trim() && newDescription.trim()) {
      const newPoint = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        order: formData.teachingPoints.length
      };
      updateFormData({
        teachingPoints: [...formData.teachingPoints, newPoint]
      });
      setNewTitle('');
      setNewDescription('');
    }
  };

  const handleRemoveTeachingPoint = (index: number) => {
    const updatedPoints = [...formData.teachingPoints];
    updatedPoints.splice(index, 1);
    // Update order of remaining points
    const reorderedPoints = updatedPoints.map((point, idx) => ({
      ...point,
      order: idx
    }));
    updateFormData({ teachingPoints: reorderedPoints });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Teaching Points
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Add Teaching Point
          </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <IconButton 
              onClick={handleAddTeachingPoint} 
              color="primary"
              disabled={!newTitle.trim() || !newDescription.trim()}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <List>
            {formData.teachingPoints.map((point, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={point.title}
                  secondary={point.description}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleRemoveTeachingPoint(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <IconButton onClick={prevStep} disabled={isSubmitting}>
          Back
        </IconButton>
        <IconButton onClick={nextStep} disabled={isSubmitting}>
          Next
        </IconButton>
      </Box>
    </Box>
  );
};

export default TeachingPointsStep; 