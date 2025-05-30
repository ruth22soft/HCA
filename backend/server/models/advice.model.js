import mongoose from 'mongoose';
/**
 * @typedef {Object} IAdvice
 * @property {mongoose.Types.ObjectId} patientId - Reference to the patient
 * @property {('General Medicine'|'Blood Test'|'Diabetis Test'|'Cancer Test')} department
 * @property {string} subject 
 * @property {string} description 
 * @property {('Low'|'Normal'|'High'| 'Urgent')} urgencyLevel 
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const adviceSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: {
      values: ['General Medicine', 'Blood Test', 'Diabetis Test', 'Cancer Test'],
      message: 'Invalid department selected'
    }
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    minlength: [3, 'Subject must be at least 3 characters long']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  urgencyLevel: {
    type: String,
    required: [true, 'Urgency level is required'],
    enum: {
      values: ['Low', 'Normal', 'High', 'Urgent'],
      message: 'Invalid urgency level'
    },
    default: 'Normal'
  }
}, {
  timestamps: true
});

// Index for efficient querying
adviceSchema.index({ patientId: 1, createdAt: -1 });
adviceSchema.index({ department: 1, urgencyLevel: 1 });

/** @type {import('mongoose').Model<import('./advice.model').IAdvice>} */
const Advice = mongoose.model('Advice', adviceSchema);

export default Advice;