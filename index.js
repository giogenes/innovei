const express = require("express");
const manufacturers = require("./routes/manufacturers.js");
const unitTypes = require("./routes/unitTypes");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api/manufacturers", manufacturers);
app.use("/api/unit-types", unitTypes);

app.get("/", (req, res) => {
  res.send(
    "<h1>Innovei Technologies Web Application API v0.1.0</h1></br><p>Please visit /api/item to get started</p>"
  );
});

app.listen(PORT, () => console.log(`backend service started on port ${PORT}`));
