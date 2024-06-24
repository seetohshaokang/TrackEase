const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { credential } = require("firebase-admin");
//const authRoutes = require("./routes/authRoutes");

const app = express();

const corsOptions = {
  allowedHeaders: ["Content-Type", "Authorization", "Google-Token"],
  credentials: true,

  origin: ["http://localhost:3000", "http://localhost:8000", "https://track-ease-api.vercel.app"],

  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
};

app.use(cors(corsOptions)); // limit the links later
app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/events", eventRoutes);
//app.use("/api/auth", authRoutes);

module.exports = app;
