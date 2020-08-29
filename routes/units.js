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
    const result = await dbService.any(
      "SELECT unit_id, serial_num, \
       unit_types.unit_name, unit_types.part_number, manufacturers.manufacturer_name, unit_types.unit_description, \
      tickets.ticket_name, ticket_types.ticket_type_name, \
      customer_name, customer_email, customer_phone, customer_address_1, customer_address_2, customer_city, \
      customer_state, customer_zip_code, customer_country, \
      pallet_name, bay, pallet_description, \
      location_name, super_location_id, next_location_ids \
      FROM units \
      INNER JOIN unit_types \
        INNER JOIN manufacturers \
        ON unit_types.manufacturer_id = manufacturers.manufacturer_id \
      ON units.unit_type_id = unit_types.unit_type_id \
      INNER JOIN tickets \
        INNER JOIN ticket_types \
        ON tickets.ticket_type_id = ticket_types.ticket_type_id \
        INNER JOIN customers \
        ON tickets.customer_id = customers.customer_id \
      ON units.ticket_id = tickets.ticket_id \
      INNER JOIN pallets \
      ON units.pallet_id = pallets.pallet_id \
      INNER JOIN locations \
      ON units.location_id = locations.location_id"
    );
    res.json(result);
  } catch (error) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }
});

router.get("/:id", verifyId, auth("user"), async (req, res) => {
  try {
    const result = await dbService.any(
      "SELECT unit_id, serial_num, \
        unit_types.unit_name, unit_types.part_number, manufacturers.manufacturer_name, unit_types.unit_description, \
        tickets.ticket_name, ticket_types.ticket_type_name, \
        customer_name, customer_email, customer_phone, customer_address_1, customer_address_2, customer_city, \
        customer_state, customer_zip_code, customer_country, \
        pallet_name, bay, pallet_description, \
        location_name, super_location_id, next_location_ids \
        FROM units \
        INNER JOIN unit_types \
          INNER JOIN manufacturers \
          ON unit_types.manufacturer_id = manufacturers.manufacturer_id \
        ON units.unit_type_id = unit_types.unit_type_id \
        INNER JOIN tickets \
          INNER JOIN ticket_types \
          ON tickets.ticket_type_id = ticket_types.ticket_type_id \
          INNER JOIN customers \
          on tickets.customer_id = customers.customer_id \
        ON units.ticket_id = tickets.ticket_id \
        INNER JOIN pallets \
        ON units.pallet_id = pallets.pallet_id \
        INNER JOIN locations \
        ON units.location_id = locations.location_id \
        WHERE unit_id = $1",
      [req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(statusCodes.sc_404.code).json({
      status: statusCodes.sc_404.code,
      details: statusCodes.sc_404.defaultMessage,
    });
  }
});

router.post("/", auth("user"), async (req, res) => {
  const {
    serial_num,
    unit_type_id,
    ticket_id,
    pallet_id,
    location_id,
  } = req.body;
  const { error } = validationService.validateUnits(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "SELECT * \
            FROM unit_types \
            WHERE unit_type_id = $1",
      [unit_type_id]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_404.code).json({
        status: statusCodes.sc_404.code,
        details: `unit type with id: ${unit_type_id} not found`,
      });
  } catch (error) {
    return res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details:
        statusCodes.sc_500.defaultMessage + " - Not able to check unit type id",
    });
  }

  try {
    const result = await dbService.any(
      "SELECT * \
            FROM tickets \
            WHERE ticket_id = $1",
      [ticket_id]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_404.code).json({
        status: statusCodes.sc_404.code,
        details: `ticket with id: ${ticket_id} not found`,
      });
  } catch (error) {
    return res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details:
        statusCodes.sc_500.defaultMessage + " - Not able to check ticket id",
    });
  }

  try {
    const result = await dbService.any(
      "SELECT * \
            FROM pallets \
            WHERE pallet_id = $1",
      [pallet_id]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_404.code).json({
        status: statusCodes.sc_404.code,
        details: `pallet with id: ${pallet_id} not found`,
      });
  } catch (error) {
    return res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details:
        statusCodes.sc_500.defaultMessage + " - Not able to check pallet id",
    });
  }

  try {
    const result = await dbService.any(
      "SELECT * \
            FROM locations \
            WHERE location_id = $1",
      [location_id]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_404.code).json({
        status: statusCodes.sc_404.code,
        details: `location with id: ${location_id} not found`,
      });
  } catch (error) {
    return res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details:
        statusCodes.sc_500.defaultMessage + " - Not able to check location id",
    });
  }

  try {
    const result = await dbService.any(
      "INSERT INTO units (serial_num, unit_type_id, ticket_id, pallet_id, location_id) \
      VALUES ($1, $2, $3, $4, $5) \
      RETURNING *",
      [serial_num, unit_type_id, ticket_id, pallet_id, location_id]
    );
    res.json(result);
  } catch (error) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: error, //statusCodes.sc_500.defaultMessage + " - not able to POST",
    });
  }
});

router.put("/:id", verifyId, auth("user"), async (req, res) => {
  const {
    serial_num,
    unit_type_id,
    ticket_id,
    pallet_id,
    location_id,
  } = req.body;
  const { error } = validationService.validateUnits(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "SELECT * \
                FROM unit_types \
                WHERE unit_type_id = $1",
      [unit_type_id]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_404.code).json({
        status: statusCodes.sc_404.code,
        details: `unit type with id: ${unit_type_id} not found`,
      });
  } catch (error) {
    return res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details:
        statusCodes.sc_500.defaultMessage + " - Not able to check unit type id",
    });
  }

  try {
    const result = await dbService.any(
      "SELECT * \
                FROM tickets \
                WHERE ticket_id = $1",
      [ticket_id]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_404.code).json({
        status: statusCodes.sc_404.code,
        details: `ticket with id: ${ticket_id} not found`,
      });
  } catch (error) {
    return res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details:
        statusCodes.sc_500.defaultMessage + " - Not able to check ticket id",
    });
  }

  try {
    const result = await dbService.any(
      "SELECT * \
                FROM pallets \
                WHERE pallet_id = $1",
      [pallet_id]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_404.code).json({
        status: statusCodes.sc_404.code,
        details: `pallet with id: ${pallet_id} not found`,
      });
  } catch (error) {
    return res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details:
        statusCodes.sc_500.defaultMessage + " - Not able to check pallet id",
    });
  }

  try {
    const result = await dbService.any(
      "SELECT * \
                FROM locations \
                WHERE location_id = $1",
      [location_id]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_404.code).json({
        status: statusCodes.sc_404.code,
        details: `location with id: ${location_id} not found`,
      });
  } catch (error) {
    return res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details:
        statusCodes.sc_500.defaultMessage + " - Not able to check location id",
    });
  }

  try {
    const result = await dbService.any(
      "UPDATE units \
      SET serial_num = $1, unit_type_id = $2, ticket_id = $3, pallet_id = $4, location_id = $5 \
      WHERE unit_id = $6 \
      RETURNING *",
      [
        serial_num,
        unit_type_id,
        ticket_id,
        pallet_id,
        location_id,
        req.params.id,
      ]
    );
    res.json(result);
  } catch (error) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage + " - not able to POST",
    });
  }
});

router.delete("/:id", verifyId, auth("user"), async (req, res) => {
  try {
    const result = await dbService.any(
      "DELETE FROM units \
      WHERE unit_id = $1 \
      RETURNING *",
      [req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }
});

module.exports = router;
