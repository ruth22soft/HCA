import express from 'express';
import { createPatientReport } from '../controllers/patientreport.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Create a new patient report (physician or admin)
router.post('/', authenticate, authorize(['physician', 'admin']), createPatientReport);

export default router; 