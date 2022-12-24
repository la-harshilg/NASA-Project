const http = require("http");
const app = require("./app");
const { mongoConnect } = require("./services/mongo");

const { listhabitable } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startserver() {
  await mongoConnect();
  await listhabitable();
  await loadLaunchesData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.......`);
  });
}

startserver();
