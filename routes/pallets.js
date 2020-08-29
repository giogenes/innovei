const express = require("express");
const _ = require("lodash");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const statusCodes = require("../services/statusCodeService");
const validationService = require("../services/validationService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * FROM pallets");
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }
});

router.get("/:id", verifyId, auth("user"), async (req, res) => {
  try {
    const result = await dbService.any(
      "SELECT * \
      FROM pallets \
      WHERE pallet_id = $1",
      [req.params.id]
    );
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }
});

router.post("/", auth("admin"), async (req, res) => {
  const { pallet_name, bay, pallet_description } = req.body;
  const { error } = validationService.validatePallets(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "SELECT * \
    FROM pallets \
    WHERE bay = $1",
      [bay]
    );

    if (!_.isEmpty(result))
      return res.status(statusCodes.sc_400.code).json({
        status: statusCodes.sc_400.code,
        details: "this bay is already in use",
      });
  } catch (error) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }

  try {
    const result = await dbService.any(
      "INSERT INTO pallets (pallet_name, bay, pallet_description) \
      VALUES ($1, $2, $3) RETURNING *",
      [pallet_name, bay, pallet_description]
    );
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }
});

router.put("/:id", verifyId, auth("admin"), async (req, res) => {
  const { pallet_name, bay, pallet_description } = req.body;
  const { error } = validationService.validatePallets(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "SELECT * \
        FROM pallets \
        WHERE bay = $1",
      [bay]
    );
    if (!_.isEmpty(result) && result[0].pallet_id != req.params.id)
      return res.status(statusCodes.sc_400.code).json({
        status: statusCodes.sc_400.code,
        details: "this bay is already in use",
      });
  } catch (error) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }

  try {
    const result = await dbService.any(
      "UPDATE pallets \
      SET pallet_name = $1, bay = $2, pallet_description = $3 \
      WHERE pallet_id = $4 \
      RETURNING *",
      [pallet_name, bay, pallet_description, req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }
});

router.delete("/:id", verifyId, auth("admin"), async (req, res) => {
  try {
    const result = await dbService.any(
      "DELETE FROM pallets \
      WHERE pallet_id = $1 \
      RETURNING *",
      [req.params.id]
    );
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }
});

module.exports = router;
