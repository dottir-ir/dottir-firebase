import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { CaseService } from '@/services/CaseService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface CaseMetadata {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  difficulty: string;
  category?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
}

const caseService = new CaseService();

export const DoctorCasesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [cases, setCases] = useState<CaseMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    if (currentUser?.uid) {
      loadCases();
    }
  }, [currentUser?.uid]);

  const loadCases = async () => {
    if (!currentUser?.uid) return;
    
    try {
      setLoading(true);
      const doctorCases = await caseService.getDoctorCases(currentUser.uid);
      setCases(doctorCases);
    } catch (error) {
      toast.error('Failed to load cases');
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCase = async (caseId: string) => {
    if (!confirm('Are you sure you want to delete this case?')) return;

    try {
      await caseService.deleteCase(caseId);
      setCases(cases.filter(c => c.id !== caseId));
      toast.success('Case deleted successfully');
    } catch (error) {
      toast.error('Failed to delete case');
      console.error('Error deleting case:', error);
    }
  };

  const handleToggleVisibility = async (caseId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await caseService.updateCase(caseId, { status: newStatus });
      setCases(cases.map(c => 
        c.id === caseId ? { ...c, status: newStatus } : c
      ));
      toast.success(`Case ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      toast.error('Failed to update case visibility');
      console.error('Error updating case visibility:', error);
    }
  };

  const filteredCases = cases
    .filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'views':
          return b.viewCount - a.viewCount;
        case 'likes':
          return b.likeCount - a.likeCount;
        default:
          return 0;
      }
    });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Cases
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search cases"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="recent">Most Recent</MenuItem>
            <MenuItem value="views">Most Views</MenuItem>
            <MenuItem value="likes">Most Likes</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredCases.map((case_) => (
          <Grid item xs={12} md={6} lg={4} key={case_.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {case_.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {case_.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={case_.status}
                    color={case_.status === 'published' ? 'success' : 'default'}
                    size="small"
                  />
                  <Chip
                    label={case_.difficulty}
                    color="primary"
                    size="small"
                  />
                  {case_.category && (
                    <Chip
                      label={case_.category}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Views: {case_.viewCount} • Likes: {case_.likeCount} • Comments: {case_.commentCount}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  href={`/doctor/cases/edit/${case_.id}`}
                >
                  Edit
                </Button>
                <Tooltip title={case_.status === 'published' ? 'Unpublish' : 'Publish'}>
                  <IconButton
                    size="small"
                    onClick={() => handleToggleVisibility(case_.id, case_.status)}
                  >
                    {case_.status === 'published' ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteCase(case_.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCases.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No cases found
          </Typography>
        </Box>
      )}
    </Container>
  );
}; 