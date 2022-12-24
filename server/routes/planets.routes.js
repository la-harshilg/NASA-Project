const express = require("express");
const { httpgetAllPlanets } = require("./planets.controller");
const planetRouter = express.Router();

planetRouter.get("/", httpgetAllPlanets);

module.exports = planetRouter;
