const pgp = require("pg-promise")();

const connection = {
  host: "localhost",
  port: 5432,
  database: "innovei",
  user: "postgres",
  password: "postgres",
  max: 30,
};

const db = pgp(connection);

module.exports = db;
