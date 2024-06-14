const Task = require("./../models/taskModel");

// Method for user to get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user_id: req.user.uid });
    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    // console.log("tasks", found);
    res.json(tasks);
  } catch (error) {
    res.status(500).send("Error retrieving tasks");
  }
};

exports.createTask = async (req, res) => {
  // console.log(req);
  const { title, deadline, remarks, status } = req.body;
  const newTask = new Task({
    title,
    deadline,
    remarks,
    status: status || "pending", // Default status if not provided
    user_id: req.user.uid,
  });
  try {
    const savedTask = await newTask.save();
    console.log(savedTask.params._id);
    res.status(201).json(savedTask);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error saving task", error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  const { title, deadline, remarks, status } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, deadline, remarks, status },
      { new: true }
    );
    console.log(updatedTask);
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error updating task", error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.send("Task deleted");
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error deleting task", error: error.message });
  }
};
