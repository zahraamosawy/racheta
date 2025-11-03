//admin controller
const prisma = require("../db");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 🔹 توليد كود OTP عشوائي
function generateOtp(length = 6) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

// 🔹 إنشاء OTP
const createOtp = async (phone) => {
  // التحقق من وجود المدير مسبقاً أو إنشاؤه
  const admin = await prisma.admin.upsert({
    where: { phone },
    update: {},
    create: { phone },
  });

  const newOtp = generateOtp();

  // حفظ الـ OTP وتاريخ إنشائه
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      otp: newOtp,
      otpCreatedAt: dayjs().toISOString(),
    },
  });

  // بإمكانك هنا إرسال الـ OTP برسالة SMS إن رغبت
  console.log(`📲 OTP for ${phone}: ${newOtp}`);

  return { success: true, message: "OTP created successfully" };
};

// 🔹 التحقق من OTP
const verifyOtp = async (phone, otp) => {
  const admin = await prisma.admin.findUnique({ where: { phone } });
  if (!admin) return { success: false, message: "Admin not found" };

  // التحقق من تطابق OTP
  if (admin.otp !== otp)
    return { success: false, message: "Invalid OTP" };

  // التحقق من انتهاء صلاحية OTP (بعد 5 دقائق مثلاً)
  const otpAge = dayjs().diff(dayjs(admin.otpCreatedAt), "minute");
  if (otpAge > 5)
    return { success: false, message: "OTP expired" };

  // ✅ إنشاء Token بعد التحقق
  const token = jwt.sign(
    { id: admin.id, phone: admin.phone },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // تصفير الـ OTP بعد الاستخدام
  await prisma.admin.update({
    where: { id: admin.id },
    data: { otp: null, otpCreatedAt: null },
  });

  return { success: true, message: "OTP verified", token };
};

// 🔹 جلب جميع المدراء
const getAllAdmins = async () => {
  const admins = await prisma.admin.findMany();
  return admins;
};

// 🔹 جلب مدير حسب الـ ID
const getAdminById = async (id) => {
  const admin = await prisma.admin.findUnique({ where: { id: Number(id) } });
  if (!admin) throw new Error("Admin not found");
  return admin;
};

// 🔹 إضافة مدير جديد يدوياً
const addAdmin = async (name, phone) => {
  const admin = await prisma.admin.create({
    data: { name, phone },
  });
  return admin;
};

// 🔹 حذف مدير
const deleteAdmin = async (id) => {
  await prisma.admin.delete({ where: { id: Number(id) } });
  return { success: true, message: "Admin deleted" };
};

module.exports = {
  createOtp,
  verifyOtp,
  getAllAdmins,
  getAdminById,
  addAdmin,
  deleteAdmin,
};
