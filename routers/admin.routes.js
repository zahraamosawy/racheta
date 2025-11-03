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
    res.status(500).json({ success: false, message: "Server error" });
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
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔹 GET /admin → جلب كل المدراء
router.get("/", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔹 GET /admin/:id → جلب مدير حسب ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await prisma.admin.findUnique({ where: { id: Number(id) } });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔹 POST /admin/add → إضافة مدير جديد (يدوي)
router.post("/", async (req, res) => {
  try {
    const { name, phone } = req.body;
    const admin = await prisma.admin.create({
      data: { name, phone },
    });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔹 DELETE /admin/:id → حذف مدير
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.admin.delete({ where: { id } });
    res.json({ success: true, message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
