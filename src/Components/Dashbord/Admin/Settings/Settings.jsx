import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Alert,
  Container,
  CircularProgress,
  Switch,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  AccountCircle,
  PhotoCamera,
  Save,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  Settings as SettingsIcon,
  ExitToApp,
  Dashboard,
  People,
  CalendarToday,
  Assessment
} from '@mui/icons-material';
import DashboardLayout from '../../DasboardLayout';
import './Settings.css';
import { useAuth } from '../../../Auth/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef(null);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Admin User',
    email: 'admin@example.com',
    phone: '+251912345678',
    role: 'Administrator'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isUploading, setIsUploading] = useState(false);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const handleTogglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleProfilePicChange = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        setAlert({
          show: true,
          message: 'Please select an image file',
          type: 'error'
        });
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setAlert({
          show: true,
          message: 'Image size should be less than 5MB',
          type: 'error'
        });
        return;
      }

      setIsUploading(true);

      try {
        const reader = new FileReader();
        
        reader.onload = () => {
          setPreviewUrl(reader.result);
          setIsUploading(false);
          setAlert({
            show: true,
            message: 'Profile picture updated successfully!',
            type: 'success'
          });
        };

        reader.onerror = () => {
          setIsUploading(false);
          setAlert({
            show: true,
            message: 'Error reading file. Please try again.',
            type: 'error'
          });
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error('File reading error:', error);
        setIsUploading(false);
        setAlert({
          show: true,
          message: 'Error processing image. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Profile pic change error:', error);
      setIsUploading(false);
      setAlert({
        show: true,
        message: 'An error occurred. Please try again.',
        type: 'error'
      });
    }
  };

  const handleCameraClick = (e) => {
    e.preventDefault();
    try {
      fileInputRef.current?.click();
    } catch (error) {
      console.error('Camera click error:', error);
      setAlert({
        show: true,
        message: 'Error opening file selector. Please try again.',
        type: 'error'
      });
    }
  };

  const validateField = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          errorMessage = 'Full name is required';
        } else if (value.length < 3) {
          errorMessage = 'Name must be at least 3 characters long';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMessage = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errorMessage = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!value) {
          errorMessage = 'Phone number is required';
        } else if (!phoneRegex.test(value)) {
          errorMessage = 'Please enter a valid phone number';
        }
        break;

      case 'currentPassword':
        if (!value) {
          errorMessage = 'Current password is required';
        } else if (value.length < 6) {
          errorMessage = 'Password must be at least 6 characters long';
        }
        break;

      case 'newPassword':
        if (!value) {
          errorMessage = 'New password is required';
        } else if (value.length < 6) {
          errorMessage = 'Password must be at least 6 characters long';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          errorMessage = 'Please confirm your password';
        } else if (value !== passwordData.newPassword) {
          errorMessage = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));

    return !errorMessage;
  };

  const validateForm = (type) => {
    let isValid = true;

    if (type === 'Personal information') {
      isValid = validateField('fullName', personalInfo.fullName) &&
                validateField('email', personalInfo.email) &&
                validateField('phone', personalInfo.phone);
    } else if (type === 'Password') {
      isValid = validateField('currentPassword', passwordData.currentPassword) &&
                validateField('newPassword', passwordData.newPassword) &&
                validateField('confirmPassword', passwordData.confirmPassword);
    }

    return isValid;
  };

  const handleSubmit = (type) => {
    if (validateForm(type)) {
      setAlert({
        show: true,
        message: `${type} updated successfully!`,
        type: 'success'
      });
      setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
    } else {
      setAlert({
        show: true,
        message: 'Please fix the errors before submitting',
        type: 'error'
      });
    }
  };

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard/admin',
      icon: <Dashboard />,
      onClick: () => navigate('/dashboard/admin')
    },
    { 
      label: 'User Management', 
      path: '/dashboard/admin/user-management', 
      icon: <People />,
      onClick: () => navigate('/dashboard/admin/user-management')
    },
    { 
      label: 'Settings', 
      path: '/dashboard/admin/settings', 
      icon: <SettingsIcon />,
      onClick: () => navigate('/dashboard/admin/settings')
    },
    { 
      label: 'Logout', 
      path: '/login?user=admin', 
      icon: <ExitToApp />,
      onClick: () => {
        logout();
        navigate('/login?user=admin');
      },
      style: {
        icon: { color: '#d32f2f' },
        text: {
          '& .MuiTypography-root': {
            color: '#d32f2f',
            fontSize: '0.9rem',
          },
        }
      }
    }
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <Container className="settings-container">
        {alert.show && (
          <Alert 
            severity={alert.type} 
            sx={{ mb: 3 }}
            onClose={() => setAlert({ show: false, message: '', type: 'success' })}
          >
            {alert.message}
          </Alert>
        )}

        <Typography variant="h4" className="settings-title">
          Account Settings
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card className="profile-card">
              <CardContent>
                <Box className={`profile-pic-container ${isUploading ? 'loading' : ''}`}>
                  <Avatar
                    src={previewUrl}
                    className="profile-avatar"
                  >
                    {!previewUrl && personalInfo.fullName.charAt(0)}
                  </Avatar>
                  
                  <input
                    ref={fileInputRef}
                    accept="image/*"
                    type="file"
                    onChange={handleProfilePicChange}
                    style={{ display: 'none' }}
                    onClick={(e) => {
                      e.currentTarget.value = '';
                    }}
                  />
                  
                  <IconButton
                    className="camera-button"
                    onClick={handleCameraClick}
                    aria-label="change profile picture"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <PhotoCamera />
                    )}
                  </IconButton>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h5" mt={2}>
                    {personalInfo.fullName}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {personalInfo.role}
                  </Typography>
                </Box>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={personalInfo.fullName}
                      onChange={handlePersonalInfoChange}
                      error={!!errors.fullName}
                      helperText={errors.fullName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      error={!!errors.phone}
                      helperText={errors.phone}
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSubmit('Personal information')}
                  sx={{ mt: 2 }}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card className="password-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="current-password">Current Password</InputLabel>
                      <OutlinedInput
                        id="current-password"
                        type={showPassword.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        error={!!errors.currentPassword}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleTogglePassword('current')}
                              edge="end"
                            >
                              {showPassword.current ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Current Password"
                      />
                    </FormControl>
                    {errors.currentPassword && (
                      <Typography variant="caption" color="error">
                        {errors.currentPassword}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="new-password">New Password</InputLabel>
                      <OutlinedInput
                        id="new-password"
                        type={showPassword.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        error={!!errors.newPassword}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleTogglePassword('new')}
                              edge="end"
                            >
                              {showPassword.new ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="New Password"
                      />
                    </FormControl>
                    {errors.newPassword && (
                      <Typography variant="caption" color="error">
                        {errors.newPassword}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                      <OutlinedInput
                        id="confirm-password"
                        type={showPassword.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        error={!!errors.confirmPassword}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleTogglePassword('confirm')}
                              edge="end"
                            >
                              {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Confirm Password"
                      />
                    </FormControl>
                    {errors.confirmPassword && (
                      <Typography variant="caption" color="error">
                        {errors.confirmPassword}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSubmit('Password')}
                  sx={{ mt: 2 }}
                >
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default Settings;