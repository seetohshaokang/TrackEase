const express = require("express");
const mongoose = require("mongoose");
const app = require("./app");
<<<<<<< HEAD
const dotenv = require("dotenv").config({ path: "../config.env" });
=======
const dotenv = require("dotenv").config({ path: "../.env" });
>>>>>>> origin/main

const port = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected sucessfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
