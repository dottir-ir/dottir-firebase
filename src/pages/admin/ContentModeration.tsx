import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';

interface ReportedContent {
  id: string;
  contentType: string;
  contentId: string;
  reason: string;
  reportedBy: string;
  reportedAt: Date;
  status: 'pending' | 'resolved' | 'dismissed';
}

export const ContentModeration: React.FC = () => {
  const [reports, setReports] = useState<ReportedContent[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const q = query(
        collection(db, 'reportedContent'),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      const reportsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        reportedAt: doc.data().reportedAt?.toDate(),
      })) as ReportedContent[];
      setReports(reportsData);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleAction = async (reportId: string, action: 'resolve' | 'dismiss') => {
    try {
      const reportRef = doc(db, 'reportedContent', reportId);
      const report = reports.find((r) => r.id === reportId);

      if (!report) return;

      await updateDoc(reportRef, {
        status: action === 'resolve' ? 'resolved' : 'dismissed',
        resolvedAt: new Date(),
      });

      if (action === 'resolve') {
        const contentRef = doc(db, report.contentType + 's', report.contentId);
        await deleteDoc(contentRef);
      }

      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (error) {
      console.error('Error handling report:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Content Moderation
      </Typography>
      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} md={6} key={report.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {report.contentType} Report
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Reported by: {report.reportedBy}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Reported at: {report.reportedAt.toLocaleString()}
                </Typography>
                <Typography variant="body1">{report.reason}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  color="error"
                  onClick={() => handleAction(report.id, 'resolve')}
                >
                  Remove Content
                </Button>
                <Button
                  color="primary"
                  onClick={() => handleAction(report.id, 'dismiss')}
                >
                  Dismiss Report
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ContentModeration; 