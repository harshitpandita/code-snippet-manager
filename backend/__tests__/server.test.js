const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");

let mongoServer;

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri) {
    // Use a real MongoDB (e.g., from docker-compose) when provided.
    await mongoose.connect(mongoUri);
  } else {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

test("GET /health returns OK", async () => {
  const res = await request(app).get("/health");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("status", "OK");
});

test("POST /snippets and GET /snippets", async () => {
  const snippet = {
    title: "Test Snippet",
    language: "JavaScript",
    code: "console.log('hi');",
  };

  const postRes = await request(app).post("/snippets").send(snippet);
  expect(postRes.status).toBe(200);
  expect(postRes.body).toHaveProperty("_id");
  expect(postRes.body).toMatchObject({
    title: snippet.title,
    language: snippet.language,
    code: snippet.code,
  });

  const getRes = await request(app).get("/snippets");
  expect(getRes.status).toBe(200);
  expect(Array.isArray(getRes.body)).toBe(true);
  expect(getRes.body.length).toBeGreaterThanOrEqual(1);
});
