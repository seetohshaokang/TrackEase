const express = require("express");
const router = express.Router();
const taskController = require("./../controllers/taskController");
const { checkAuth } = require("./../middleware/authMiddleware");

router.get("/", checkAuth, taskController.getTasks);
router.post("/", checkAuth, taskController.createTask);
router.put("/:id", checkAuth, taskController.updateTask);
router.delete("/:id", checkAuth, taskController.deleteTask);

module.exports = router;
