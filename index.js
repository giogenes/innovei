const express = require("express");

const manufacturers = require("./routes/manufacturers.js");
const locations = require("./routes/locations");
const ticketTypes = require("./routes/ticketTypes");
const customers = require("./routes/customers");
const pallets = require("./routes/pallets");
const unitTypes = require("./routes/unitTypes");
const tickets = require("./routes/tickets");
const units = require("./routes/units");

const auth = require("./routes/auth");

const dbSerive = require("./services/dbService");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/manufacturers", manufacturers);
app.use("/api/locations", locations);
app.use("/api/pallets", pallets);
app.use("/api/customers", customers);
app.use("/api/unit-types", unitTypes);
app.use("/api/ticket-types", ticketTypes);
app.use("/api/tickets", tickets);
app.use("/api/units", units);
app.use("/api/users", auth);

app.get("/", (req, res) => {
  res.send(
    "<h1>Innovei Technologies Web Application API v0.1.0</h1></br><p>Please visit /api/item to get started</p>"
  );
});

app.get("/api", (req, res) => {
  res.json({
    status: 200,
    detials:
      "Innovei Technologies Web Application API v0.1.0, please visit /api/item to get started",
  });
});

dbSerive
  .connect()
  .then(function (obj) {
    console.log("successfully connected to PostgreSQL server");
    obj.done();
  })
  .catch(function (error) {
    console.log("could not connect to PostgreSQL server");
  });

app.listen(PORT, () => console.log(`backend service started on port ${PORT}`));
