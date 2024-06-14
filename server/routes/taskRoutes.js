const express = require("express");
const router = express.Router();
const taskController = require("./../controllers/taskController");
const { checkAuth } = require("./../middleware/authMiddleware");

router.get("/tasklist", checkAuth, taskController.getTasks);
router.post("/addtask", checkAuth, taskController.createTask);
//router.post("/addtask", taskController.createTask);
router.put("/updatetask/:id", checkAuth, taskController.updateTask);
router.delete("/deletetask/:id", checkAuth, taskController.deleteTask);

module.exports = router;
