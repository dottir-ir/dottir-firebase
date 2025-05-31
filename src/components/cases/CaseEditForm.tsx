import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
  Chip,
  Autocomplete,
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { CaseService } from '@/services/CaseService';
import type { Case } from '@/types/case';

const caseService = new CaseService();

interface CaseEditFormProps {
  onSave?: () => void;
}

export const CaseEditForm: React.FC<CaseEditFormProps> = ({ onSave }) => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [caseData, setCaseData] = useState<Partial<Case>>({
    title: '',
    description: '',
    status: 'draft',
    tags: [],
    category: '',
    difficulty: 'beginner',
    clinicalHistory: '',
    clinicalPresentation: '',
    imagingFindings: '',
    differentialDiagnosis: [],
    finalDiagnosis: '',
    patientDemographics: {
      age: 0,
      gender: 'male',
      presentingComplaint: ''
    },
    images: [],
    teachingPoints: []
  });

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const loadCase = async () => {
    if (!caseId) return;

    try {
      setLoading(true);
      const case_ = await caseService.getCaseById(caseId);
      setCaseData(case_);
    } catch (error) {
      toast.error('Failed to load case');
      console.error('Error loading case:', error);
      navigate('/doctor/cases');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;

    try {
      setSaving(true);
      await caseService.updateCase(caseId, caseData as Case);
      toast.success('Case updated successfully');
      onSave?.();
      navigate('/doctor/cases');
    } catch (error) {
      toast.error('Failed to update case');
      console.error('Error updating case:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Case) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }> | { target: { value: unknown } }
  ) => {
    if (field === 'patientDemographics') {
      const { name, value } = e.target as { name: string; value: unknown };
      const newValue = name === 'age' ? Number(value) || 0 : value;
      setCaseData((prev) => {
        const demographics = prev.patientDemographics || {
          age: 0,
          gender: 'male',
          presentingComplaint: ''
        };
        return {
          ...prev,
          patientDemographics: {
            ...demographics,
            [name]: newValue
          }
        } as Partial<Case>;
      });
    } else if (field === 'differentialDiagnosis') {
      const diagnoses = (e.target as { value: string }).value.split('\n').filter(d => d.trim());
      setCaseData((prev) => ({
        ...prev,
        differentialDiagnosis: diagnoses
      }));
    } else {
      setCaseData((prev) => ({
        ...prev,
        [field]: e.target.value
      }));
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading case...</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={caseData.title}
              onChange={handleChange('title')}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={caseData.description}
              onChange={handleChange('description')}
              multiline
              rows={3}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={caseData.category}
                label="Category"
                onChange={handleChange('category')}
                required
              >
                <MenuItem value="cardiology">Cardiology</MenuItem>
                <MenuItem value="neurology">Neurology</MenuItem>
                <MenuItem value="orthopedics">Orthopedics</MenuItem>
                <MenuItem value="pediatrics">Pediatrics</MenuItem>
                <MenuItem value="radiology">Radiology</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={caseData.difficulty}
                label="Difficulty"
                onChange={handleChange('difficulty')}
                required
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Patient Age"
              name="age"
              value={caseData.patientDemographics?.age ?? 0}
              onChange={handleChange('patientDemographics')}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Patient Gender</InputLabel>
              <Select
                name="gender"
                value={caseData.patientDemographics?.gender ?? 'male'}
                label="Patient Gender"
                onChange={handleChange('patientDemographics')}
                required
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Presenting Complaint"
              name="presentingComplaint"
              value={caseData.patientDemographics?.presentingComplaint ?? ''}
              onChange={handleChange('patientDemographics')}
              multiline
              rows={2}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Clinical History"
              value={caseData.clinicalHistory}
              onChange={handleChange('clinicalHistory')}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Clinical Presentation"
              value={caseData.clinicalPresentation}
              onChange={handleChange('clinicalPresentation')}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Imaging Findings"
              value={caseData.imagingFindings}
              onChange={handleChange('imagingFindings')}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Differential Diagnosis"
              value={caseData.differentialDiagnosis?.join('\n')}
              onChange={handleChange('differentialDiagnosis')}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Final Diagnosis"
              value={caseData.finalDiagnosis}
              onChange={handleChange('finalDiagnosis')}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={caseData.tags || []}
              onChange={(_, newValue) => {
                setCaseData((prev: Partial<Case>) => ({
                  ...prev,
                  tags: newValue
                }));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Add tags"
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Teaching Points (one per line)"
              value={caseData.teachingPoints?.map((tp: any) => tp.title).join('\n') || ''}
              onChange={(e) => {
                const points = e.target.value.split('\n').filter(Boolean);
                setCaseData((prev: Partial<Case>) => ({
                  ...prev,
                  teachingPoints: points.map((title, idx) => ({ title, description: '', order: idx }))
                }));
              }}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/doctor/cases')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}; 