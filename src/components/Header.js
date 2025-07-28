import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Divider
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search as SearchIcon, 
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { menuItems } from './menuItems'; // Import menuItems to get page titles

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - 240px)`,
    marginLeft: `240px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Header = ({ onSearchChange, open, handleDrawerOpen }) => {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation(); // Always available within Router

  const openMenu = Boolean(anchorEl);

  // Determine page title
  const currentPage = location ? menuItems?.find(item => location.pathname.startsWith(item.path)) : null;
  let pageTitle = 'Road Safety Management';
  if (currentPage) {
    pageTitle = currentPage.text;
  } else if (location && location.pathname !== '/') {
    const segment = location.pathname.split('/')[1] || '';
    pageTitle = segment.replace(/-/g, ' ');
    pageTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);
  }

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  return (
    <>
      <StyledAppBar position="fixed" open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {pageTitle}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search..."
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
            
            <div>
              {isAuthenticated && (
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  <AccountCircleIcon data-testid="AccountCircleIcon" />
                </IconButton>
              )}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openMenu}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                <Divider />
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </div>
          </Box>
        </Toolbar>
      </StyledAppBar>

    </>
  );
};

export default Header;
