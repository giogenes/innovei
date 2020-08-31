const express = require("express");
const { foreignKeyExists } = require("./common/routeFunctions");
const _ = require("lodash");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const { statusCodeJSON } = require("../services/statusCodeService");
const validationService = require("../services/validationService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const data = await dbService.task((task) => {
      return task
        .map("SELECT * FROM units", [], async (unit) => {
          const unit_type = await task.one("SELECT * FROM unit_types WHERE id = $1", unit.unit_type_id);
          const manufacturer = await task.one("SELECT * FROM manufacturers WHERE id = $1", unit_type.manufacturer_id);
          const ticket = await task.one("SELECT * FROM tickets WHERE id = $1", unit.ticket_id);
          const ticket_type = await task.one("SELECT * FROM ticket_types WHERE id = $1", ticket.ticket_type_id);
          const customer = await task.one("SELECT * FROM customers WHERE id = $1", ticket.customer_id);
          const pallet = await task.one("SELECT * FROM pallets WHERE id = $1", unit.pallet_id);
          const location = await task.one("SELECT * FROM locations WHERE id = $1", unit.location_id);

          delete unit.unit_type_id;
          delete unit_type.manufacturer_id;
          delete unit.ticket_id;
          delete ticket.ticket_type_id;
          delete ticket.customer_id;
          delete unit.pallet_id;
          delete unit.location_id;

          unit_type.manufacturer = manufacturer;
          unit.unit_type = unit_type;

          ticket.ticket_type = ticket_type;
          ticket.customer = customer;

          unit.ticket = ticket;
          unit.pallet = pallet;
          unit.location = location;
          return unit;
        })
        .then(task.batch)
        .catch((error) => {
          res.status(500).json(statusCodeJSON(500));
        });
    });
    res.json(data);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.get("/:id", verifyId, auth("user"), async (req, res) => {
  try {
    const data = await dbService.task((task) => {
      return task
        .map("SELECT * FROM units WHERE id = $1", req.params.id, async (unit) => {
          const unit_type = await task.one("SELECT * FROM unit_types WHERE id = $1", unit.unit_type_id);
          const manufacturer = await task.one("SELECT * FROM manufacturers WHERE id = $1", unit_type.manufacturer_id);
          const ticket = await task.one("SELECT * FROM tickets WHERE id = $1", unit.ticket_id);
          const ticket_type = await task.one("SELECT * FROM ticket_types WHERE id = $1", ticket.ticket_type_id);
          const customer = await task.one("SELECT * FROM customers WHERE id = $1", ticket.customer_id);
          const pallet = await task.one("SELECT * FROM pallets WHERE id = $1", unit.pallet_id);
          const location = await task.one("SELECT * FROM locations WHERE id = $1", unit.location_id);

          delete unit.unit_type_id;
          delete unit_type.manufacturer_id;
          delete unit.ticket_id;
          delete ticket.ticket_type_id;
          delete ticket.customer_id;
          delete unit.pallet_id;
          delete unit.location_id;

          unit_type.manufacturer = manufacturer;
          unit.unit_type = unit_type;

          ticket.ticket_type = ticket_type;
          ticket.customer = customer;

          unit.ticket = ticket;
          unit.pallet = pallet;
          unit.location = location;
          return unit;
        })
        .then(task.batch)
        .catch((error) => {
          res.status(500).json(statusCodeJSON(500));
        });
    });
    res.json(data);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.post("/", auth("user"), async (req, res) => {
  const { sn, unit_type_id, ticket_id, pallet_id, location_id } = req.body;
  const { error } = validationService.validateUnits(req.body);
  if (error) return res.status(404).json(statusCodeJSON(404, error.details[0].message));

  if (!(await foreignKeyExists(res, unit_type_id, "unit_types")))
    return res.status(400).json(statusCodeJSON(400, `unit type with id ${unit_type_id} does not exit`));
  if (!(await foreignKeyExists(res, ticket_id, "tickets")))
    return res.status(400).json(statusCodeJSON(400, `ticket with id ${ticket_id} does not exit`));
  if (!(await foreignKeyExists(res, pallet_id, "pallets")))
    return res.status(400).json(statusCodeJSON(400, `pallet with id ${pallet_id} does not exit`));
  if (!(await foreignKeyExists(res, location_id, "locations")))
    return res.status(400).json(statusCodeJSON(400, `location with id ${location_id} does not exit`));

  try {
    const result = await dbService.any(
      "INSERT INTO units (sn, unit_type_id, ticket_id, pallet_id, location_id) \
      VALUES ($1, $2, $3, $4, $5) \
      RETURNING *",
      [sn, unit_type_id, ticket_id, pallet_id, location_id]
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json(statusCodes.statusCodeJSON(500));
  }
});

router.put("/:id", verifyId, auth("user"), async (req, res) => {
  const { sn, unit_type_id, ticket_id, pallet_id, location_id } = req.body;
  const { error } = validationService.validateUnits(req.body);
  if (error) return res.status(404).json(statusCodeJSON(404, error.details[0].message));

  if (!(await foreignKeyExists(res, unit_type_id, "unit_types")))
    return res.status(400).json(statusCodeJSON(400, `unit type with id ${unit_type_id} does not exit`));
  if (!(await foreignKeyExists(res, ticket_id, "tickets")))
    return res.status(400).json(statusCodeJSON(400, `ticket with id ${ticket_id} does not exit`));
  if (!(await foreignKeyExists(res, pallet_id, "pallets")))
    return res.status(400).json(statusCodeJSON(400, `pallet with id ${pallet_id} does not exit`));
  if (!(await foreignKeyExists(res, location_id, "locations")))
    return res.status(400).json(statusCodeJSON(400, `location with id ${location_id} does not exit`));

  try {
    const result = await dbService.any(
      "UPDATE units \
      SET sn = $1, unit_type_id = $2, ticket_id = $3, pallet_id = $4, location_id = $5 \
      WHERE id = $6 \
      RETURNING *",
      [sn, unit_type_id, ticket_id, pallet_id, location_id, req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodes.statusCodeJSON(500));
  }
});

router.delete("/:id", verifyId, auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("DELETE FROM units \
      WHERE id = $1 \
      RETURNING *", [req.params.id]);
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodes.statusCodeJSON(500));
  }
});

module.exports = router;
