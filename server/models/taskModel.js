const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deadline: { type: Date, required: true },
  remarks: { type: String },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  bookmarked: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  user_id: { type: String, required: true }, // Firebase UID
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
