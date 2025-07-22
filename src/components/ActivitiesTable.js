import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { activitiesData as initialActivitiesData } from '../data/mockData';
import ActivityForm from './ActivityForm';
import ConfirmationDialog from './ConfirmationDialog';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableSortLabel, 
  Paper, 
  Chip, 
  IconButton, 
  Menu, 
  MenuItem 
} from '@mui/material';
import { Add, MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';
import { getStatusColor, getPriorityColor } from '../pages/ProgramsPage'; // Reusing these helpers

const ActivitiesTable = ({ programId }) => {
  const { user } = useAuth();
  const canManageActivities = user?.role === 'Program Manager' || user?.role === 'Team Lead';
  const navigate = useNavigate();
  const [activities, setActivities] = useState(initialActivitiesData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const filteredActivities = useMemo(() => 
    activities.filter(a => a.programId.toString() === programId)
  , [activities, programId]);

  const handleMenuOpen = (event, activity) => {
    setAnchorEl(event.currentTarget);
    setSelectedActivity(activity);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedActivity(null);
  };

  const handleFormSave = (activityData) => {
    if (editingActivity) {
      setActivities(activities.map(a => a.id === activityData.id ? activityData : a));
    } else {
      const newActivity = { ...activityData, id: Date.now(), programId: parseInt(programId) };
      setActivities([...activities, newActivity]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    setActivities(activities.filter(a => a.id !== activityToDelete.id));
    setIsConfirmOpen(false);
    setActivityToDelete(null);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Activities</Typography>
        {canManageActivities && (
          <Button variant="contained" startIcon={<Add />} onClick={() => {
            setEditingActivity(null);
            setIsFormOpen(true);
          }}>
            New Activity
          </Button>
        )}
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activity Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Timeline</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredActivities.length > 0 ? filteredActivities.map((activity) => {
              const statusColors = getStatusColor(activity.status);
              const priorityColors = getPriorityColor(activity.priority);
              return (
                <TableRow key={activity.id} hover>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>
                    <Chip label={activity.status} size="small" sx={{ backgroundColor: statusColors.bg, color: statusColors.color, textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={activity.priority} size="small" sx={{ backgroundColor: priorityColors.bg, color: priorityColors.color, textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell>{activity.startDate} - {activity.endDate}</TableCell>
                  <TableCell>${activity.budget.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, activity)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No activities found for this program.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/activity/${selectedActivity.id}`);
          handleMenuClose();
        }}><Visibility fontSize="small" sx={{ mr: 1 }} />View Details</MenuItem>
        {canManageActivities && [
          <MenuItem key="edit" onClick={() => {
            setEditingActivity(selectedActivity);
            setIsFormOpen(true);
            handleMenuClose();
          }}><Edit fontSize="small" sx={{ mr: 1 }} />Edit Activity</MenuItem>,
          <MenuItem key="delete" onClick={() => {
            setActivityToDelete(selectedActivity);
            setIsConfirmOpen(true);
            handleMenuClose();
          }}><Delete fontSize="small" sx={{ mr: 1 }} />Delete Activity</MenuItem>
        ]}
      </Menu>

      <ActivityForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
        activity={editingActivity}
      />

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Activity"
        message={`Are you sure you want to delete the activity \"${activityToDelete?.name}\"?`}
      />
    </Paper>
  );
};

export default ActivitiesTable;
