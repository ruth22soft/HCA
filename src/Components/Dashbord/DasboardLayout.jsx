import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  ListItemButton,
  Menu,
  Badge,
  Avatar,
  ListItemAvatar,
  MenuItem,
  Button,
} from '@mui/material';
import {
  AccountCircle,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './DashboardLayout.css';
import PropTypes from 'prop-types';

const drawerWidth = 240;

const DashboardLayout = ({ children, menuItems, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  // Example notifications
  const notifications = [
    {
      id: 1,
      type: 'user',
      title: 'New User Registration',
      message: 'John Doe has registered as a new patient',
      time: '5 mins ago',
      icon: <PersonIcon />
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Appointment Request',
      message: 'New appointment request from Sarah Smith',
      time: '10 mins ago',
      icon: <EventIcon />
    },
    {
      id: 3,
      type: 'system',
      title: 'System Update',
      message: 'System maintenance scheduled for tonight',
      time: '1 hour ago',
      icon: <AssignmentIcon />
    }
  ];

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();

    // Get the current path
    const currentPath = window.location.pathname;

    // Direct navigation based on current dashboard
    if (currentPath.includes('/dashboard/admin')) {
      window.location.href = '/login?user=admin';
    } 
    else if (currentPath.includes('/dashboard/doctor')) {
      window.location.href = '/login?user=physician';
    } 
    else if (currentPath.includes('/dashboard/patient')) {
      window.location.href = '/login?user=patient';
    } 
    else if (currentPath.includes('/dashboard/receptionist')) {
      window.location.href = '/login?user=receptionist';
    } 
    else {
      window.location.href = '/';
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      paddingTop: '80px'  // Fixed padding to ensure content is below navbar
    }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          color: 'text.primary',
          height: { xs: '64px', sm: '72px' }
        }}
      >
        <Toolbar sx={{ minHeight: { xs: '64px', sm: '72px' } }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#1976d2' }}>
            CND Healthcare
          </Typography>
          
          <IconButton 
            sx={{ mr: 2, color: '#1976d2' }}
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton 
            onClick={handleUserMenuClick}
            size="large"
            sx={{ color: '#1976d2' }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                backgroundColor: 'white',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user?.name || 'Admin User'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {user?.role || 'Administrator'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                color: 'error.main',
                py: 1,
                '&:hover': {
                  backgroundColor: 'error.light',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'error.main' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: {
                width: 360,
                maxHeight: 400,
                overflow: 'auto',
                mt: 1.5,
                backgroundColor: 'white',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                boxShadow: 'none',
                '& .MuiList-root': {
                  py: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Notifications</Typography>
            </Box>
            <List sx={{ py: 0 }}>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{ 
                      py: 2,
                      px: 3,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {notification.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: 'block' }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {notification.time}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box 
              sx={{ 
                p: 1, 
                borderTop: 1, 
                borderColor: 'divider',
                textAlign: 'center'
              }}
            >
              <Typography 
                component="button"
                sx={{ 
                  color: 'primary.main',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                onClick={handleNotificationClose}
              >
                View All Notifications
              </Typography>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'transparent',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow: 'none',
            marginTop: '64px'  // Fixed margin to position below navbar
          },
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <Box sx={{ p: 2 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                color: '#1976d2',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              {title}
            </Typography>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              item.label !== 'Logout' && (  // Filter out the logout menu item
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    onClick={item.onClick}
                    selected={location.pathname === item.path}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#e3f2fd',
                      },
                      '&.active': {
                        backgroundColor: '#bbdefb',
                        borderLeft: '4px solid #1976d2',
                        '& .MuiListItemIcon-root': {
                          color: '#1976d2',
                        },
                        '& .MuiListItemText-root': {
                          '& .MuiTypography-root': {
                            fontWeight: 'bold',
                            color: '#1976d2',
                          },
                        },
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: location.pathname === item.path ? '#1976d2' : '#757575',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label}
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '0.9rem',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: 'calc(100vh - 80px)',  // Adjust for navbar height
          backgroundColor: 'transparent',
          '& .dashboard-title': {
            mb: 3,
            pt: 2  // Add padding to titles
          }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default DashboardLayout;