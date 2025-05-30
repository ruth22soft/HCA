// @ts-nocheck
import express from 'express';
import Appointment from '../models/appointment.model.js';
import User from '../models/user.model.js';
import { validateTimeSlot, isWithinBusinessHours } from '../utils/timeUtils.js';

/**
 * Create a new appointment
 */
export const createAppointment = async (req, res) => {
  try {
    const { patientId, physicianId, appointmentDate, timeSlot, reason } = req.body;

    // Validate time slot format
    if (!validateTimeSlot(timeSlot)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time slot format. Please use HH:MM format (e.g., 09:00)'
      });
    }

    // Check if time slot is within business hours
    if (!isWithinBusinessHours(timeSlot)) {
      return res.status(400).json({
        success: false,
        message: 'Appointments are only available during business hours (9:00 AM - 5:00 PM)'
      });
    }

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      physicianId,
      appointmentDate,
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const appointment = new Appointment({
      patientId,
      physicianId,
      appointmentDate,
      timeSlot,
      reason
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all appointments (for admin/physician)
 */
export const getAllAppointments = async (req, res) => {
  try {
    const { role } = req.user;
    let query = {};

    // If user is a physician, only show their appointments
    if (role === 'physician') {
      query.physicianId = req.user.fullName;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'fullName email')
      .populate('physicianId', 'fullName email')
      .sort({ appointmentDate: 1, timeSlot: 1 });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error in getAllAppointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get appointments for a specific patient
 */
export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;
    
    const appointments = await Appointment.find({ patientId })
      .populate('physicianId', 'fullName email')
      .sort({ appointmentDate: 1, timeSlot: 1 });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error in getPatientAppointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient appointments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get a single appointment by ID
 */
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'fullName email')
      .populate('physicianId', 'fullName email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has permission to view this appointment
    if (req.user.role !== 'admin' && 
        req.user.role !== 'physician' && 
        appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error in getAppointmentById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update appointment status
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { timeSlot, status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Only admin and physician can update status
    if (req.user.role !== 'admin' && req.user.role !== 'physician') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update appointment status'
      });
    }

    // If physician, can only update their own appointments
    if (req.user.role === 'physician' && appointment.physicianId !== req.user.fullName) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    if (timeSlot) {
      // Validate time slot format
      if (!validateTimeSlot(timeSlot)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid time slot format. Please use HH:MM format (e.g., 09:00)'
        });
      }

      // Check if time slot is within business hours
      if (!isWithinBusinessHours(timeSlot)) {
        return res.status(400).json({
          success: false,
          message: 'Appointments are only available during business hours (9:00 AM - 5:00 PM)'
        });
      }

      // Check if the new time slot is available
      const existingAppointment = await Appointment.findOne({
        physicianId: req.body.physicianId,
        appointmentDate: req.body.appointmentDate,
        timeSlot,
        status: { $ne: 'cancelled' },
        _id: { $ne: req.params.id }
      });

      if (existingAppointment) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked'
        });
      }
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: updatedAppointment
    });
  } catch (error) {
    console.error('Error in updateAppointmentStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Cancel an appointment
 */
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('patientId', 'fullName email')
     .populate('physicianId', 'fullName email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has permission to cancel
    if (req.user.role !== 'admin' && 
        appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment'
      });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error in cancelAppointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get available time slots for a specific date and doctor
 */
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, physicianId } = req.query;

    if (!date || !physicianId) {
      return res.status(400).json({
        success: false,
        message: 'Date and physicianId are required'
      });
    }

    // Get all booked appointments for the date
    const bookedAppointments = await Appointment.find({
      physicianId,
      appointmentDate: date,
      status: { $ne: 'cancelled' }
    }).select('timeSlot');

    // Generate all possible time slots
    const allTimeSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      allTimeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      allTimeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    // Filter out booked time slots
    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    console.error('Error in getAvailableTimeSlots:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available time slots',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 