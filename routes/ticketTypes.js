const express = require("express");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const validationService = require("../services/validationService");
const { statusCodeJSON } = require("../services/statusCodeService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * FROM ticket_types");
    res.json(result);
  } catch (e) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.get("/:id", verifyId, auth("user"), async (req, res) => {
  try {
    const result = await dbService.any("SELECT * \
      FROM ticket_types \
      WHERE id = $1", [req.params.id]);
    res.json(result);
  } catch (e) {
    res.status(500).json(statusCodeJSON(500));
  }
});

module.exports = router;
