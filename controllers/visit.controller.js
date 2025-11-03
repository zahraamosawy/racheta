//isit controller
const prisma = require("../db");

// 🔹 إضافة زيارة جديدة
const addVisit = async (data) => {
  try {
    // Validate input
    if (!data.patientId) {
      throw new Error("Patient ID is required");
    }
    
    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: String(data.patientId) }
    });
    
    if (!patient) {
      throw new Error("Patient not found");
    }
    
    const visit = await prisma.visit.create({
      data,
    });
    return visit;
  } catch (error) {
    console.error("Error creating visit:", error);
    throw error;
  }
};

// 🔹 جلب جميع الزيارات
const getVisits = async () => {
  try {
    const visits = await prisma.visit.findMany({
      include: {
        patient: true, // لعرض معلومات المريض المرتبطة إن وجدت
      },
    });
    return visits;
  } catch (error) {
    console.error("Error fetching visits:", error);
    throw new Error("Failed to fetch visits");
  }
};

// 🔹 جلب زيارة حسب ID
const getVisitById = async (id) => {
  const visit = await prisma.visit.findUnique({
    where: { id: String(id) },
    include: { patient: true },
  });
  if (!visit) throw new Error("Visit not found");
  return visit;
};

// 🔹 تعديل بيانات زيارة
const updateVisit = async (id, data) => {
  try {
    // Check if visit exists
    const existingVisit = await prisma.visit.findUnique({
      where: { id: String(id) },
    });
    
    if (!existingVisit) {
      throw new Error("Visit not found");
    }
    
    // If updating patientId, check if patient exists
    if (data.patientId) {
      const patient = await prisma.patient.findUnique({
        where: { id: String(data.patientId) }
      });
      
      if (!patient) {
        throw new Error("Patient not found");
      }
    }
    
    const updated = await prisma.visit.update({
      where: { id: String(id) },
      data,
    });
    return updated;
  } catch (error) {
    console.error("Error updating visit:", error);
    throw error;
  }
};

// 🔹 حذف زيارة
const deleteVisit = async (id) => {
  try {
    // Check if visit exists
    const existingVisit = await prisma.visit.findUnique({
      where: { id: String(id) },
    });
    
    if (!existingVisit) {
      throw new Error("Visit not found");
    }
    
    await prisma.visit.delete({ where: { id: String(id) } });
    return { success: true, message: "Visit deleted" };
  } catch (error) {
    console.error("Error deleting visit:", error);
    throw error;
  }
};

module.exports = {
  addVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
};
