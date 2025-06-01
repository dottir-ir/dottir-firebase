import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebase-config';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsData {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalCases: number;
  newUsers: number;
  newCases: number;
  verifiedDoctors: number;
  caseDistribution: {
    name: string;
    count: number;
  }[];
  userGrowth: {
    date: string;
    count: number;
  }[];
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalCases: 0,
    newUsers: 0,
    newCases: 0,
    verifiedDoctors: 0,
    caseDistribution: [],
    userGrowth: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get total users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        // Get doctors
        const doctorsSnapshot = await getDocs(
          query(collection(db, 'users'), where('role', '==', 'doctor'))
        );
        const totalDoctors = doctorsSnapshot.size;

        // Get patients
        const patientsSnapshot = await getDocs(
          query(collection(db, 'users'), where('role', '==', 'patient'))
        );
        const totalPatients = patientsSnapshot.size;

        // Get total cases
        const casesSnapshot = await getDocs(collection(db, 'cases'));
        const totalCases = casesSnapshot.size;

        // Get last week's data
        const lastWeek = Timestamp.fromDate(
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );

        // Get new users in the last week
        const newUsersSnapshot = await getDocs(
          query(collection(db, 'users'), where('createdAt', '>=', lastWeek))
        );
        const newUsers = newUsersSnapshot.size;

        // Get new cases in the last week
        const newCasesSnapshot = await getDocs(
          query(collection(db, 'cases'), where('createdAt', '>=', lastWeek))
        );
        const newCases = newCasesSnapshot.size;

        // Get verified doctors
        const verificationsSnapshot = await getDocs(
          query(
            collection(db, 'verificationRequests'),
            where('status', '==', 'approved'),
            where('reviewedAt', '>=', lastWeek)
          )
        );
        const verifiedDoctors = verificationsSnapshot.size;

        // Calculate case distribution
        const caseDistribution = casesSnapshot.docs.reduce<Record<string, number>>((acc, doc) => {
          const data = doc.data();
          const category = data.category || 'Uncategorized';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const caseDistributionArray: { name: string; count: number }[] = Object.entries(caseDistribution).map(
          ([name, count]) => ({
            name,
            count,
          })
        );

        // Calculate user growth over time
        const userGrowth = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const nextDate = new Date(d);
          nextDate.setDate(d.getDate() + 1);

          const usersSnapshot = await getDocs(
            query(
              collection(db, 'users'),
              where('createdAt', '>=', Timestamp.fromDate(d)),
              where('createdAt', '<', Timestamp.fromDate(nextDate))
            )
          );

          userGrowth.push({
            date: d.toLocaleDateString(),
            count: usersSnapshot.size,
          });
        }

        setAnalyticsData({
          totalUsers,
          totalDoctors,
          totalPatients,
          totalCases,
          newUsers,
          newCases,
          verifiedDoctors,
          caseDistribution: caseDistributionArray,
          userGrowth,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h5">{analyticsData.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Doctors
              </Typography>
              <Typography variant="h5">{analyticsData.totalDoctors}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Patients
              </Typography>
              <Typography variant="h5">{analyticsData.totalPatients}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Cases
              </Typography>
              <Typography variant="h5">{analyticsData.totalCases}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Case Distribution
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.caseDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Growth (Last 7 Days)
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AnalyticsDashboard; 