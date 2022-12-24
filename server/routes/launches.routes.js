const express = require("express");
const {
  httpgetAllLaunches,
  httpAddnewlaunch,
  httpAbortlaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpgetAllLaunches);
launchesRouter.post("/", httpAddnewlaunch);
launchesRouter.delete("/:id", httpAbortlaunch);

module.exports = launchesRouter;
