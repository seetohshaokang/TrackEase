const Task = require("./../models/taskModel");

// Method for user to get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user_id: req.user.uid });
    res.json(tasks);
  } catch (error) {
    res.status(500).send("Error retrieving tasks");
  }
};

exports.createTask = async (req, res) => {
  const { title, description, status } = req.body;
  const newTask = new Task({
    title,
    description,
    status,
    user_id: req.user.uid,
  });
  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).send("Error saving task");
  }
};

exports.updateTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const updateTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(400).send("Error updating task");
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.send("Task deleted");
  } catch (error) {
    res.status(400).send("Error deleting task");
  }
};
