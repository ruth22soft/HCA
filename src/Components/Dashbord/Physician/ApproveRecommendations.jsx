import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Divider,
  Box
} from '@mui/material';
import {
  Dashboard,
  Description,
  MedicalServices,
  CheckCircle,
  People,
  EventNote,
  Edit,
  ThumbUp,
  ThumbDown
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';

const ApproveRecommendations = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard/physician', 
      icon: <Dashboard />,
      onClick: () => navigate('/dashboard/physician')
    },
    { 
      label: 'Generate Report', 
      path: '/dashboard/physician/generate-report', 
      icon: <Description />,
      onClick: () => navigate('/dashboard/physician/generate-report')
    },
    { 
      label: 'Insert Advice', 
      path: '/dashboard/physician/insert-advice', 
      icon: <MedicalServices />,
      onClick: () => navigate('/dashboard/physician/insert-advice')
    },
    { 
      label: 'Approve Recommendations', 
      path: '/dashboard/physician/approve-recommendations', 
      icon: <CheckCircle />,
      onClick: () => navigate('/dashboard/physician/approve-recommendations')
    },
    { 
      label: 'View Patients', 
      path: '/dashboard/physician/view-patients', 
      icon: <People />,
      onClick: () => navigate('/dashboard/physician/view-patients')
    },
    { 
      label: 'View Appointments', 
      path: '/dashboard/physician/view-appointments', 
      icon: <EventNote />,
      onClick: () => navigate('/dashboard/physician/view-appointments')
    },
    { 
      label: 'Update Patient Data', 
      path: '/dashboard/physician/update-patient', 
      icon: <Edit />,
      onClick: () => navigate('/dashboard/physician/update-patient')
    }
  ];

  // Example recommendations data
  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      patientId: "P123",
      patientName: "Belay",
      type: "Medication",
      description: "Prescribe antibiotics for infection",
      status: "pending",
      date: "2024-12-20"
    },
    {
      id: 2,
      patientId: "P124",
      patientName: "Yohans",
      type: "Treatment",
      description: "Physical therapy sessions",
      status: "pending",
      date: "2024-12-21"
    }
  ]);

  const handleApprove = (id) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id ? {...rec, status: 'approved'} : rec
    ));
  };

  const handleReject = (id) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id ? {...rec, status: 'rejected'} : rec
    ));
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Physician Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Approve Recommendations
      </Typography>

      <Grid container spacing={3}>
        {recommendations.map((rec) => (
          <Grid item xs={12} key={rec.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" gutterBottom>
                      {rec.type}
                      <Chip
                        label={rec.status}
                        color={
                          rec.status === 'approved' ? 'success' : 
                          rec.status === 'rejected' ? 'error' : 
                          'default'
                        }
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      Date: {rec.date}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Patient ID"
                          secondary={rec.patientId}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Patient Name"
                          secondary={rec.patientName}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Description"
                          secondary={rec.description}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  {rec.status === 'pending' && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<ThumbUp />}
                          onClick={() => handleApprove(rec.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<ThumbDown />}
                          onClick={() => handleReject(rec.id)}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
};

export default ApproveRecommendations; 