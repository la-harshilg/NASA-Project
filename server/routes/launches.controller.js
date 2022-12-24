const {
  schedulenewlaunch,
  launchexists,
  getAllLaunches,
  abortlaunch,
} = require("../models/launches.model");

async function httpgetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddnewlaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch Date",
    });
  }
  await schedulenewlaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortlaunch(req, res) {
  const launchId = Number(req.params.id);

  if (await !launchexists(launchId)) {
    res.status(404).json({
      error: "Launch not found.",
    });
  }

  const aborted = await abortlaunch(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  httpgetAllLaunches,
  httpAddnewlaunch,
  httpAbortlaunch,
};
