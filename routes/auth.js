const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require("../middleware/verifyToken");

const dbService = require("../services/dbService");
const statusCodes = require("../services/statusCodeService");
const validationService = require("../services/validationService");

const router = express.Router();

router.post("/register", auth("admin"), async (req, res) => {
  const { username, email, password, is_admin } = req.body;

  const { error } = validationService.validateRegistration(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).send({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "SELECT * \
      FROM users \
      WHERE email = $1",
      [req.body.email]
    );
    if (!_.isEmpty(result))
      return res.status(statusCodes.sc_400.code).json({
        status: statusCodes.sc_400.code,
        details: "email is already registered",
      });
  } catch (error) {
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: "something went wrong",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const result = await dbService.any(
      "INSERT INTO users (username, email, password, is_admin) \
      VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, is_admin]
    );
    res.json({
      status: 200,
      details: `registered user with email: ${result[0].email}`,
    });
  } catch (error) {
    res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: "something went wrong",
    });
  }
});

router.post("/login", async (req, res) => {
  const { error } = validationService.validateLogin(req.body);
  if (error)
    return res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: error.details[0].message,
    });

  try {
    const result = await dbService.any(
      "SELECT * \
      FROM users \
      WHERE email = $1",
      [req.body.email]
    );
    if (_.isEmpty(result))
      return res.status(statusCodes.sc_400.code).json({
        status: statusCodes.sc_400.code,
        details: "email does not exist",
      });

    const validPassword = await bcrypt.compare(
      req.body.password,
      result[0].password
    );
    if (!validPassword)
      return res.status(statusCodes.sc_400.code).json({
        status: statusCodes.sc_400.code,
        details: "incorrect password",
      });
    const token = jwt.sign(
      { user_id: result[0].user_id, is_admin: result[0].is_admin },
      process.env.PRIVATE_KEY
    );
    res.header("auth-token", token).json({ status: 200, details: "logged in" });
  } catch (error) {
    res.status(statusCodes.sc_400.code).json({
      status: statusCodes.sc_400.code,
      details: "something went wrong",
    });
  }
});

module.exports = router;
