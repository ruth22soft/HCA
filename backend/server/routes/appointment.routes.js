// @ts-nocheck
import express from 'express';
import {
  createAppointment,
  getAllAppointments,
  getPatientAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableTimeSlots
} from '../controllers/appointment.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Patient routes
router.get('/patient', getPatientAppointments);
router.post('/', authorize('patient'), createAppointment);
router.get('/available-slots', getAvailableTimeSlots);

// Admin and physician routes
router.get('/', authorize(['admin', 'physician']), getAllAppointments);
router.get('/:id', authorize(['admin', 'physician']), getAppointmentById);
router.put('/:id/status', authorize(['admin', 'physician']), updateAppointmentStatus);

// Patient and admin can cancel appointments
router.put('/:id/cancel', authorize(['admin', 'patient']), cancelAppointment);

export default router; 