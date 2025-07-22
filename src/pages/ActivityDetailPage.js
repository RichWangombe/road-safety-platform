import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Breadcrumbs, Link, Paper } from '@mui/material';
import TasksTable from '../components/TasksTable';
import { activitiesData } from '../data/mockData';
import { programsData } from './ProgramsPage';

const ActivityDetailPage = () => {
  const { activityId } = useParams();
  const activity = activitiesData.find(a => a.id.toString() === activityId);
  const program = activity ? programsData.find(p => p.id === activity.programId) : null;

  if (!activity || !program) {
    return <Typography variant="h4" color="error">Activity not found</Typography>;
  }

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/programs">
          Programs
        </Link>
        <Link component={RouterLink} underline="hover" color="inherit" to={`/program/${program.id}`}>
          {program.name}
        </Link>
        <Typography color="text.primary">{activity.name}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>{activity.name}</Typography>
        {/* We can add more activity-specific details here later */}
      </Paper>

      <TasksTable activityId={activityId} />
    </Box>
  );
};

export default ActivityDetailPage;
