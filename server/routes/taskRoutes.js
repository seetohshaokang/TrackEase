const express = require("express");
const router = express.Router();
const taskController = require("./../controllers/taskController");
const {
  checkFirebaseAuth,
  requireGoogleToken,
} = require("./../middleware/authMiddleware");

router.get("/tasklist", checkFirebaseAuth, taskController.getTasks);
router.post(
  "/addtask",
  checkFirebaseAuth,
  taskController.checkTaskExists,
  taskController.createTask
);
router.put("/updatetask/:id", checkFirebaseAuth, taskController.updateTask);
router.delete("/deletetask/:id", checkFirebaseAuth, taskController.deleteTask);

// Add new routes for bookmarking and completing tasks
router.put("/bookmark/:id", checkFirebaseAuth, taskController.bookmarkTask);
router.put("/complete/:id", checkFirebaseAuth, taskController.completeTask);

router.get("/searchtasks", checkFirebaseAuth, taskController.searchTasks);

router.get("/suggestions", checkFirebaseAuth, taskController.getSuggestions);
router.get(
  "/recentSearches",
  checkFirebaseAuth,
  taskController.getRecentSearchs
);

router.get(
  "/weekly-summary",
  checkFirebaseAuth,
  taskController.getWeeklyTaskSummary
);

// Route to schedule task into an event
router.post(
  "/schedule",
  checkFirebaseAuth,
  requireGoogleToken,
  taskController.scheduleTaskAsEvent
);

module.exports = router;
