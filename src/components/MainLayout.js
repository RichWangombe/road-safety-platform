import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Box, Drawer, CssBaseline, Divider, IconButton, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, ListSubheader
} from '@mui/material';
import {
  ChevronLeft, ChevronRight, Menu, Dashboard, Groups, 
  Assignment, People, Report, LibraryBooks, Handshake, ViewKanban, AdminPanelSettings, Settings, Help
} from '@mui/icons-material';
import { useLocation, Link } from 'react-router-dom';
import Header from './Header';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const menuItems = [
  // Core Navigation
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['all'], group: 'Core' },
  { text: 'Task Board', icon: <ViewKanban />, path: '/board', roles: ['all'], group: 'Core' },
  
  // Management Section
  { text: 'Programs', icon: <Assignment />, path: '/programs', roles: ['manager', 'supervisor'], group: 'Management' },
  { text: 'Roles & Permissions', icon: <AdminPanelSettings />, path: '/roles', roles: ['manager'], group: 'Management' },
  { text: 'Team Members', icon: <People />, path: '/team-members', roles: ['manager', 'supervisor'], group: 'Management' },
  { text: 'Road Safety Actors', icon: <Groups />, path: '/road-safety-actors', roles: ['manager'], group: 'Management' },
  { text: 'Stakeholders', icon: <Handshake />, path: '/stakeholders', roles: ['manager'], group: 'Management' },
  
  // Reporting & Resources
  { text: 'Reporting', icon: <Report />, path: '/reporting', roles: ['supervisor', 'team-lead'], group: 'Operations' },
  { text: 'Resource Centre', icon: <LibraryBooks />, path: '/resource-centre', roles: ['all'], group: 'Operations' },
  
  // User & System
  { text: 'Settings', icon: <Settings />, path: '/settings', roles: ['all'], group: 'System' },
  { text: 'Help & Support', icon: <Help />, path: '/help', roles: ['all'], group: 'System' },
];

export default function MainLayout({ children }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  // Mock user role - replace with real auth later
  const userRole = 'team-lead'; 

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes('all') || item.roles.includes(userRole)
  );

  // Group the filtered menu items by their 'group' property
  const groupedMenuItems = filteredMenuItems.reduce((acc, item) => {
    const group = item.group || 'Other';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header position="fixed" open={open} handleDrawerOpen={handleDrawerOpen} />
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Toolbar>
        <Divider />
        
        <List>
          {Object.entries(groupedMenuItems).map(([groupName, items]) => (
            <div key={groupName}>
              <ListSubheader>{groupName}</ListSubheader>
              {items.map((item) => (
                <ListItem 
                  key={item.text} 
                  disablePadding
                  sx={{ 
                    backgroundColor: location.pathname === item.path ? theme.palette.action.selected : 'inherit'
                  }}
                >
                  <ListItemButton component={Link} to={item.path}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
            </div>
          ))}
        </List>
      </Drawer>
      
      <Main open={open}>
        <Toolbar />
        {children}
      </Main>
    </Box>
  );
}
