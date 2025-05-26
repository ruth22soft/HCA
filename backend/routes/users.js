import express from 'express';
import auth from '../middleware/auth.js';
import {
  updateAccountStatus,
  getAllUsers,
  updateUser,
  deleteUser,
  changePassword,
  getUserStats
} from '../controllers/userController.js';

const router = express.Router();

// User stats for dashboard (Admin only)
router.get('/stats', auth, getUserStats);

// Update user account status (Admin only)
router.put('/update-status', auth, updateAccountStatus);

// Get all users (Admin only)
router.get('/', auth, getAllUsers);

// Update user info (Admin only)
router.put('/:id', auth, updateUser);

// Delete user (Admin only)
router.delete('/:id', auth, deleteUser);

// Change password (for logged-in user)
router.put('/change-password', auth, changePassword);

export default router; 