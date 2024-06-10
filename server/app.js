const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
//const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
); // limit the links later
app.use(express.json());

app.use("/api/tasks", taskRoutes);
//app.use("/api/auth", authRoutes);

module.exports = app;
