const axios = require("axios");
const { updateOne } = require("./launches.mongo");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const DEFAULT_FLIGHT_NUMBER = 100;

// Example launch
const launch = {
  flightNumber: DEFAULT_FLIGHT_NUMBER, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorer IS1", //rocket.name
  launchDate: new Date("December 25, 2025"), //date_local
  target: "Kepler-442 b", //not aaplicable
  customers: ["NASA", "ISRO"], //payload.customers
  upcoming: true, //upcoming
  success: true, //success
};

saveLaunch(launch);

const SPACEX_URL = "https://api.spacexdata.com/v5/launches/query";

async function loadLaunchesData() {
  console.log("Downloading Data......");
  const response = await axios.post(SPACEX_URL, {
    // headers: { "Accept-Encoding": "gzip,deflate,compress" },
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  // console.log(response.data.docs);

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
      // customers: [launchDoc["payloads"]["customers"]],
    };
    // console.log(`${launch.flightNumber} ${launch.mission}`);
    saveLaunch(launch);
  }
}

// Saving launch to Database
async function saveLaunch(launch) {
  return await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

// Scheduling Launch with all data
async function schedulenewlaunch(launch) {
  const planet = await planets.findOne({
    kepler_name: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found.");
  }

  const newFlightNumber = (await getlatestFlightnumber()) + 1;

  const newlaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["NASA", "ISRO"],
    flightNumber: newFlightNumber,
  });
  return await saveLaunch(newlaunch);
}

// Checking exists launch
async function launchexists(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
}

// Updating flightnumber
async function getlatestFlightnumber() {
  const latestlaunch = await launchesDatabase.findOne().sort("-flightNumber");
  if (!latestlaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestlaunch.flightNumber;
}

// Fetching all Launches
async function getAllLaunches() {
  return await launchesDatabase
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({ flightNumber: 1 });
}

async function abortlaunch(launchId) {
  return await launchesDatabase.updateOne(
    { flightNumber: launchId },
    {
      success: false,
      upcoming: false,
    }
  );

  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
}

module.exports = {
  loadLaunchesData,
  schedulenewlaunch,
  launchexists,
  getAllLaunches,
  abortlaunch,
};

// const launches = new Map();

// const launch = {
//   flightNumber: DEFAULT_FLIGHT_NUMBER,
//   mission: "Kepler Exploration X",
//   rocket: "Explorer IS1",
//   launchDate: new Date("December 25, 2025"),
//   target: "Kepler-442 b",
//   customers: ["NASA", "ISRO"],
//   upcoming: true,
//   success: true,
// };unction launchexists(launchId) {
//   return launches.has(launchId);
// }

// launches.set(launch.flightNumber, launch);

// Checking exists launch
// function launchexists(launchId) {
//   return launches.has(launchId);
// }

// function Addnewlaunch(launch) {
//   latestFlightnumber++;
//   launches.set(
//     latestFlightnumber,
//     Object.assign(launch, {
//       flightNumber: latestFlightnumber,
//       customers: ["NASA", "ISRO"],
//       upcoming: true,
//       success: true,
//     })
//   );
// }
