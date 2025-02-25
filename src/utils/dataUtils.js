import data from '../data/data.json';

export const getPatientById = (id) => {
  return data.patients.find(patient => patient.id === id);
};

export const getPhysicianById = (id) => {
  return data.physicians.find(physician => physician.id === id);
};

export const getAllPatients = () => {
  return data.patients;
};

export const getAllPhysicians = () => {
  return data.physicians;
};

export const getAppointmentsByPatientId = (patientId) => {
  return data.appointments.filter(apt => apt.patientId === patientId);
};

export const getAppointmentsByPhysicianId = (physicianId) => {
  return data.appointments.filter(apt => apt.physicianId === physicianId);
}; 