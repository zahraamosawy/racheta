//visit router
const express = require("express");
const router = express.Router();
const {
  addVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
} = require("../controllers/visit.controller");

// 🔹 POST /visit/add
router.post("/", async (req, res) => {
  try {
    const visit = await addVisit(req.body);
    res.json(visit);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 GET /visit
router.get("/", async (req, res) => {
  try {
    const visits = await getVisits();
    res.json(visits);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 GET /visit/:id
router.get("/:id", async (req, res) => {
  try {
    const visit = await getVisitById(req.params.id);
    res.json(visit);
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
});

// 🔹 PUT /visit/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await updateVisit(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 DELETE /visit/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteVisit(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
