const express = require("express");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const statusCodes = require("../services/statusCodeService");
const validationService = require("../services/validationService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * FROM customers");
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
      FROM customers \
      WHERE customer_id = $1",
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
  const {
    customer_name,
    customer_email,
    customer_phone,
    customer_address_1,
    customer_address_2,
    customer_city,
    customer_state,
    customer_zip_code,
    customer_country,
  } = req.body;
  const { error } = validationService.validateCustomers(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "INSERT INTO customers \
    (customer_name, customer_email, customer_phone, customer_address_1, customer_address_2, \
    customer_city, customer_state, customer_zip_code, customer_country) \
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        customer_name,
        customer_email,
        customer_phone,
        customer_address_1,
        customer_address_2,
        customer_city,
        customer_state,
        customer_zip_code,
        customer_country,
      ]
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
  const {
    customer_name,
    customer_email,
    customer_phone,
    customer_address_1,
    customer_address_2,
    customer_city,
    customer_state,
    customer_zip_code,
    customer_country,
  } = req.body;
  const { error } = validationService.validateCustomers(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "UPDATE customers SET customer_name = $1, customer_email = $2, customer_phone = $3, customer_address_1 = $4, \
      customer_address_2 = $5, customer_city = $6, customer_state = $7, customer_zip_code = $8, customer_country = $9 \
      WHERE customer_id = $10 \
      RETURNING *",
      [
        customer_name,
        customer_email,
        customer_phone,
        customer_address_1,
        customer_address_2,
        customer_city,
        customer_state,
        customer_zip_code,
        customer_country,
        req.params.id,
      ]
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
      "DELETE FROM customers \
      WHERE customer_id = $1 \
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
