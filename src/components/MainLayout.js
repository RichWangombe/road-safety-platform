import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Box, Drawer, CssBaseline, Divider, IconButton, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, ListSubheader
} from '@mui/material';
import {
  ChevronLeft, ChevronRight, Menu, Dashboard, Groups, 
  Assignment, People, Report, LibraryBooks, Handshake, ViewKanban, AdminPanelSettings, Settings, Help
} from '@mui/icons-material';
import { useLocation, Link, Outlet } from 'react-router-dom';
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

import { menuItems } from './menuItems';



export { menuItems };

export default function MainLayout() {
  const theme = useTheme();
  const { user } = useAuth();
  const location = useLocation(); 
  const [open, setOpen] = useState(false);
  
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes('all') || item.roles.includes(user.role)
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
    <Box sx={{ display: 'flex' }} data-testid="main-layout">
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
                    backgroundColor: location?.pathname === item.path ? theme.palette.action.selected : 'inherit'
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
        <Outlet />
      </Main>
    </Box>
  );
}
