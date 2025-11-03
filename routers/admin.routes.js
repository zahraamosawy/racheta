//admin router
const express = require("express");
const router = express.Router();
const { createOtp, verifyOtp } = require("../controllers/admin.controller.js");
const prisma = require("../db");


// 🔹 POST /admin/otp → إنشاء OTP
router.post("/otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone is required" });
    const result = await createOtp(phone);
    res.json(result);
  } catch (err) {
    console.error("Error creating OTP:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 POST /admin/verify → التحقق من OTP
router.post("/verify", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ success: false, message: "Phone and OTP are required" });

    const result = await verifyOtp(phone, otp);
    res.json(result);
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 GET /admin → جلب كل المدراء
router.get("/", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.json(admins);
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 GET /admin/:id → جلب مدير حسب ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await prisma.admin.findUnique({ where: { id: String(id) } });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error("Error fetching admin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 POST /admin/add → إضافة مدير جديد (يدوي)
router.post("/", async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone is required" });
    
    // Check if admin with this phone already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { phone }
    });
    
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin with this phone already exists" });
    }
    
    const admin = await prisma.admin.create({
      data: { name, phone },
    });
    res.json(admin);
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 DELETE /admin/:id → حذف مدير
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Check if admin exists
    const admin = await prisma.admin.findUnique({ where: { id: String(id) } });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    
    await prisma.admin.delete({ where: { id: String(id) } });
    res.json({ success: true, message: "Admin deleted" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
