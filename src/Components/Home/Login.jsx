// Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  Chip,
} from '@mui/material';

// Import MUI icons
import {
  LockOutlined,
  Person,
  MedicalServices,
  AdminPanelSettings,
  CalendarToday
} from '@mui/icons-material';

// Import custom CSS
import './Login.css';
import { validateCredentials } from '../Auth/passwords';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get('user');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: userType || 'patient'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotMessage, setShowForgotMessage] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(userType || 'patient');

  // User type specific configurations
  const userTypeConfig = {
    patient: {
      title: 'Patient Portal Login',
      subtitle: 'Access your healthcare records and appointments',
      icon: <Person fontSize="large" />,
      color: '#4CAF50',
      chipColor: 'success'
    },
    admin: {
      title: 'Administrator Login',
      subtitle: 'Access system administration',
      icon: <AdminPanelSettings fontSize="large" />,
      color: '#F44336',
      chipColor: 'error'
    },
    physician: {
      title: 'Physician Portal Login',
      subtitle: 'Access patient records and schedules',
      icon: <MedicalServices fontSize="large" />,
      color: '#2196F3',
      chipColor: 'primary'
    },
    receptionist: {
      title: 'Receptionist Portal Login',
      subtitle: 'Access appointment management',
      icon: <CalendarToday fontSize="large" />,
      color: '#FF9800',
      chipColor: 'warning'
    }
  };

  const currentUserType = userTypeConfig[selectedUserType] || userTypeConfig.patient;

  useEffect(() => {
    // Set the initial user type based on URL parameter
    if (userType) {
      setSelectedUserType(userType);
    } else {
      // Only redirect to home if coming directly to /login without any user type
      // and not from a logout action
      const fromLogout = location.state?.fromLogout;
      if (!fromLogout) {
        navigate('/', { replace: true });
      }
    }
  }, [userType, navigate, location]);

  // Redirect to home if trying to access login directly without userType
  useEffect(() => {
    if (!searchParams.get('user')) {
      navigate('/', { replace: true });
    }
  }, [navigate, searchParams]);

  // Define dashboard routes for each user type
  const dashboardRoutes = {
    admin: '/dashboard/admin',
    patient: '/dashboard/patient',
    physician: '/dashboard/doctor',
    receptionist: '/dashboard/receptionist'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await validateCredentials(formData.email, formData.password);
      if (user) {
        login(user);
        console.log('User role:', user.role); // Debug log

        // Navigate based on user role
        switch (user.role) {
          case 'admin':
            navigate('/dashboard/admin', { replace: true });
            break;
          case 'patient':
            navigate('/dashboard/patient', { replace: true });
            break;
          case 'doctor':
            navigate('/dashboard/doctor', { replace: true });
            break;
          case 'receptionist':
            navigate('/dashboard/receptionist', { replace: true });
            break;
          default:
            console.error('Unknown user role:', user.role);
            setError('Invalid user role');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }} className="container">
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Box sx={{ color: currentUserType.color, mb: 2 }}>
          {currentUserType.icon}
        </Box>
        <Typography variant="h4" gutterBottom>
          {currentUserType.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {currentUserType.subtitle}
        </Typography>
        <Chip 
          label={`${selectedUserType.charAt(0).toUpperCase() + selectedUserType.slice(1)} Access`}
          color={currentUserType.chipColor}
          sx={{ mt: 1 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Login Form */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: '16px', 
          maxWidth: '400px', 
          mx: 'auto',
          borderTop: `4px solid ${currentUserType.color}`
        }} 
        className="paper"
      >
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ 
              mt: 3,
              backgroundColor: currentUserType.color,
              '&:hover': {
                backgroundColor: currentUserType.color,
                opacity: 0.9
              }
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Forgot Password Message */}
        <Box textAlign="right" mt={2}>
          <Button
            color="primary"
            onClick={() => setShowForgotMessage(!showForgotMessage)}
            sx={{ textTransform: 'none' }}
          >
            Forgot Password?
          </Button>
        </Box>

        {showForgotMessage && (
          <Alert 
            severity="info" 
            sx={{ mt: 2 }}
            onClose={() => setShowForgotMessage(false)}
          >
            Please contact the system administrator to reset your password.
            <br />
            Email: admin@cnd.com
            <br />
            Phone: (123) 456-7890
          </Alert>
        )}

        {/* Back to Home - Only show for patient login */}
        {selectedUserType === 'patient' && (
          <Box textAlign="center" mt={3}>
            <Button
              color="primary"
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none' }}
            >
              ← Back to Home
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;