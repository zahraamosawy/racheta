//drugs controller
const prisma = require("../db");

const getAllDrugs = async () => {
  try {
    let drugs = await prisma.drugs.findMany();
    return drugs;
  } catch (error) {
    console.error("Error fetching drugs:", error);
    throw new Error("Failed to fetch drugs");
  }
};

const getDrugsById = async (id) => {
  try {
    let drugs = await prisma.drugs.findUnique({
      where: {
        id,
      },
    });
    return drugs;
  } catch (error) {
    console.error("Error fetching drug by ID:", error);
    throw new Error("Failed to fetch drug");
  }
};

const insertDrug = async (formData) => {
  try {
    // Validate input
    if (!formData || !formData.name || formData.name.trim() === '') {
      throw new Error("Drug name is required");
    }
    
    // Normalize drug name (trim whitespace)
    formData.name = formData.name.trim();
    
    // Check if drug with the same name already exists (case-insensitive)
    const existingDrug = await prisma.drugs.findFirst({
      where: {
        name: {
          equals: formData.name,
          mode: 'insensitive'
        }
      }
    });
    
    if (existingDrug) {
      throw new Error(`Drug with name "${formData.name}" already exists`);
    }
    
    let drugs = await prisma.drugs.create({
      data: formData,
    });
    return drugs;
  } catch (error) {
    console.error("Error creating drug:", error);
    // If it's a Prisma unique constraint error, provide a clearer message
    if (error.code === 'P2002') {
      throw new Error(`A drug with this name already exists in the database`);
    }
    throw error;
  }
};

const deleteDrug = async (id) => {
  try {
    // First check if the drug exists
    const existingDrug = await prisma.drugs.findUnique({
      where: {
        id,
      },
    });
    
    if (!existingDrug) {
      throw new Error("Drug not found");
    }
    
    let drugs = await prisma.drugs.delete({
      where: {
        id,
      },
    });
    return drugs;
  } catch (error) {
    console.error("Error deleting drug:", error);
    throw error;
  }
};

const UpdateDrug = async (id, updateData) => {
  try {
    // Check if drug exists
    const existingDrug = await prisma.drugs.findUnique({
      where: {
        id,
      },
    });
    
    if (!existingDrug) {
      throw new Error("Drug not found");
    }
    
    // If updating name, check for duplicates
    if (updateData.name && updateData.name !== existingDrug.name) {
      // Normalize drug name (trim whitespace)
      updateData.name = updateData.name.trim();
      
      // Check if another drug with this name exists (case-insensitive)
      const duplicateDrug = await prisma.drugs.findFirst({
        where: {
          name: {
            equals: updateData.name,
            mode: 'insensitive'
          },
          id: {
            not: id
          }
        }
      });
      
      if (duplicateDrug) {
        throw new Error(`Drug with name "${updateData.name}" already exists`);
      }
    }
    
    const drug = await prisma.drugs.update({
      where: {
        id,
      },
      data: updateData,
    });
    return drug;
  } catch (error) {
    console.error('Error updating drug:', error);
    // If it's a Prisma unique constraint error, provide a clearer message
    if (error.code === 'P2002') {
      throw new Error(`A drug with this name already exists in the database`);
    }
    throw error;
  }
};

// const updatedDrug = await updateDrug(1, {
//   name: "New Drug Name",
//   price: 99.99,
//   quantity: 100
// });


module.exports = {
  getAllDrugs,
  getDrugsById,
  insertDrug,
  deleteDrug,
  UpdateDrug ,
};
