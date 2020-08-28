const express = require("express");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const statusCodes = require("../services/statusCodeService");
const validationService = require("../services/validationService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * FROM manufacturers");
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: statusCodes.sc_400.defaultMessage,
    });
  }
});

router.get("/:id", verifyId, auth("user"), async (req, res) => {
  try {
    const result = await dbService.any(
      "SELECT * \
      FROM manufacturers \
      WHERE manufacturer_id = $1",
      [req.params.id]
    );
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_404.code).json({
      status: statusCodes.sc_404.code,
      details: statusCodes.sc_404.defaultMessage,
    });
  }
});

router.post("/", auth("admin"), async (req, res) => {
  const { error } = validationService.validateManufacturers(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "INSERT INTO manufacturers (manufacturer_name) \
      VALUES ($1) RETURNING *",
      [req.body.manufacturer_name]
    );
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: statusCodes.sc_400.defaultMessage,
    });
  }
});

router.put("/:id", verifyId, auth("admin"), async (req, res) => {
  const { error } = validationService.validateManufacturers(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "UPDATE manufacturers \
      SET manufacturer_name = $1 \
      WHERE manufacturer_id = $2 \
      RETURNING *",
      [req.body.manufacturer_name, req.params.id]
    );
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: statusCodes.sc_400.defaultMessage,
    });
  }
});

router.delete("/:id", verifyId, auth("admin"), async (req, res) => {
  try {
    const result = await dbService.any(
      "DELETE FROM manufacturers \
      WHERE manufacturer_id = $1 \
      RETURNING *",
      [req.params.id]
    );
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_404.code).json({
      status: statusCodes.sc_404.code,
      details: statusCodes.sc_404.defaultMessage,
    });
  }
});

module.exports = router;
