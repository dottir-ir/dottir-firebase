import React, { useState } from 'react';
import { Add as AddIcon } from '@mui/icons-material';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import type { CaseFormData } from '../../../types/case';
import type { StepProps } from '../../../types/form';

const SPECIALTIES = [
  'Radiology',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'Emergency Medicine',
  'Internal Medicine',
];

const MODALITIES = [
  'X-Ray',
  'CT',
  'MRI',
  'Ultrasound',
  'Nuclear Medicine',
  'PET',
  'Angiography',
];

export const TagsStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  errors
}) => {
  const [newCustomTag, setNewCustomTag] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>(formData.difficulty || 'intermediate');

  const tags = formData.tags || [];
  const specialties = tags.filter(tag => SPECIALTIES.includes(tag));
  const modalities = tags.filter(tag => MODALITIES.includes(tag));
  const customTags = tags.filter(tag => !SPECIALTIES.includes(tag) && !MODALITIES.includes(tag));

  const handleAddSpecialty = (specialty: string) => {
    if (!tags.includes(specialty)) {
      updateFormData({ tags: [...tags, specialty] });
    }
  };

  const handleAddModality = (modality: string) => {
    if (!tags.includes(modality)) {
      updateFormData({ tags: [...tags, modality] });
    }
  };

  const handleAddCustomTag = () => {
    if (newCustomTag.trim() && !tags.includes(newCustomTag.trim())) {
      updateFormData({ tags: [...tags, newCustomTag.trim()] });
      setNewCustomTag('');
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    updateFormData({
      tags: tags.filter((t) => t !== specialty)
    });
  };

  const handleRemoveModality = (modality: string) => {
    updateFormData({
      tags: tags.filter((t) => t !== modality)
    });
  };

  const handleRemoveCustomTag = (tag: string) => {
    updateFormData({
      tags: tags.filter((t) => t !== tag)
    });
  };

  const handleDifficultyChange = (event: SelectChangeEvent<'beginner' | 'intermediate' | 'advanced'>) => {
    const newDifficulty = event.target.value as 'beginner' | 'intermediate' | 'advanced';
    setDifficulty(newDifficulty);
    updateFormData({ difficulty: newDifficulty });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Tags
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography gutterBottom>Specialties</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {SPECIALTIES.map((specialty) => (
                <Chip
                  key={specialty}
                  label={specialty}
                  onClick={() => handleAddSpecialty(specialty)}
                  color={specialties.includes(specialty) ? 'primary' : 'default'}
                  onDelete={specialties.includes(specialty) ? () => handleRemoveSpecialty(specialty) : undefined}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Imaging Modalities</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {MODALITIES.map((modality) => (
                <Chip
                  key={modality}
                  label={modality}
                  onClick={() => handleAddModality(modality)}
                  color={modalities.includes(modality) ? 'primary' : 'default'}
                  onDelete={modalities.includes(modality) ? () => handleRemoveModality(modality) : undefined}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={difficulty}
                label="Difficulty Level"
                onChange={handleDifficultyChange}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Custom Tags</Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Add Custom Tag"
                value={newCustomTag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCustomTag(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleAddCustomTag} color="primary">
                      <AddIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {customTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveCustomTag(tag)}
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