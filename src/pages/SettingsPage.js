import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Avatar,
  IconButton,
  Grid,
  FormControlLabel,
  Switch,
  Divider
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
          <Tab label="Profile" />
          <Tab label="Security" />
          <Tab label="Notifications" />
        </Tabs>
        <Divider />

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>Profile Information</Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 1 }} />
              <Button component="label" startIcon={<PhotoCamera />}>
                Upload
                <input type="file" hidden />
              </Button>
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField label="Full Name" defaultValue="John Doe" fullWidth sx={{ mb: 2 }} />
              <TextField label="Email Address" defaultValue="john.doe@example.com" fullWidth sx={{ mb: 2 }} />
              <TextField label="Role" defaultValue="Program Manager" fullWidth disabled />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Button variant="contained">Save Changes</Button>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Change Password</Typography>
          <Box sx={{ maxWidth: 500 }}>
            <TextField label="Current Password" type="password" fullWidth sx={{ mb: 2 }} />
            <TextField label="New Password" type="password" fullWidth sx={{ mb: 2 }} />
            <TextField label="Confirm New Password" type="password" fullWidth sx={{ mb: 2 }} />
            <Box sx={{ textAlign: 'right' }}>
                <Button variant="contained">Update Password</Button>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Notification Settings</Typography>
          <Box>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Email Notifications</Typography>
            <FormControlLabel control={<Switch defaultChecked />} label="Task Assignments" />
            <FormControlLabel control={<Switch defaultChecked />} label="Comment Mentions" />
            <FormControlLabel control={<Switch />} label="Weekly Summary" />
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>In-App Notifications</Typography>
            <FormControlLabel control={<Switch defaultChecked />} label="Task Status Changes" />
            <FormControlLabel control={<Switch defaultChecked />} label="Upcoming Deadlines" />
             <Box sx={{ textAlign: 'right', mt: 2 }}>
                <Button variant="contained">Save Preferences</Button>
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}
