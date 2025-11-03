
//patient controller
const prisma = require("../db");

const getAllPaitents = async () => {
  try {
    let Patients = await prisma.Patient.findMany();
    return Patients;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw new Error("Failed to fetch patients");
  }
};

const getPatientById = async (id) => {
  try {
    let Patients = await prisma.Patient.findUnique({
      where: {
        id,
      },
    });
    return Patients;
  } catch (error) {
    console.error("Error fetching patient by ID:", error);
    throw new Error("Failed to fetch patient");
  }
};

const insertPatient = async (formData) => {
  try {
    let Patient = await prisma.Patient.create({
      data: formData,
    });
    return Patient;
  } catch (error) {
    console.error("Error creating patient:", error);
    throw new Error("Failed to create patient");
  }
};
const UpdatePatient = async (id, updateData) => {
  try {
    const patient = await prisma.Patient.update({
      where: {
        id,
      },
      data: updateData,
    });
    return patient;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw new Error('Failed to update patient');
  }
};


const deletePatient = async (id) => {
  try {
    // First check if the patient exists
    const existingPatient = await prisma.Patient.findUnique({
      where: {
        id,
      },
    });
    
    if (!existingPatient) {
      throw new Error("Patient not found");
    }
    
    // Check if the patient has any visits
    const patientVisits = await prisma.Visit.findMany({
      where: {
        patientId: id,
      },
    });
    
    if (patientVisits.length > 0) {
      throw new Error("Cannot delete patient with existing visits. Please delete all visits first.");
    }
    
    let Patient = await prisma.Patient.delete({
      where: {
        id,
      },
    });
    return Patient;
  } catch (error) {
    console.error("Error deleting patient:", error);
    // Handle specific database constraint errors
    if (error.code === 'P2002') {
      throw new Error("Cannot delete patient due to existing relationships");
    }
    throw error;
  }
};

module.exports = {
  getAllPaitents,
  getPatientById,
  insertPatient,
  deletePatient,
  UpdatePatient,
};
