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

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/snippets").then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use("/snippets", snippetRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});