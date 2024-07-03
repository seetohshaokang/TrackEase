const Task = require("./../models/taskModel");

// Method for user to get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user_id: req.user.uid });
    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).send("Error retrieving tasks");
  }
};

exports.createTask = async (req, res) => {
  const { title, deadline, remarks, status } = req.body;

  const newTask = new Task({
    title,
    deadline,
    remarks,
    status: status || "pending", // Default status if not provided
    user_id: req.user.uid,
  });
  console.log("New task created");

  try {
    const savedTask = await newTask.save();
    console.log(savedTask._id);

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

// New method to bookmark a task
exports.bookmarkTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.bookmarked = !task.bookmarked;
    await task.save();
    res.json(task);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error bookmarking task", error: error.message });
  }
};

// New method to mark a task as completed
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).send({
      message: "Error marking task as completed",
      error: error.message,
    });
  }
};

exports.searchTasks = async (req, res) => {
  const { search } = req.query;
  try {
    const tasks = await Task.find({
      user_id: req.user.uid,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { remarks: { $regex: search, $options: "i" } },
      ],
    });
    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving tasks", error: error.message });
  }
};

// Middleware for checking duplicate title
exports.checkTaskExists = async (req, res, next) => {
  const { title } = req.body;
  const existingTask = await Task.findOne({
    title: title,
    user_id: req.user.uid,
  });
  if (existingTask) {
    return res
      .status(409)
      .json({
        message:
          "A task with the same title already exists, reschedule that task instead",
      });
  }
  next(); // Proceed to the next middleware if no duplicate tasks is found
};
