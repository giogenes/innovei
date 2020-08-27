const express = require("express");

const auth = require("../middleware/verifyToken");

const dbService = require("../services/dbService");
const errorCodes = require("../services/errorCodeService");
const validationService = require("../services/validationService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await dbService.any("SELECT * FROM manufacturers");
    res.json(result);
  } catch (e) {
    res.status(500).json({ status: errorCodes.ec_500 });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await dbService.any(
      "SELECT * FROM manufacturers WHERE manufacturer_id = $1",
      [req.params.id]
    );
    res.json(result);
  } catch (e) {
    res.status(404).json({ status: errorCodes.ec_404 });
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validationService.validateManufacturers(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  try {
    const result = await dbService.any(
      "INSERT INTO manufacturers (manufacturer_name) VALUES ($1) RETURNING *",
      [req.body.manufacturer_name]
    );

    res.json(result);
  } catch (e) {
    res.status(400).json({ status: errorCodes.ec_400 });
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validationService.validateManufacturers(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  try {
    const result = await dbService.any(
      "UPDATE manufacturers SET manufacturer_name = $1 WHERE manufacturer_id = $2 RETURNING *",
      [req.body.manufacturer_name, req.params.id]
    );
    res.json(result);
  } catch (e) {
    res.status(400).json({ status: errorCodes.ec_400 });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await dbService.any(
      "DELETE FROM manufacturers WHERE manufacturer_id = $1 RETURNING *",
      [req.params.id]
    );
    res.json(result);
  } catch (e) {
    res.status(400).json({ status: errorCodes.ec_400 });
  }
});

module.exports = router;
