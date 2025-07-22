import React from 'react';
import { programsData } from './ProgramsPage';
import { tasksData, activitiesData } from '../data/mockData';
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
  Line,
  ComposedChart
} from 'recharts';
import {
  Assessment,
  TrendingUp,
  AccountBalanceWallet,
  CheckCircleOutline
} from '@mui/icons-material';



const budgetAllocationData = programsData.map(program => ({
  name: program.name,
  value: program.budget
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];






export default function ReportingPage() {
  // Generate data for Activity vs. Tasks chart
  const activityVsTasksData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('default', { month: 'short' }),
    activities: 0,
    tasks: 0,
  }));

  activitiesData.forEach(activity => {
    // Assuming ID is a timestamp for creation date
    const monthIndex = new Date(activity.id).getMonth();
    if (activityVsTasksData[monthIndex]) {
      activityVsTasksData[monthIndex].activities++;
    }
  });

  tasksData.forEach(task => {
    const monthIndex = new Date(task.id).getMonth();
    if (activityVsTasksData[monthIndex]) {
      activityVsTasksData[monthIndex].tasks++;
    }
  });

  // Generate data for monthly task chart
  const monthlyTaskData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString('default', { month: 'short' });
    return { name: month, completed: 0, overdue: 0 };
  });

  tasksData.forEach(task => {
    const monthIndex = new Date(task.dueDate).getMonth();
    if (task.status === 'completed') {
      monthlyTaskData[monthIndex].completed++;
    } else if (new Date(task.dueDate) < new Date()) {
      monthlyTaskData[monthIndex].overdue++;
    }
  });

  const totalPrograms = programsData.length;
  const completedTasks = tasksData.filter(task => task.status === 'completed').length;
  const totalBudget = programsData.reduce((acc, program) => acc + program.budget, 0);
  const kpiAchievement = tasksData.length > 0 ? Math.round((completedTasks / tasksData.length) * 100) : 0;

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
                    <Typography variant="h4" fontWeight={600}>{totalPrograms}</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <Card>
                <CardContent>
                    <CheckCircleOutline sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6">Tasks Completed</Typography>
                    <Typography variant="h4" fontWeight={600}>{completedTasks.toLocaleString()}</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <Card>
                <CardContent>
                    <AccountBalanceWallet sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h6">Total Budget</Typography>
                    <Typography variant="h4" fontWeight={600}>${(totalBudget / 1000000).toFixed(1)}M</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <Card>
                <CardContent>
                    <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6">KPI Achievement</Typography>
                    <Typography variant="h4" fontWeight={600}>{kpiAchievement}%</Typography>
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
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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
        
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: 300, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Activities vs. Tasks Created per Month</Typography>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={activityVsTasksData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="activities" fill="#8884d8" name="New Activities" />
                    <Line type="monotone" dataKey="tasks" stroke="#ff7300" name="New Tasks" />
                </ComposedChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

