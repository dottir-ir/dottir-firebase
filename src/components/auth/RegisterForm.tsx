import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Autocomplete,
  Alert,
} from '@mui/material';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [title, setTitle] = useState('');
  const [medicalSchool, setMedicalSchool] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState<number | ''>('');
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([]);
  const [verificationDocuments, setVerificationDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      clearError();
      const normalizedYearOfStudy = yearOfStudy === '' ? undefined : Number(yearOfStudy);
      const userCredential = await register(
        email,
        password,
        role,
        {
          displayName,
          title,
          medicalSchool: role === 'student' ? medicalSchool : undefined,
          yearOfStudy: role === 'student' ? normalizedYearOfStudy : undefined,
          areasOfInterest: role === 'student' ? areasOfInterest : undefined,
          verificationDocuments: verificationDocuments.map(file => file.name),
        }
      );

      // If user is a doctor and has uploaded documents, create a verification request
      if (role === 'doctor' && verificationDocuments.length > 0) {
        await verificationService.submitVerificationRequest(userCredential.user.uid, verificationDocuments.map(file => file.name));
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVerificationDocuments(Array.from(e.target.files));
    }
  };

  const commonAreasOfInterest = [
    'Radiology',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Emergency Medicine',
    'Internal Medicine',
    'Surgery',
    'Obstetrics & Gynecology',
    'Psychiatry',
    'Dermatology',
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create an Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value as UserRole)}
              required
            >
              <MenuItem value="student">Medical Student</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder={role === 'student' ? 'e.g., Medical Student' : 'e.g., Radiologist'}
          />
        </Grid>
        
        {role === 'student' && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Medical School"
                value={medicalSchool}
                onChange={(e) => setMedicalSchool(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Year of Study"
                type="number"
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value ? Number(e.target.value) : '')}
                required
                inputProps={{ min: 1, max: 6 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={commonAreasOfInterest}
                value={areasOfInterest}
                onChange={(_, newValue) => setAreasOfInterest(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Areas of Interest"
                    placeholder="Select areas of interest"
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

        {role === 'doctor' && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Verification Documents
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Please upload your medical license, board certification, or other relevant credentials.
              Your account will be reviewed by our team before you can access all features.
            </Typography>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              id="verification-documents"
            />
            <label htmlFor="verification-documents">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ mt: 1 }}
              >
                Choose Files
              </Button>
            </label>
            {verificationDocuments.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Files:
                </Typography>
                {verificationDocuments.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => {
                      setVerificationDocuments(docs => docs.filter((_, i) => i !== index));
                    }}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
} 