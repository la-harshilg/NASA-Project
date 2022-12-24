const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const planetRouter = require("./routes/planets.routes");
const launchesRouter = require("./routes/launches.routes");
const app = express();

app.use(cors());
app.use(morgan("short"));
app.use(express.json());
app.use(express.static("./public"));

app.use("/planets", planetRouter);
app.use("/launches", launchesRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
module.exports = app;
