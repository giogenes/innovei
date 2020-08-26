const express = require("express");
const _ = require("lodash");

const dbService = require("../services/dbService");
const errorCodes = require("../services/errorCodeService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await dbService.any(
      "SELECT unit_type_id, unit_name, part_number, manufacturer_name, unit_description FROM unit_types INNER JOIN manufacturers ON unit_types.manufacturer_id = manufacturers.manufacturer_id"
    );
    res.json(result);
  } catch (e) {
    res
      .status(418)
      .json({ status: "Error 418 - Something Went Wrong", details: e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await dbService.any(
      "SELECT unit_type_id, unit_name, part_number, manufacturer_name, unit_description FROM unit_types INNER JOIN manufacturers ON unit_types.manufacturer_id = manufacturers.manufacturer_id"
    );
    res.json(result);
  } catch (e) {
    res.status(500).json({ status: errorCodes.ec_500, details: e });
  }
});

router.post("/", async (req, res) => {
  const {
    unit_name,
    part_number,
    manufacturer_id,
    unit_description,
  } = req.body;
  try {
    try {
      const result = await dbService.any(
        "SELECT * FROM manufacturers WHERE manufacturer_id = $1",
        [manufacturer_id]
      );
      if (_.isEmpty(result))
        res.status(404).json({
          status: errorCodes.ec_404,
          details: `unit with id: ${manufacturer_id} not found`,
        });
    } catch (error) {
      res.status(500).json({
        status: errorCodes.ec_500,
        details: e,
      });
    }
    const result = await dbService.any(
      "INSERT INTO unit_types (unit_name, part_number, manufacturer_id, unit_description) VALUES ($1, $2, $3, $4) RETURNING *",
      [unit_name, part_number, manufacturer_id, unit_description]
    );
    res.json(result);
  } catch (e) {
    res.status(400).json({ status: errorCodes.ec_400, details: e });
  }
});

router.put("/:id", async (req, res) => {
  const {
    unit_name,
    part_number,
    manufacturer_id,
    unit_description,
  } = req.body;
  try {
    try {
      const result = await dbService.any(
        "SELECT * FROM manufacturers WHERE manufacturer_id = $1",
        [manufacturer_id]
      );
      if (_.isEmpty(result))
        res.status(404).json({
          status: errorCodes.ec_404,
          details: `unit with id: ${manufacturer_id} not found`,
        });
    } catch (error) {
      res.status(500).json({
        status: errorCodes.ec_500,
        details: error,
      });
    }
    const result = await dbService.any(
      "UPDATE unit_types SET unit_name = $1, part_number = $2, manufacturer_id = $3, unit_description = $4 WHERE unit_type_id = $5 RETURNING *",
      [unit_name, part_number, manufacturer_id, unit_description, req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ status: errorCodes.ec_400, details: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await dbService.any(
      "DELETE FROM unit_types WHERE unit_type_id = $1 RETURNING *",
      [req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ status: errorCodes.ec_400, details: error });
  }
});

module.exports = router;
