const express = require("express");
const { columnValueExists } = require("./common/routeFunctions");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const validationService = require("../services/validationService");
const { statusCodeJSON } = require("../services/statusCodeService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * FROM pallets");
    res.json(result);
  } catch (e) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.get("/:id", verifyId, auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * \
      FROM pallets \
      WHERE pallet_id = $1", [req.params.id]);
    res.json(result);
  } catch (e) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.post("/", auth("user"), async (req, res) => {
  const { name, bay, description } = req.body;
  const { error } = validationService.validatePallets(req.body);
  if (error) return res.status(400).json(statusCodeJSON(400, error.details[0].message));

  if (await columnValueExists(res, req.body.bay, "bay", "pallets"))
    return res.status(400).json(statusCodeJSON(400, "bay already in use"));

  try {
    const result = await dbService.any(
      "INSERT INTO pallets (name, bay, description) \
      VALUES ($1, $2, $3) RETURNING *",
      [name, bay, description]
    );
    res.json(result);
  } catch (e) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.put("/:id", verifyId, auth("user"), async (req, res) => {
  const { name, bay, description } = req.body;
  const { error } = validationService.validatePallets(req.body);
  if (error) res.status(400).json(statusCodeJSON(400, error.details[0].message));

  if (await columnValueExists(res, req.body.bay, "bay", "pallets", req.params.id))
    return res.status(400).json(statusCodeJSON(400, "bay already in use"));

  try {
    const result = await dbService.any(
      "UPDATE pallets \
      SET name = $1, bay = $2, description = $3 \
      WHERE id = $4 \
      RETURNING *",
      [name, bay, description, req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.delete("/:id", verifyId, auth("admin"), async (req, res) => {
  try {
    const result = await dbService.any("DELETE FROM pallets \
      WHERE id = $1 \
      RETURNING *", [req.params.id]);
    res.json(result);
  } catch (e) {
    res.status(500).json(statusCodeJSON(500));
  }
});

module.exports = router;
