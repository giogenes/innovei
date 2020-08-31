const express = require("express");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const validationService = require("../services/validationService");
const { statusCodeJSON } = require("../services/statusCodeService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * FROM manufacturers");
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.get("/:id", verifyId, auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * \
      FROM manufacturers \
      WHERE id = $1", [req.params.id]);
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.post("/", auth("admin"), async (req, res) => {
  const { error } = validationService.validateManufacturers(req.body);
  if (error) return res.status(400).json(statusCodeJSON(400, error.details[0].message));
  try {
    const result = await dbService.any("INSERT INTO manufacturers (name) \
        VALUES ($1) RETURNING *", [
      req.body.name,
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.put("/:id", verifyId, auth("admin"), async (req, res) => {
  const { error } = validationService.validateManufacturers(req.body);
  if (error) return res.status(400).json(statusCodeJSON(400, error.details[0].message));
  try {
    const result = await dbService.any(
      "UPDATE manufacturers \
      SET name = $1 \
      WHERE id = $2 \
      RETURNING *",
      [req.body.name, req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.delete("/:id", verifyId, auth("admin"), async (req, res) => {
  try {
    const result = await dbService.any("DELETE FROM manufacturers \
      WHERE id = $1 \
      RETURNING *", [
      req.params.id,
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

module.exports = router;
