const pgp = require("pg-promise")();
const dotenv = require("dotenv");

dotenv.config();

const connection = {
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 30,
};

const db = pgp(connection);

module.exports = db;
