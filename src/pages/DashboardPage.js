import React, { useState, useEffect } from 'react';
import { fetchPrograms, fetchStakeholders, fetchTasks } from '../api/apiService';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  LinearProgress,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  Assignment,
  People,
  Warning,
  CheckCircle,
  Schedule,
  AttachMoney,
  LocationOn
} from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: color, mr: 2 }}>
          <Icon />
        </Avatar>
        <Box>
          <Typography variant="h4" component="div" fontWeight={600}>
            {value}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
        </Box>
      </Box>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'task_completed':
      return <CheckCircle sx={{ color: '#4caf50' }} />;
    case 'program_created':
      return <Assignment sx={{ color: '#2196f3' }} />;
    case 'task_overdue':
      return <Warning sx={{ color: '#f44336' }} />;
    case 'report_submitted':
      return <TrendingUp sx={{ color: '#ff9800' }} />;
    default:
      return <Schedule sx={{ color: '#9e9e9e' }} />;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return '#f44336';
    case 'medium': return '#ff9800';
    case 'low': return '#4caf50';
    default: return '#9e9e9e';
  }
};

export default function DashboardPage() {
  const [programs, setPrograms] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [programsData, stakeholdersData, tasksData] = await Promise.all([
          fetchPrograms(),
          fetchStakeholders(),
          fetchTasks(),
        ]);
        setPrograms(programsData);
        setStakeholders(stakeholdersData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    loadData();
  }, []);

  const handleTestAPI = async () => {
    try {
      const token = localStorage.getItem('token'); // We'll implement token storage later
      const data = await fetchStakeholders(token);
      setStakeholders(data);
      console.log('Stakeholders:', data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  // Generate a dynamic feed of recent activities (approximated)
  const allItems = [
    ...programs.map(p => ({ ...p, type: 'program_created', priority: p.priority || 'medium' })),
    ...tasks.map(t => ({ ...t, type: 'task_created', priority: 'low' })) // Tasks don't have priority, so we assign one
  ];

  const recentActivities = allItems
    .sort((a, b) => b.id - a.id) // Sort by ID descending to get the newest items
    .slice(0, 5) // Get the top 5 newest items
    .map(item => ({
      id: item.id,
      type: item.type,
      title: item.name,
      user: item.assignedTo || 'System', // Use assignedTo for tasks, otherwise 'System'
      time: 'Just now', // Placeholder time
      priority: item.priority
    }));

  // Generate dynamic upcoming tasks
  const upcomingTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3)
    .map(task => {
      const program = programs.find(p => p.id === task.programId);
      return {
        ...task,
        program: program ? program.name : 'Unknown Program'
      };
    });

  // Generate dynamic program progress
  const programProgress = programs.map(program => {
    const programTasks = tasks.filter(t => t.programId === program.id);
    const completedTasks = programTasks.filter(t => t.status === 'completed').length;
    const totalTasks = programTasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      name: program.name,
      progress,
      status: program.status
    };
  });
  // Calculate dynamic stats
  const totalPrograms = programs.length;
  const activePrograms = programs.filter(p => p.status === 'active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalBudget = programs.reduce((sum, p) => sum + p.budget, 0);
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
  // Let's define upcoming as due in the next 7 days
  const upcomingDeadlines = tasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return dueDate > today && dueDate <= nextWeek && t.status !== 'completed';
  }).length;

  const dashboardStats = {
    totalPrograms,
    activePrograms,
    completedTasks,
    totalTasks,
    totalBudget,
    activeUsers: 45, // This remains static for now
    overdueTasks,
    upcomingDeadlines
  };
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back! Here's what's happening with your road safety programs.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} columns={{ xs: 12, sm: 12, md: 12 }}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Total Programs"
            value={dashboardStats.totalPrograms}
            icon={Assignment}
            color="#2196f3"
            subtitle={`${dashboardStats.activePrograms} active`}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Task Completion"
            value={`${taskCompletionRate}%`}
            icon={CheckCircle}
            color="#4caf50"
            subtitle={`${dashboardStats.completedTasks}/${dashboardStats.totalTasks} tasks`}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Total Budget"
            value={`$${(dashboardStats.totalBudget / 1000000).toFixed(1)}M`}
            icon={AttachMoney}
            color="#ff9800"
            subtitle="Across all programs"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={dashboardStats.activeUsers}
            icon={People}
            color="#9c27b0"
            subtitle="Team members"
          />
        </Grid>
      </Grid>

      {/* Alert Cards */}
      <Grid container spacing={3} columns={{ xs: 12, sm: 12, md: 12 }}>
        <Grid xs={12} sm={6} md={6}>
          <Card sx={{ bgcolor: '#fff3e0', borderLeft: '4px solid #ff9800' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ color: '#ff9800', mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {dashboardStats.overdueTasks} Overdue Tasks
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Require immediate attention
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={6}>
          <Card sx={{ bgcolor: '#e3f2fd', borderLeft: '4px solid #2196f3' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ color: '#2196f3', mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {dashboardStats.upcomingDeadlines} Upcoming Deadlines
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In the next 7 days
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3} columns={{ xs: 12, sm: 12, md: 12 }}>
        {/* Program Progress */}
        <Grid xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Program Progress
            </Typography>
            <Box sx={{ mt: 2 }}>
              {programProgress.map((program, index) => (
                <Box key={`program-${program.name}-${index}`} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {program.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={program.status}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          textTransform: 'capitalize',
                          bgcolor: program.status === 'completed' ? '#e8f5e8' : 
                                   program.status === 'active' ? '#e3f2fd' : '#fff3e0',
                          color: program.status === 'completed' ? '#2e7d32' : 
                                 program.status === 'active' ? '#1976d2' : '#f57c00'
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {program.progress}%
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={program.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: program.status === 'completed' ? '#4caf50' : 
                                 program.status === 'active' ? '#2196f3' : '#ff9800'
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Activities
            </Typography>
            <List sx={{ mt: 1 }}>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={`activity-${activity.id}-${index}`}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'transparent' }}>
                        <ActivityIcon type={activity.type} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {activity.title}
                          </Typography>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: getPriorityColor(activity.priority)
                            }}
                          />
                        </Box>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            by {activity.user}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            • {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Tasks */}
        <Grid xs={12} md={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Upcoming Tasks
            </Typography>
            <Grid container spacing={3} columns={{ xs: 12, sm: 12, md: 12 }}>
              {upcomingTasks.map((task, index) => (
                <Grid key={`task-${task.id}-${index}`} xs={12} sm={6} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={500}>
                          {task.title}
                        </Typography>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: getPriorityColor(task.priority)
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {task.program}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                          {(task.assignee || '?').charAt(0)}
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <button onClick={handleTestAPI}>Test API Connection</button>
      <pre>{JSON.stringify(stakeholders, null, 2)}</pre>
    </Box>
  );
}
