const express = require("express");
const _ = require("lodash");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const statusCodes = require("../services/statusCodeService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const result = await dbService.any(
      "SELECT unit_type_id, unit_name, part_number, manufacturer_name, unit_description \
      FROM unit_types \
      INNER JOIN manufacturers \
      ON unit_types.manufacturer_id = manufacturers.manufacturer_id"
    );
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_400).json({
      status: statusCodes.sc_400,
      details: "something went wrong",
    });
  }
});

router.get("/:id", auth("user"), verifyId, async (req, res) => {
  try {
    const result = await dbService.any(
      "SELECT unit_type_id, unit_name, part_number, manufacturer_name, unit_description \
      FROM unit_types \
      INNER JOIN manufacturers \
      ON unit_types.manufacturer_id = manufacturers.manufacturer_id WHERE unit_type_id = $1",
      [req.params.id]
    );
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_400).json({
      status: statusCodes.sc_400,
      details: "something went wrong",
    });
  }
});

router.post("/", auth("admin"), async (req, res) => {
  const {
    unit_name,
    part_number,
    manufacturer_id,
    unit_description,
  } = req.body;
  try {
    try {
      const result = await dbService.any(
        "SELECT * \
        FROM manufacturers \
        WHERE manufacturer_id = $1",
        [manufacturer_id]
      );
      if (_.isEmpty(result))
        res.status(statusCodes.sc_404).json({
          status: statusCodes.sc_404,
          details: `unit with id: ${manufacturer_id} not found`,
        });
    } catch (error) {
      res.status(statusCodes.sc_400).json({
        status: statusCodes.sc_400,
        details: "something went wrong",
      });
    }
    const result = await dbService.any(
      "INSERT INTO unit_types (unit_name, part_number, manufacturer_id, unit_description) \
      VALUES ($1, $2, $3, $4) \
      RETURNING *",
      [unit_name, part_number, manufacturer_id, unit_description]
    );
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_400).json({
      status: statusCodes.sc_400,
      details: "something went wrong",
    });
  }
});

router.put("/:id", auth("admin"), verifyId, async (req, res) => {
  const {
    unit_name,
    part_number,
    manufacturer_id,
    unit_description,
  } = req.body;
  try {
    try {
      const result = await dbService.any(
        "SELECT * \
        FROM manufacturers \
        WHERE manufacturer_id = $1",
        [manufacturer_id]
      );
      if (_.isEmpty(result))
        res.status(statusCodes.sc_404).json({
          status: statusCodes.sc_404,
          details: `unit with id: ${manufacturer_id} not found`,
        });
    } catch (error) {
      res.status(statusCodes.sc_400).json({
        status: statusCodes.sc_400,
        details: "something went wrong",
      });
    }
    const result = await dbService.any(
      "UPDATE unit_types \
      SET unit_name = $1, part_number = $2, manufacturer_id = $3, unit_description = $4 \
      WHERE unit_type_id = $5 \
      RETURNING *",
      [unit_name, part_number, manufacturer_id, unit_description, req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(statusCodes.sc_400).json({
      status: statusCodes.sc_400,
      details: "something went wrong",
    });
  }
});

router.delete("/:id", auth("admin"), verifyId, async (req, res) => {
  try {
    const result = await dbService.any(
      "DELETE FROM unit_types \
      WHERE unit_type_id = $1 \
      RETURNING *",
      [req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(statusCodes.sc_400).json({
      status: statusCodes.sc_400,
      details: "something went wrong",
    });
  }
});

module.exports = router;
