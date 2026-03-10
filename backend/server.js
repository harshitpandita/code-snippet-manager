const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const snippetRoutes = require("./routes/snippets");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Code Snippet Manager API Running");
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from backend API" });
});

/* HEALTH CHECK ENDPOINT */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "snippet-backend",
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/snippets";

async function connectToMongo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error", err);
  }
}

// Only connect to Mongo when running the server directly (not when imported for tests)
if (require.main === module) {
  connectToMongo();
}

app.use("/snippets", snippetRoutes);

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
