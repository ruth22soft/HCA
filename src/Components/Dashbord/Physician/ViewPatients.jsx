import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Dashboard,
  Description,
  MedicalServices,
  CheckCircle,
  People,
  EventNote,
  Edit,
  Visibility,
  LocalHospital
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';

const ViewPatients = () => {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Example patients data
  const patients = [
    {
      id: "P123",
      name: "Ab Doe",
      age: 45,
      gender: "Male",
      condition: "Diabetes",
      lastVisit: "2024-03-15",
      status: "Active",
      contact: "+1234567890",
      email: "john@example.com",
      address: "123 Main St, City",
      medicalHistory: [
        "Type 2 Diabetes diagnosed in 2020",
        "Hypertension",
        "Previous surgery in 2019"
      ],
      currentMedications: [
        "Metformin 500mg",
        "Lisinopril 10mg"
      ]
    },
    {
      id: "P124",
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      condition: "Asthma",
      lastVisit: "2024-03-18",
      status: "Active",
      contact: "+1234567891",
      email: "jane@example.com",
      address: "456 Oak St, City",
      medicalHistory: [
        "Asthma since childhood",
        "Seasonal allergies"
      ],
      currentMedications: [
        "Albuterol inhaler",
        "Fluticasone"
      ]
    }
  ];

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

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdatePatient = (patientId) => {
    navigate(`/dashboard/physician/update-patient`, { state: { patientId } });
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Physician Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        View Patients
      </Typography>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell>Last Visit</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.condition}</TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>
                      <Chip 
                        label={patient.status} 
                        color={patient.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(patient)}
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <Button
                        startIcon={<Edit />}
                        onClick={() => handleUpdatePatient(patient.id)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedPatient && (
          <>
            <DialogTitle>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <LocalHospital color="primary" />
                </Grid>
                <Grid item>
                  Patient Details - {selectedPatient.name}
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Patient ID" 
                        secondary={selectedPatient.id} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Contact" 
                        secondary={selectedPatient.contact} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Email" 
                        secondary={selectedPatient.email} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Address" 
                        secondary={selectedPatient.address} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Medical History
                  </Typography>
                  <List>
                    {selectedPatient.medicalHistory.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="h6" gutterBottom>
                    Current Medications
                  </Typography>
                  <List>
                    {selectedPatient.currentMedications.map((med, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={med} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                onClick={() => handleUpdatePatient(selectedPatient.id)}
                startIcon={<Edit />}
                variant="contained"
              >
                Update Patient
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default ViewPatients; 