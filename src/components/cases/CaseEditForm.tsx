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
    content: '',
    status: 'draft',
    tags: [],
    category: '',
    difficulty: 'beginner',
    patientAge: 0,
    patientGender: 'male',
    clinicalPresentation: '',
    imagingFindings: '',
    diagnosis: '',
    treatment: '',
    outcome: '',
    references: [],
    teachingPoints: {
      keyPoints: [],
      references: [],
      relatedCases: []
    }
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
    setCaseData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
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

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Content"
              value={caseData.content}
              onChange={handleChange('content')}
              multiline
              rows={10}
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
              value={caseData.patientAge}
              onChange={handleChange('patientAge')}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Patient Gender</InputLabel>
              <Select
                value={caseData.patientGender}
                label="Patient Gender"
                onChange={handleChange('patientGender')}
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
              label="Diagnosis"
              value={caseData.diagnosis}
              onChange={handleChange('diagnosis')}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Treatment"
              value={caseData.treatment}
              onChange={handleChange('treatment')}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Outcome"
              value={caseData.outcome}
              onChange={handleChange('outcome')}
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
                setCaseData(prev => ({
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
              label="Key Teaching Points"
              value={caseData.teachingPoints?.keyPoints?.join('\n') || ''}
              onChange={(e) => {
                const points = e.target.value.split('\n').filter(Boolean);
                setCaseData(prev => ({
                  ...prev,
                  teachingPoints: {
                    ...prev.teachingPoints,
                    keyPoints: points,
                    references: prev.teachingPoints?.references ?? [],
                    relatedCases: prev.teachingPoints?.relatedCases ?? []
                  }
                }));
              }}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="References"
              value={caseData.teachingPoints?.references?.join('\n') || ''}
              onChange={(e) => {
                const refs = e.target.value.split('\n').filter(Boolean);
                setCaseData(prev => ({
                  ...prev,
                  teachingPoints: {
                    ...prev.teachingPoints,
                    references: refs,
                    keyPoints: prev.teachingPoints?.keyPoints ?? [],
                    relatedCases: prev.teachingPoints?.relatedCases ?? []
                  }
                }));
              }}
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Related Cases"
              value={caseData.teachingPoints?.relatedCases?.join('\n') || ''}
              onChange={(e) => {
                const cases = e.target.value.split('\n').filter(Boolean);
                setCaseData(prev => ({
                  ...prev,
                  teachingPoints: {
                    ...prev.teachingPoints,
                    relatedCases: cases,
                    keyPoints: prev.teachingPoints?.keyPoints ?? [],
                    references: prev.teachingPoints?.references ?? []
                  }
                }));
              }}
              multiline
              rows={4}
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