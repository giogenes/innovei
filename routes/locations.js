const express = require("express");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const statusCodes = require("../services/statusCodeService");
const validationService = require("../services/validationService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * FROM locations");
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
      "SELECT * \
      FROM locations \
      WHERE location_id = $1",
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

module.exports = router;
