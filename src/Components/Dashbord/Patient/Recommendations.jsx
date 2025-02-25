import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  EventNote,
  Comment,
  Feedback,
  Assignment,
  MedicalServices,
  CheckCircle,
  Schedule,
  LocalHospital
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';

const Recommendations = () => {
  const navigate = useNavigate();

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard/patient', 
      icon: <Dashboard />,
      onClick: () => navigate('/dashboard/patient')
    },
    { 
      label: 'Request Advice', 
      path: '/dashboard/patient/request-advice', 
      icon: <MedicalServices />,
      onClick: () => navigate('/dashboard/patient/request-advice')
    },
    { 
      label: 'Add Appointment', 
      path: '/dashboard/patient/add-appointment', 
      icon: <EventNote />,
      onClick: () => navigate('/dashboard/patient/add-appointment')
    },
    { 
      label: 'View Recommendations', 
      path: '/dashboard/patient/recommendations', 
      icon: <Assignment />,
      onClick: () => navigate('/dashboard/patient/recommendations')
    },
    { 
      label: 'Give Feedback', 
      path: '/dashboard/patient/feedback', 
      icon: <Feedback />,
      onClick: () => navigate('/dashboard/patient/feedback')
    }
  ];

  const recommendations = [
    {
      id: 1,
      doctor: 'Dr. Abebe',
      date: '2024-12-15',
      type: 'Medication',
      status: 'Active',
      description: 'Take Amoxicillin 500mg twice daily for 7 days',
      notes: 'Take with food to avoid stomach upset'
    },
    {
      id: 2,
      doctor: 'Dr. Liya',
      date: '2024-12-10',
      type: 'Exercise',
      status: 'Active',
      description: '30 minutes of moderate walking daily',
      notes: 'Best done in the morning or evening'
    },
    {
      id: 3,
      doctor: 'Dr. Bahru',
      date: '2024-12-05',
      type: 'Diet',
      status: 'Active',
      description: 'Low sodium diet recommended',
      notes: 'Avoid processed foods and add more fresh vegetables'
    }
  ];

  return (
    <DashboardLayout menuItems={menuItems} title="Patient Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Medical Recommendations
      </Typography>

      <Grid container spacing={3}>
        {recommendations.map((rec) => (
          <Grid item xs={12} key={rec.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      {rec.type}
                      <Chip
                        label={rec.status}
                        color="primary"
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <LocalHospital />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Doctor"
                          secondary={rec.doctor}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <Schedule />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Date"
                          secondary={rec.date}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Recommendation"
                          secondary={rec.description}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <Comment />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Additional Notes"
                          secondary={rec.notes}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
};

export default Recommendations; 