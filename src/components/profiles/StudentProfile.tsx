import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { UserProfile } from './UserProfile';
import type { User } from '../../models/User';

interface StudentProfileProps {
  user: User;
  savedCases: Array<{
    id: string;
    title: string;
    savedAt: Date;
    progress: number;
  }>;
  learningMetrics: {
    casesCompleted: number;
    averageScore: number;
    timeSpent: number; // in minutes
    lastActive: Date;
  };
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  user,
  savedCases,
  learningMetrics,
}) => {
  return (
    <Box>
      <UserProfile user={user} />
      
      <Card sx={{ maxWidth: 800, mx: 'auto', my: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Learning Progress
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Cases Completed
              </Typography>
              <Typography variant="h4">
                {learningMetrics.casesCompleted}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Average Score
              </Typography>
              <Typography variant="h4">
                {learningMetrics.averageScore}%
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Time Spent
              </Typography>
              <Typography variant="h4">
                {Math.round(learningMetrics.timeSpent / 60)}h
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Last Active
              </Typography>
              <Typography variant="h4">
                {learningMetrics.lastActive.toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h5" gutterBottom>
            Saved Cases
          </Typography>
          
          <List>
            {savedCases.map((case_) => (
              <ListItem
                key={case_.id}
                component={Link}
                to={`/cases/${case_.id}`}
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={case_.title}
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Saved on {case_.savedAt.toLocaleDateString()}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={case_.progress}
                          sx={{ flexGrow: 1 }}
                        />
                        <Chip
                          label={`${case_.progress}%`}
                          size="small"
                          color={case_.progress === 100 ? 'success' : 'primary'}
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}; 