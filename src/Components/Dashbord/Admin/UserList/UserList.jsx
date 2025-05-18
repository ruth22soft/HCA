import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, Button, TextField, InputAdornment, IconButton, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { 
  Dashboard, Settings, ExitToApp, People, Search, Edit, Delete, Check, Block, Save, Cancel,
  Visibility, VisibilityOff
} from '@mui/icons-material';
import DashboardLayout from '../../DasboardLayout';
import { useAuth } from '../../../Auth/AuthContext';

const UserList = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit user dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    status: ''
  });
  
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Mock user data - in a real app, this would come from an API
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'Abebe Kebede', 
      email: 'abebe@example.com', 
      role: 'Admin', 
      status: 'Active',
      lastLogin: '2025-05-17 14:30'
    },
    { 
      id: 2, 
      name: 'Kebede Alemu', 
      email: 'kebede@example.com', 
      role: 'Physician', 
      status: 'Active',
      lastLogin: '2025-05-16 09:15'
    },
    { 
      id: 3, 
      name: 'Almaz Haile', 
      email: 'almaz@example.com', 
      role: 'Patient', 
      status: 'Inactive',
      lastLogin: '2025-05-10 11:45'
    },
    { 
      id: 4, 
      name: 'Tigist Bekele', 
      email: 'tigist@example.com', 
      role: 'Physician', 
      status: 'Active',
      lastLogin: '2025-05-17 16:20'
    },
    { 
      id: 5, 
      name: 'Yonas Tadesse', 
      email: 'yonas@example.com', 
      role: 'Patient', 
      status: 'Active',
      lastLogin: '2025-05-15 13:10'
    }
  ]);

  // Consistent menuItems structure
  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard/admin',
      icon: <Dashboard />,
      onClick: () => window.location.href = '/dashboard/admin'
    },
    { 
      label: 'User Management', 
      path: '/dashboard/admin/user-management', 
      icon: <People />,
      onClick: () => window.location.href = '/dashboard/admin/user-management'
    },
    { 
      label: 'User List', 
      path: '/dashboard/admin/user-list', 
      icon: <People />,
      onClick: () => window.location.href = '/dashboard/admin/user-list'
    },
    { 
      label: 'Settings', 
      path: '/dashboard/admin/settings', 
      icon: <Settings />,
      onClick: () => window.location.href = '/dashboard/admin/settings'
    },
    { 
      label: 'Logout', 
      path: '/login?user=admin', 
      icon: <ExitToApp />,
      onClick: () => {
        logout();
        window.location.href = '/login?user=admin';
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

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle user status change
  const handleStatusChange = (id, newStatus) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
  };

  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Open edit dialog
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      password: '', // Initialize with empty password
      role: user.role,
      status: user.status
    });
    setEditDialogOpen(true);
    setShowPassword(false); // Reset password visibility
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingUser(null);
  };

  // Handle form field changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Save edited user
  const handleSaveEdit = () => {
    if (editingUser) {
      // Validate required fields
      if (!editFormData.name || !editFormData.email) {
        alert('Name and email are required fields.');
        return;
      }

      // Update user in the list
      const updatedUsers = users.map(user => 
        user.id === editingUser.id ? 
        { ...user, 
          name: editFormData.name,
          email: editFormData.email,
          // Only update password if it was changed
          ...(editFormData.password ? { password: editFormData.password } : {}),
          role: editFormData.role,
          status: editFormData.status 
        } : user
      );
      
      setUsers(updatedUsers);
      handleCloseEditDialog();
      
      // Show success message (in a real app, you might use a snackbar)
      alert(`User ${editFormData.name} updated successfully!`);
    }
  };

  // Handle user deletion
  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Admin Portal">
      <div style={{ padding: '20px' }}>
        <Typography variant="h4" style={{ marginBottom: '20px' }}>
          User List
        </Typography>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <TextField
            variant="outlined"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '60%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/dashboard/admin/user-management')}
          >
            Add New User
          </Button>
        </div>

        <TableContainer component={Paper} style={{ marginTop: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>User</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Last Login</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar style={{ marginRight: '10px', backgroundColor: user.role === 'Admin' ? '#1976d2' : user.role === 'Physician' ? '#9c27b0' : '#2e7d32' }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={
                        user.role === 'Admin' ? 'primary' : 
                        user.role === 'Physician' ? 'secondary' : 
                        'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status} 
                      color={user.status === 'Active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit />
                      </IconButton>
                      {user.status === 'Active' ? (
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleStatusChange(user.id, 'Inactive')}
                        >
                          <Block />
                        </IconButton>
                      ) : (
                        <IconButton 
                          color="success" 
                          size="small"
                          onClick={() => handleStatusChange(user.id, 'Active')}
                        >
                          <Check />
                        </IconButton>
                      )}
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Edit style={{ marginRight: '10px' }} />
            Edit User
          </div>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name"
            name="name"
            value={editFormData.name}
            onChange={handleEditFormChange}
            fullWidth
            variant="outlined"
            style={{ marginBottom: '16px', marginTop: '16px' }}
          />
          <TextField
            margin="dense"
            label="Email Address"
            name="email"
            type="email"
            value={editFormData.email}
            onChange={handleEditFormChange}
            fullWidth
            variant="outlined"
            style={{ marginBottom: '16px' }}
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={editFormData.password}
            onChange={handleEditFormChange}
            fullWidth
            variant="outlined"
            style={{ marginBottom: '16px' }}
            placeholder="Enter new password (leave empty to keep current)"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              name="role"
              value={editFormData.role}
              onChange={handleEditFormChange}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Physician">Physician</MenuItem>
              <MenuItem value="Patient">Patient</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={editFormData.status}
              onChange={handleEditFormChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseEditDialog} 
            color="secondary"
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            color="primary"
            variant="contained"
            startIcon={<Save />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserList;
