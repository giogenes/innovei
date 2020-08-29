const express = require("express");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const statusCodes = require("../services/statusCodeService");
const validationService = require("../services/validationService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * FROM ticket_types");
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
      FROM ticket_types \
      WHERE ticket_type_id = $1",
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
  const { error } = validationService.validateTicketTypes(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "INSERT INTO ticket_types (ticket_type_name) \
      VALUES ($1) RETURNING *",
      [req.body.ticket_type_name]
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
  const { error } = validationService.validateTicketTypes(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "UPDATE ticket_types \
      SET ticket_type_name = $1 \
      WHERE ticket_type_id = $2 \
      RETURNING *",
      [req.body.ticket_type_name, req.params.id]
    );
    res.json(result);
  } catch (e) {
    res.status(statusCodes.sc_500.code).json({
      status: statusCodes.sc_500.code,
      details: statusCodes.sc_500.defaultMessage,
    });
  }
});

router.delete("/:id", verifyId, auth("admin"), async (req, res) => {
  try {
    const result = await dbService.any(
      "DELETE FROM ticket_types \
      WHERE ticket_type_id = $1 \
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
