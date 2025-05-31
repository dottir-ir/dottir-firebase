import {
  Box,
  Typography,
  TextField,
  Grid,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import type { CaseUpload } from '../../../types/case';

export default function TeachingPointsStep() {
  const { register, formState: { errors }, setValue, watch } = useFormContext<CaseUpload>();
  const [newKeyPoint, setNewKeyPoint] = React.useState('');
  const [newReference, setNewReference] = React.useState('');
  const [newRelatedCase, setNewRelatedCase] = React.useState('');

  const keyPoints = watch('teachingPoints.keyPoints') || [];
  const references = watch('teachingPoints.references') || [];
  const relatedCases = watch('teachingPoints.relatedCases') || [];

  const handleAddKeyPoint = () => {
    if (newKeyPoint.trim()) {
      setValue('teachingPoints.keyPoints', [...keyPoints, newKeyPoint.trim()]);
      setNewKeyPoint('');
    }
  };

  const handleAddReference = () => {
    if (newReference.trim()) {
      setValue('teachingPoints.references', [...references, newReference.trim()]);
      setNewReference('');
    }
  };

  const handleAddRelatedCase = () => {
    if (newRelatedCase.trim()) {
      setValue('teachingPoints.relatedCases', [...relatedCases, newRelatedCase.trim()]);
      setNewRelatedCase('');
    }
  };

  const handleRemoveKeyPoint = (index: number) => {
    setValue(
      'teachingPoints.keyPoints',
      keyPoints.filter((_, i) => i !== index)
    );
  };

  const handleRemoveReference = (index: number) => {
    setValue(
      'teachingPoints.references',
      references.filter((_, i) => i !== index)
    );
  };

  const handleRemoveRelatedCase = (index: number) => {
    setValue(
      'teachingPoints.relatedCases',
      relatedCases.filter((_, i) => i !== index)
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Teaching Points
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography gutterBottom>Key Teaching Points</Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Add Key Teaching Point"
              value={newKeyPoint}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewKeyPoint(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddKeyPoint();
                }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleAddKeyPoint} color="primary">
                    <AddIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {keyPoints.map((point, index) => (
              <Chip
                key={index}
                label={point}
                onDelete={() => handleRemoveKeyPoint(index)}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>References</Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Add Reference"
              value={newReference}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewReference(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddReference();
                }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleAddReference} color="primary">
                    <AddIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {references.map((reference, index) => (
              <Chip
                key={index}
                label={reference}
                onDelete={() => handleRemoveReference(index)}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>Related Cases</Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Add Related Case"
              value={newRelatedCase}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRelatedCase(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRelatedCase();
                }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleAddRelatedCase} color="primary">
                    <AddIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {relatedCases.map((relatedCase, index) => (
              <Chip
                key={index}
                label={relatedCase}
                onDelete={() => handleRemoveRelatedCase(index)}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
} 