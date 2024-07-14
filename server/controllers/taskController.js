const Task = require("./../models/taskModel");
const SearchLog = require("./../models/searchLogModel");
const eventController = require("./eventController");

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
  const { title, deadline, remarks, status, tags } = req.body;

  const newTask = new Task({
    title,
    deadline,
    remarks,
    status: status || "pending", // Default status if not provided
    tags,
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
  const { title, deadline, remarks, status, tags } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, deadline, remarks, status, tags },
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

  if (!search) {
    return res.status(400).json({ message: "Search query is required" });
  }
  try {
    try {
      await new SearchLog({ userId: req.user.uid, query: search }).save();
    } catch (logError) {
      console.error("Failed to log search:", logError);
    }
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
    console.error("Search task error:", error);
    res
      .status(500)
      .send({ message: "Error retrieving tasks", error: error.toString() });
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
    return res.status(409).json({
      message:
        "A task with the same title already exists, reschedule that task instead",
    });
  }
  next(); // Proceed to the next middleware if no duplicate tasks is found
};

exports.getWeeklyTaskSummary = async (req, res) => {
  const today = new Date();
  const nextWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7
  );

  try {
    const tasks = await Task.find({
      user_id: req.user.uid,
      deadline: {
        $gte: today,
        $lt: nextWeek,
      },
    })
      .sort({ deadline: 1 })
      .select("title deadline status remarks");
    res.json(tasks);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving weekly task summary",
      error: error.message,
    });
  }
};

exports.getSuggestions = async (req, res) => {
  const { prefix } = req.query;
  try {
    const suggestions = await SearchLog.find({
      query: new RegExp(`^${prefix}`, "i"),
    })
      .sort({ date: -1 })
      .limit(5);
    console.log("Fetched suggestions:", suggestions);
    if (!suggestions.length) {
      res.json([]);
    } else {
      res.json(suggestions.map((s) => s.query));
    }
  } catch (error) {
    console.error("Failed to retrieve suggestions:", error);
    res.status(500).send({
      message: "Error retrieving suggestions",
      error: error.toString(),
    });
  }
};

exports.getRecentSearchs = async (req, res) => {
  const userId = req.user.uid;

  try {
    const recentSearchs = await SearchLog.find({ userId: userId })
      .sort({ date: -1 })
      .limit(5)
      .select("query -_id");

    res.json(recentSearches.map((item) => item.query));
  } catch (error) {
    console.error("Failed to retrieve recent searches:", error);
    res.status(500).send({
      message: "Error retrieving recent searches,",
      error: error.toString(),
    });
  }
};

exports.scheduleTaskAsEvent = async (req, res) => {
  try {
    const { taskId, startDateTime, endDateTime } = req.body;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const eventDetails = {
      summary: task.title,
      location: task.location || "",
      description: task.remarks || "",
      startDateTime,
      endDateTime,
    };

    // Call the createEvent method from eventController
    req.body = eventDetails;
    await eventController.createEvent(req, res);
  } catch (error) {
    console.error("Error scheduling task as event:", error);
    res.status(500).send({
      message: "Error scheduling task as event",
      error: error.message,
    });
  }
};
