import React, { useState } from "react";
import { 
  Card, CardContent, Typography, Grid, TextField, Button, MenuItem, Container, ListItemIcon, ListItemText 
} from "@mui/material";
import { AccountCircle, Settings, ExitToApp, VpnKey, Person, Dashboard, People, CalendarToday, Assessment } from "@mui/icons-material";
import DashboardLayout from "../../DasboardLayout";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Auth/AuthContext';

const UserManagement = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [accountEmail, setAccountEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [accountError, setAccountError] = useState("");

  const navigate = useNavigate();
  const { logout } = useAuth();

  // Handle input change
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle account creation
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!userData.fullName || !userData.username || !userData.email || !userData.password || !userData.role) {
      setFormError("All fields are required!");
      return;
    }

    setFormError(""); // Clear errors
    console.log("Creating User:", userData);
  };

  // Handle account activation
  const handleAccountAction = (e) => {
    e.preventDefault();

    if (!accountEmail) {
      setAccountError("Please enter a valid email.");
      return;
    }

    setAccountError(""); // Clear errors
    console.log("Activating/Deactivating Account for Email:", accountEmail);
  };

  // Consistent menuItems structure
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
      icon: <Settings />,
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
      {/* <Typography variant="h4" paddingTop={20} paddingBottom={5} sx={headerStyle}>User Management</Typography> */}

      <Container>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Grid container spacing={4}>
          {/* Create User Account Card */}
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h5" sx={cardTitleStyle}>Create User Account</Typography>
                {formError && <Typography sx={errorStyle}>{formError}</Typography>}
                <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
                  <TextField label="Full Name" name="fullName" value={userData.fullName} onChange={handleChange} fullWidth sx={inputStyle} />
                  <TextField label="Username" name="username" value={userData.username} onChange={handleChange} fullWidth sx={inputStyle} />
                  <TextField label="Email" name="email" type="email" value={userData.email} onChange={handleChange} fullWidth sx={inputStyle} />
                  <TextField label="Password" name="password" type="password" value={userData.password} onChange={handleChange} fullWidth sx={inputStyle} />
                  <TextField
                    select
                    label="Role"
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    fullWidth
                    sx={inputStyle}
                  >
                    <MenuItem value="Patient">Patient</MenuItem>
                    <MenuItem value="Physician">Physician</MenuItem>
                    <MenuItem value="Receptionist">Receptionist</MenuItem>
                  </TextField>
                  <Button type="submit" sx={buttonStyle}>Create Account</Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardContent>
                <VpnKey sx={iconTopStyle} />  
                <Typography variant="h5" sx={cardTitleStyle}>Activate</Typography>
                {accountError && <Typography sx={errorStyle}>{accountError}</Typography>}
                <form onSubmit={handleAccountAction} style={{ marginTop: "10px" }}>
                  <TextField 
                    label="Email" 
                    type="email"
                    value={accountEmail} 
                    onChange={(e) => setAccountEmail(e.target.value)} 
                    fullWidth 
                    sx={inputStyle}
                  />
                  <Button type="submit" sx={buttonStyle}>
                    Activate Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

const headerStyle = {
  fontWeight: "bold",
  color: "#1E3A8A",
  mb: 3,
  textAlign: "center",
};

const cardStyle = {
  background: "linear-gradient(135deg, #ffffff, #f0f2f5)",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
  padding: "24px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
};

const cardTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#1E3A8A",
  textAlign: "center",
  marginBottom: "15px",
};

const inputStyle = {
  marginBottom: "16px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
};

const buttonStyle = {
  marginTop: "10px",
  width: "100%",
  background: "linear-gradient(45deg, #3498db, #2c3e50) !important",
  color: "#fff",
  fontWeight: "bold",
  padding: "10px",
  borderRadius: "8px",
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(45deg, #2980b9, #1c2833) !important",
  },
};

const iconTopStyle = {
  fontSize: "50px",
  display: "block",
  margin: "0 auto 10px auto",
  color: "#3498db",
};

const errorStyle = {
  color: "red",
  fontSize: "0.9rem",
  textAlign: "center",
  marginBottom: "10px",
};

export default UserManagement;
