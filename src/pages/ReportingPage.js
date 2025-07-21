import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Area
} from 'recharts';
import {
  Assessment,
  TrendingUp,
  AccountBalanceWallet,
  CheckCircleOutline
} from '@mui/icons-material';

// Mock Data
const monthlyTaskData = [
  { name: 'Jan', completed: 65, overdue: 10 },
  { name: 'Feb', completed: 59, overdue: 12 },
  { name: 'Mar', completed: 80, overdue: 5 },
  { name: 'Apr', completed: 81, overdue: 8 },
  { name: 'May', completed: 56, overdue: 15 },
  { name: 'Jun', completed: 55, overdue: 7 },
  { name: 'Jul', completed: 40, overdue: 9 },
];

const budgetAllocationData = [
  { name: 'Public Awareness Campaigns', value: 400000 },
  { name: 'Infrastructure Improvement', value: 300000 },
  { name: 'Training & Education', value: 200000 },
  { name: 'Enforcement Support', value: 100000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const teamPerformanceData = [
    { name: 'Week 1', teamA: 40, teamB: 24, teamC: 35 },
    { name: 'Week 2', teamA: 30, teamB: 13, teamC: 45 },
    { name: 'Week 3', teamA: 20, teamB: 98, teamC: 55 },
    { name: 'Week 4', teamA: 27, teamB: 39, teamC: 25 },
    { name: 'Week 5', teamA: 18, teamB: 48, teamC: 60 },
];

const activityIncidentData = [
    { month: 'Jan', activities: 120, incidents: 34 },
    { month: 'Feb', activities: 150, incidents: 30 },
    { month: 'Mar', activities: 180, incidents: 25 },
    { month: 'Apr', activities: 160, incidents: 22 },
    { month: 'May', activities: 200, incidents: 18 },
    { month: 'Jun', activities: 220, incidents: 15 },
];


export default function ReportingPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
        Reporting & Analytics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
            <Card>
                <CardContent>
                    <Assessment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">Total Programs</Typography>
                    <Typography variant="h4" fontWeight={600}>12</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <Card>
                <CardContent>
                    <CheckCircleOutline sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6">Tasks Completed</Typography>
                    <Typography variant="h4" fontWeight={600}>1,245</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <Card>
                <CardContent>
                    <AccountBalanceWallet sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h6">Total Budget</Typography>
                    <Typography variant="h4" fontWeight={600}>$1M</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <Card>
                <CardContent>
                    <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6">KPI Achievement</Typography>
                    <Typography variant="h4" fontWeight={600}>82%</Typography>
                </CardContent>
            </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>Tasks Completed per Month</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTaskData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#8884d8" name="Completed" />
                <Bar dataKey="overdue" fill="#82ca9d" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>Program Budget Allocation</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                <Pie
                  data={budgetAllocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {budgetAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 2, height: 300, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Team Performance Over Time</Typography>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={teamPerformanceData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="teamA" stroke="#8884d8" name="Team Alpha" />
                    <Line type="monotone" dataKey="teamB" stroke="#82ca9d" name="Team Bravo" />
                    <Line type="monotone" dataKey="teamC" stroke="#ffc658" name="Team Charlie" />
                </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 2, height: 300, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Activity vs. Incidents</Typography>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={activityIncidentData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="activities" fill="#8884d8" stroke="#8884d8" name="Safety Activities" />
                    <Line type="monotone" dataKey="incidents" stroke="#ff7300" name="Road Incidents" />
                </ComposedChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

