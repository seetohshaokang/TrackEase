const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

const corsOptions = {
  allowedHeaders: ["Content-Type", "Authorization", "Google-Token"],
  credentials: true,
  origin: [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://track-ease-mauve.vercel.app",
  ],
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
};

app.use(cors(corsOptions)); // limit the links later
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Server is up and running!");
});

app.use("/api/tasks", taskRoutes);
app.use("/api/events", eventRoutes);
//app.use("/api/auth", authRoutes);

module.exports = app;
