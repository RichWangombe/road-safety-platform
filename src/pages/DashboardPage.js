import React from 'react';
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

// Mock dashboard data
const dashboardStats = {
  totalPrograms: 12,
  activePrograms: 8,
  completedTasks: 156,
  totalTasks: 203,
  totalBudget: 8750000,
  activeUsers: 45,
  overdueTasks: 7,
  upcomingDeadlines: 12
};

const recentActivities = [
  {
    id: 1,
    type: 'task_completed',
    title: 'Highway inspection completed',
    user: 'John Smith',
    time: '2 hours ago',
    priority: 'high'
  },
  {
    id: 2,
    type: 'program_created',
    title: 'New traffic management program created',
    user: 'Sarah Johnson',
    time: '4 hours ago',
    priority: 'medium'
  },
  {
    id: 3,
    type: 'task_overdue',
    title: 'Road maintenance task overdue',
    user: 'Mike Davis',
    time: '6 hours ago',
    priority: 'high'
  },
  {
    id: 4,
    type: 'report_submitted',
    title: 'Monthly safety report submitted',
    user: 'Lisa Chen',
    time: '1 day ago',
    priority: 'low'
  }
];

const programProgress = [
  { name: 'Highway Safety Initiative', progress: 75, status: 'active' },
  { name: 'Urban Traffic Management', progress: 60, status: 'active' },
  { name: 'Rural Road Maintenance', progress: 15, status: 'planning' },
  { name: 'Driver Education Campaign', progress: 100, status: 'completed' }
];

const upcomingTasks = [
  {
    id: 1,
    title: 'Traffic light installation',
    dueDate: '2025-07-20',
    assignee: 'John Smith',
    priority: 'high',
    program: 'Urban Traffic Management'
  },
  {
    id: 2,
    title: 'Safety audit report',
    dueDate: '2025-07-22',
    assignee: 'Sarah Johnson',
    priority: 'medium',
    program: 'Highway Safety Initiative'
  },
  {
    id: 3,
    title: 'Equipment maintenance',
    dueDate: '2025-07-25',
    assignee: 'Mike Davis',
    priority: 'low',
    program: 'Rural Road Maintenance'
  }
];

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
  const taskCompletionRate = Math.round((dashboardStats.completedTasks / dashboardStats.totalTasks) * 100);
  
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Programs"
            value={dashboardStats.totalPrograms}
            icon={Assignment}
            color="#2196f3"
            subtitle={`${dashboardStats.activePrograms} active`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Task Completion"
            value={`${taskCompletionRate}%`}
            icon={CheckCircle}
            color="#4caf50"
            subtitle={`${dashboardStats.completedTasks}/${dashboardStats.totalTasks} tasks`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Budget"
            value={`$${(dashboardStats.totalBudget / 1000000).toFixed(1)}M`}
            icon={AttachMoney}
            color="#ff9800"
            subtitle="Across all programs"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
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
      <Grid container spacing={3}>
        {/* Program Progress */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Program Progress
            </Typography>
            <Box sx={{ mt: 2 }}>
              {programProgress.map((program, index) => (
                <Box key={index} sx={{ mb: 3 }}>
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
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Activities
            </Typography>
            <List sx={{ mt: 1 }}>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
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
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Upcoming Tasks
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {upcomingTasks.map((task) => (
                <Grid item xs={12} sm={6} md={4} key={task.id}>
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
                          {task.assignee.charAt(0)}
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
    </Box>
  );
}
