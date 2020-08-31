const express = require("express");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const validationService = require("../services/validationService");
const { statusCodeJSON } = require("../services/statusCodeService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * FROM customers");
    res.json(result);
  } catch (e) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.get("/:id", verifyId, auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * \
      FROM customers \
      WHERE id = $1", [req.params.id]);
    res.json(result);
  } catch (e) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.post("/", auth("admin"), async (req, res) => {
  const { name, email, phone, address1, address2, city, state, zipcode, country } = req.body;
  const { error } = validationService.validateCustomers(req.body);
  if (error) return res.status(500).json(statusCodeJSON(500, error.details[0].message));

  try {
    const result = await dbService.any(
      "INSERT INTO customers \
    (name, email, phone, address1, address2, \
    city, state, zipcode, country) \
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [name, email, phone, address1, address2, city, state, zipcode, country]
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(statusCodeJSON(500));
  }
});

router.put("/:id", verifyId, auth("admin"), async (req, res) => {
  const { name, email, phone, address1, address2, city, state, zipcode, country } = req.body;
  const { error } = validationService.validateCustomers(req.body);
  if (error) return res.status(500).json(statusCodeJSON(500, error.details[0].message));

  try {
    const result = await dbService.any(
      "UPDATE customers SET name = $1, email = $2, phone = $3, address1 = $4, \
      address2 = $5, city = $6, state = $7, zipcode = $8, country = $9 \
      WHERE id = $10 \
      RETURNING *",
      [name, email, phone, address1, address2, city, state, zipcode, country, req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.delete("/:id", verifyId, auth("admin"), async (req, res) => {
  try {
    const result = await dbService.any("DELETE FROM customers \
      WHERE id = $1 \
      RETURNING *", [
      req.params.id,
    ]);
    res.json(result);
  } catch (e) {
    res.status(500).json(statusCodeJSON(500));
  }
});

module.exports = router;
