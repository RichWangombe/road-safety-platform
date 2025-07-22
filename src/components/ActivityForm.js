import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from '@mui/material';

const ActivityForm = ({ open, onClose, onSave, activity }) => {
  const [formData, setFormData] = useState(activity || {});

  useEffect(() => {
    setFormData(activity || {});
  }, [activity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{activity ? 'Edit Activity' : 'Create New Activity'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Activity Name"
              value={formData.name || ''}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="budget"
              label="Budget"
              type="number"
              value={formData.budget || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            {/* Placeholder for a status dropdown */}
            <TextField
              name="status"
              label="Status"
              value={formData.status || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
           <Grid item xs={6}>
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              value={formData.startDate || ''}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              value={formData.endDate || ''}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityForm;
