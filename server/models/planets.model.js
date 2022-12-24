const { parse } = require("csv-parse");
const fs = require("fs");

const planets = require("./planets.mongo");

// Checking Habitable Planet
function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

// Fetching data from kepler
function listhabitable() {
  return new Promise((resolve, reject) => {
    fs.createReadStream("././data/kepler_data.csv")
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitable(data)) {
          savePlanets(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countplanets = (await getAllPlanets()).length;
        console.log(`${countplanets} habitable planets are found.`);
        resolve();
      });
  });
}

// Getting All Planets
async function getAllPlanets() {
  return await planets.find({});
}

// Saving Habitable Planets
async function savePlanets(planet) {
  try {
    return await planets.updateOne(
      {
        kepler_name: planet.kepler_name,
      },
      {
        kepler_name: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.log(`Planet not added : ${err}`);
  }
}

// Exports
module.exports = {
  listhabitable,
  getAllPlanets,
};
