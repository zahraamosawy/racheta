//drugs router
const express = require("express");
const {
  getAllDrugs,
  getDrugsById,
  insertDrug,
  deleteDrug,
  UpdateDrug,
} = require("../controllers/drugs.controller");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let list = await getAllDrugs();
    res.json(list)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    let one = await getDrugsById(req.params.id);
    if (!one) {
      return res.status(404).json({ error: "Drug not found" });
    }
    res.json(one);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    let result = await insertDrug(body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    let result = await UpdateDrug(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ error: "Drug not found" });
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let result = await deleteDrug(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Drug not found" });
    }
    res.json({ message: "Drug deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
