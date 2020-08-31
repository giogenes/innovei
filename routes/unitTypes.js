const express = require("express");
const { foreignKeyExists } = require("./common/routeFunctions");
const _ = require("lodash");

const auth = require("../middleware/verifyToken");
const verifyId = require("../middleware/verifyId");

const dbService = require("../services/dbService");
const validationService = require("../services/validationService");
const { statusCodeJSON } = require("../services/statusCodeService");

const router = express.Router();

router.get("/", auth("user"), async (req, res) => {
  try {
    const data = await dbService.task((task) => {
      return dbService
        .map("SELECT * FROM unit_types", [], async (unit_type) => {
          const manufacturer = await dbService.one("SELECT * FROM manufacturers WHERE id = $1", [
            unit_type.manufacturer_id,
          ]);
          delete unit_type.manufacturer_id;
          unit_type.manufacturer = manufacturer;
          return unit_type;
        })
        .then(task.batch)
        .catch((error) => {
          res.status(500).json(statusCodeJSON(500));
        });
    });
    res.send(data);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.get("/:id", auth("user"), verifyId, async (req, res) => {
  try {
    const data = await dbService.task((task) => {
      return dbService
        .map("SELECT * FROM unit_types WHERE id = $1", [req.params.id], async (unit_type) => {
          const manufacturer = await dbService.one("SELECT * FROM manufacturers WHERE id = $1", [
            unit_type.manufacturer_id,
          ]);
          delete unit_type.manufacturer_id;
          unit_type.manufacturer = manufacturer;
          return unit_type;
        })
        .then(task.batch)
        .catch((error) => {
          res.status(500).json(statusCodeJSON(500));
        });
    });
    res.send(data);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.post("/", auth("user"), async (req, res) => {
  const { name, pn, manufacturer_id, description } = req.body;
  const { error } = validationService.validateUnitTypes(req.body);
  if (error) return res.status(400).json(statusCodeJSON(400, error.details[0].message));

  if (!foreignKeyExists(res, manufacturer_id, "manufacturers"))
    return res.status(404).json(statusCodeJSON(404, `manufacturer with id ${manufacturer_id} does not exist`));

  try {
    const result = await dbService.any(
      "INSERT INTO unit_types (name, pn, manufacturer_id, description) \
      VALUES ($1, $2, $3, $4) \
      RETURNING *",
      [name, pn, manufacturer_id, description]
    );
    res.json(result);
  } catch (e) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.put("/:id", auth("user"), verifyId, async (req, res) => {
  const { name, pn, manufacturer_id, description } = req.body;
  const { error } = validationService.validateUnitTypes(req.body);
  if (error) return res.status(400).json(statusCodeJSON(400, error.details[0].message));

  if (!foreignKeyExists(res, manufacturer_id, "manufacturers"))
    return res.status(404).json(statusCodeJSON(404, `manufacturer with id ${manufacturer_id} does not exist`));

  try {
    const result = await dbService.any(
      "UPDATE unit_types \
      SET name = $1, pn = $2, manufacturer_id = $3, description = $4 \
      WHERE id = $5 \
      RETURNING *",
      [name, pn, manufacturer_id, description, req.params.id]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

router.delete("/:id", auth("admin"), verifyId, async (req, res) => {
  try {
    const result = await dbService.any("DELETE FROM unit_types \
      WHERE id = $1 \
      RETURNING *", [
      req.params.id,
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json(statusCodeJSON(500));
  }
});

module.exports = router;
