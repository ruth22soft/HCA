import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountCircle, Settings, People, VerifiedUser, Person, LocalHospital, PersonOutline, ExitToApp, Dashboard, CalendarToday, Assessment } from '@mui/icons-material';
import { Card, CardContent, Typography, Grid, ListItemIcon, ListItemText } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../DasboardLayout';
import '../Admin/AdminD.css';
import { useAuth } from '../../Auth/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
    }
  ];

  const totalUsers = 253;
  const activatedAccounts = 120;
  const totalAdmins = 10;
  const totalReceptionists = 3;
  const totalPhysicians = 30;
  const totalPatients = 90;

  const data = [
    { name: 'Admins', value: totalAdmins },
    { name: 'Receptionists', value: totalReceptionists },
    { name: 'Physicians', value: totalPhysicians },
    { name: 'Patients', value: totalPatients },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <DashboardLayout menuItems={menuItems} title="Admin Portal">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <Grid container spacing={4}>
        {[
          { title: 'Total Users', value: totalUsers, icon: <People />, color: 'primary' },
          { title: 'Activated Accounts', value: activatedAccounts, icon: <VerifiedUser />, color: 'secondary' },
          { title: 'Total Admins', value: totalAdmins, icon: <Person />, color: 'primary' },
          { title: 'Total Receptionists', value: totalReceptionists, icon: <PersonOutline />, color: 'secondary' },
          { title: 'Total Physicians', value: totalPhysicians, icon: <LocalHospital />, color: 'primary' },
          { title: 'Total Patients', value: totalPatients, icon: <PersonOutline />, color: 'secondary' },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="card">
              <CardContent className="card-content">
                {React.cloneElement(item.icon, { fontSize: 'large', color: item.color })}
                <div>
                  <Typography variant="h5">{item.title}</Typography>
                  <Typography variant="h4">{item.value}</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Card className="chart-card">
            <CardContent>
              <Typography variant="h5" className="chart-title">
                User Type Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <defs>
                    <linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0088FE" />
                      <stop offset="100%" stopColor="#0056b3" />
                    </linearGradient>
                    <linearGradient id="color2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00C49F" />
                      <stop offset="100%" stopColor="#007d65" />
                    </linearGradient>
                    <linearGradient id="color3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFBB28" />
                      <stop offset="100%" stopColor="#D19E00" />
                    </linearGradient>
                    <linearGradient id="color4" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF8042" />
                      <stop offset="100%" stopColor="#B94E1B" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#color${index + 1})`} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default AdminDashboard;