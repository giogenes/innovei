const express = require("express");
const { foreignKeyExists } = require("./common/routeFunctions");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const validationService = require("../services/validationService");
const { statusCodeJSON } = require("../services/statusCodeService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const data = await dbService.task(async (task) => {
      return task
        .map("SELECT * FROM tickets", [], async (ticket) => {
          const ticket_type = await task.one("SELECT * FROM ticket_types WHERE id = $1", [ticket.ticket_type_id]);
          const customer = await task.one("SELECT * FROM customers WHERE id = $1", [ticket.customer_id]);
          delete ticket.customer_id;
          delete ticket.ticket_type_id;
          ticket.ticket_type = ticket_type;
          ticket.customer = customer;
          return ticket;
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
    const data = await dbService.task(async (task) => {
      return task
        .map("SELECT * FROM tickets WHERE id = $1", [req.params.id], async (ticket) => {
          const ticket_type = await task.one("SELECT * FROM ticket_types WHERE id = $1", [ticket.ticket_type_id]);
          const customer = await task.one("SELECT * FROM customers WHERE id = $1", [ticket.customer_id]);
          delete ticket.customer_id;
          delete ticket.ticket_type_id;
          ticket.ticket_type = ticket_type;
          ticket.customer = customer;
          return ticket;
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
  const { name, ticket_type_id, customer_id } = req.body;
  const { error } = validationService.validateTickets(req.body);

  if (error) return res.status(400).json(statusCodeJSON(400, error.details[0].message));

  if (!(await foreignKeyExists(res, ticket_type_id, "ticket_types")))
    return res.status(404).json(statusCodeJSON(404, `ticket type with id ${ticket_type_id} not found`));
  if (!(await foreignKeyExists(res, customer_id, "customers")))
    return res.status(404).json(statusCodeJSON(404, `customer with id ${customer_id} not found`));

  try {
    const result = await dbService.any(
      "INSERT INTO tickets (name, ticket_type_id, customer_id) \
      VALUES ($1, $2, $3) RETURNING *",
      [name, ticket_type_id, customer_id]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.put("/:id", verifyId, auth("user"), async (req, res) => {
  const { name, ticket_type_id, customer_id } = req.body;
  const { error } = validationService.validateTickets(req.body);

  if (error) return res.status(400).json(statusCodeJSON(400, error.details[0].message));

  if (!(await foreignKeyExists(res, ticket_type_id, "ticket_types")))
    return res.status(404).json(statusCodeJSON(404, `ticket type with id ${ticket_type_id} not found`));
  if (!(await foreignKeyExists(res, customer_id, "customers")))
    return res.status(404).json(statusCodeJSON(404, `customer with id ${customer_id} not found`));

  try {
    const result = await dbService.any(
      "UPDATE tickets \
      SET name = $1, ticket_type_id = $2, customer_id = $3 \
      WHERE id = $4 \
      RETURNING *",
      [name, ticket_type_id, customer_id, req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.delete("/:id", verifyId, auth("admin"), async (req, res) => {
  try {
    const result = await dbService.any("DELETE FROM tickets \
      WHERE id = $1 \
      RETURNING *", [req.params.id]);
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

module.exports = router;
