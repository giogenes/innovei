const express = require("express");
const dbService = require("../services/dbService");
const errorCodes = require("../services/errorCodeService");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await dbService.any("SELECT * FROM manufacturers");
    res.json(result);
  } catch (e) {
    res.status(500).json({ status: errorCodes.ec_500, details: e });
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
    res.status(404).json({ status: errorCodes.ec_404, details: e });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await dbService.any(
      "INSERT INTO manufacturers (manufacturer_name) VALUES ($1) RETURNING *",
      [req.body.manufacturer_name]
    );
    res.json(result);
  } catch (e) {
    res.status(400).json({ status: errorCodes.ec_400, details: e });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await dbService.any(
      "UPDATE manufacturers SET manufacturer_name = $1 WHERE manufacturer_id = $2",
      [req.body.manufacturer_name, req.params.id]
    );
    res.json({ status: "success" });
  } catch (e) {
    res.status(400).json({ status: errorCodes.ec_400, details: e });
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
    res.status(400).json({ status: errorCodes.ec_400, details: e });
  }
});

module.exports = router;
