const request = require("supertest");
const app = require("../app");

describe("Testing GET /launches", () => {
  test("GET /launches should return 200.", async () => {
    const response = await request(app).get("/launches");
    expect(response.statusCode).toBe(200);
  });
});

describe("Testing POST /launches", () => {
  const completeLaunchDate = {
    mission: "IND ISRO 1",
    rocket: "Chandrayan 1",
    target: "Kepler-442 b",
    launchDate: "July 22, 2025",
  };

  const launchDatawithoutdate = {
    mission: "IND ISRO 1",
    rocket: "Chandrayan 1",
    target: "Kepler-442 b",
  };

  test("POST /launches should return 201.", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchDate)
      .expect("Content-type", /json/)
      .expect(201);
    // expect(response.statusCode).toBe(201);

    const requestDate = new Date(completeLaunchDate.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(launchDatawithoutdate);
  });

  test("It should catch the missing properties.", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDatawithoutdate)
      .expect("Content-type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });
});
