const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dbService = require("../services/dbService");
const errorCodes = require("../services/errorCodeService");
const validationService = require("../services/validationService");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password, is_admin } = req.body;

  const { error } = validationService.validateRegistration(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    const result = await dbService.any("SELECT * FROM users WHERE email = $1", [
      req.body.email,
    ]);
    if (!_.isEmpty(result))
      return res.status(400).send("email is already registered");
  } catch (error) {
    res.status(400).send("something went wrong");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log(hashedPassword);

  try {
    const result = await dbService.any(
      "INSERT INTO users (username, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, is_admin]
    );
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { error } = validationService.validateLogin(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    const result = await dbService.any("SELECT * FROM users WHERE email = $1", [
      req.body.email,
    ]);
    if (_.isEmpty(result)) return res.status(400).send("email does not exist");

    const validPassword = await bcrypt.compare(
      req.body.password,
      result[0].password
    );
    if (!validPassword) return res.status(400).send("incorrect password");
    const token = jwt.sign({ _id: result[0].user_id }, process.env.PRIVATE_KEY);
    res.header("auth-token", token).send("logged in");
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

module.exports = router;
