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
    const pageSize = req.query.pageSize;
    const page = req.query.page;
    const LIMIT = pageSize && page ? pageSize : "ALL";
    const OFFSET = pageSize && page ? page * pageSize : 0;
    const result = await dbService.map(
      "SELECT units.id AS u_id, units.sn AS u_sn, \
      unit_types.id AS ut_id, unit_types.name AS ut_name, unit_types.pn AS ut_pn, manufacturers.id AS m_id, \
      manufacturers.name AS m_name, unit_types.description AS ut_desc, \
      tickets.id AS t_id, tickets.name AS t_name, ticket_types.id AS tt_id, ticket_types.name AS tt_name, \
      customers.id AS c_id, customers.name AS c_name, customers.email AS c_email, customers.phone AS c_phone, \
      customers.address1 AS c_add1, customers.address2 AS c_add2, customers.city AS c_city, \
      customers.state AS c_state, customers.zipcode AS c_zip, customers.country AS c_country, \
      pallets.id AS p_id, pallets.name AS p_name, bay AS p_bay, pallets.description AS p_desc, \
      locations.id AS l_id, locations.name AS l_name, super_id AS l_super_id, next_ids AS l_next_ids \
      FROM units \
      INNER JOIN unit_types \
        INNER JOIN manufacturers ON unit_types.manufacturer_id = manufacturers.id \
      ON units.unit_type_id = unit_types.id \
      INNER JOIN tickets \
        INNER JOIN ticket_types ON tickets.ticket_type_id = ticket_types.id \
        INNER JOIN customers ON tickets.customer_id = customers.id \
      ON units.ticket_id = tickets.id \
      INNER JOIN pallets ON units.pallet_id = pallets.id \
      INNER JOIN locations ON units.location_id = locations.id ORDER BY units.id LIMIT $1:raw OFFSET $2",
      [LIMIT, OFFSET],
      (unit) => {
        return {
          id: unit.u_id,
          sn: unit.u_sn,
          unit_type: {
            id: unit.ut_id,
            name: unit.ut_name,
            pn: unit.ut_pn,
            manufacturer: {
              id: unit.m_id,
              name: unit.m_name,
            },
            description: unit.ut_desc,
          },
          ticket: {
            id: unit.t_id,
            name: unit.t_name,
            ticket_type: {
              id: unit.tt_id,
              name: unit.tt_name,
            },
            customer: {
              id: unit.c_id,
              name: unit.c_name,
              email: unit.c_name,
              phone: unit.c_name,
              address1: unit.c_add1,
              address2: unit.c_add2,
              city: unit.c_city,
              state: unit.c_state,
              zipcode: unit.c_zip,
              country: unit.c_country,
            },
          },
          pallet: {
            id: unit.p_id,
            name: unit.p_name,
            bay: unit.p_bay,
            description: unit.p_desc,
          },
          location: {
            id: unit.l_id,
            name: unit.l_name,
            super_id: unit.l_super_id,
            next_ids: unit.l_super_ids,
          },
        };
      }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
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
