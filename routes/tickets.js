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
      "SELECT ticket_id, ticket_name, ticket_types.ticket_type_name, customers.customer_name, \
      customers.customer_email, customers.customer_phone, customers.customer_address_1, \
      customers.customer_address_2, customers.customer_city, customers.customer_state, \
      customers.customer_zip_code, customers.customer_country \
      FROM tickets \
      LEFT JOIN ticket_types \
      ON tickets.ticket_type_id = ticket_types.ticket_type_id \
      LEFT JOIN customers \
      ON tickets.customer_id = customers.customer_id"
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
      "SELECT ticket_id, ticket_name, ticket_types.ticket_type_name, customers.customer_name, \
      customers.customer_email, customers.customer_phone, customers.customer_address_1, \
      customers.customer_address_2, customers.customer_city, customers.customer_state, \
      customers.customer_zip_code, customers.customer_country \
      FROM tickets \
      LEFT JOIN ticket_types \
      ON tickets.ticket_type_id = ticket_types.ticket_type_id \
      LEFT JOIN customers \
      ON tickets.customer_id = customers.customer_id \
      WHERE ticket_id = $1",
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

router.post("/", auth("admin"), async (req, res) => {
  const { ticket_name, ticket_type_id, customer_id } = req.body;
  const { error } = validationService.validateTickets(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "SELECT * \
        FROM ticket_types \
        WHERE ticket_type_id = $1",
      [ticket_type_id]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_404.code).json({
        status: statusCodes.sc_404.code,
        details: `ticket type with id: ${ticket_type_id} not found`,
      });
  } catch (error) {
    return res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }

  try {
    const result = await dbService.any(
      "SELECT * \
        FROM customers \
        WHERE customer_id = $1",
      [customer_id]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_404.code).json({
        status: statusCodes.sc_404.code,
        details: `customer with id: ${customer_id} not found`,
      });
  } catch (error) {
    return res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }

  try {
    const result = await dbService.any(
      "INSERT INTO tickets (ticket_name, ticket_type_id, customer_id) \
      VALUES ($1, $2, $3) RETURNING *",
      [ticket_name, ticket_type_id, customer_id]
    );
    res.json(result);
  } catch (error) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }
});

router.put("/:id", verifyId, auth("admin"), async (req, res) => {
  const { ticket_name, ticket_type_id, customer_id } = req.body;
  const { error } = validationService.validateTickets(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "SELECT * \
            FROM ticket_types \
            WHERE ticket_type_id = $1",
      [ticket_type_id]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_404.code).json({
        status: statusCodes.sc_404.code,
        details: `ticket type with id: ${ticket_type_id} not found`,
      });
  } catch (error) {
    return res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }

  try {
    const result = await dbService.any(
      "SELECT * \
            FROM customers \
            WHERE customer_id = $1",
      [customer_id]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_404.code).json({
        status: statusCodes.sc_404.code,
        details: `customer with id: ${customer_id} not found`,
      });
  } catch (error) {
    return res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }

  try {
    const result = await dbService.any(
      "UPDATE tickets \
      SET ticket_name = $1, ticket_type_id = $2, customer_id = $3 \
      WHERE ticket_id = $4 \
      RETURNING *",
      [ticket_name, ticket_type_id, customer_id, req.params.id]
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
      "DELETE FROM tickets \
      WHERE ticket_id = $1 \
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
