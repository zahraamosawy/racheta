//patien router
const express = require("express");
const {
  getAllPaitents,
  getPatientById,
  insertPatient,
  deletePatient,
  UpdatePatient,
} = require("../controllers/patient.controller");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let list = await getAllPaitents();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    let one = await getPatientById(req.params.id);
    if (!one) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(one);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    let result = await insertPatient(body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let result = await UpdatePatient(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ error: "patient not found" });
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let result = await deletePatient(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
