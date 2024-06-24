const express = require("express");
const router = express.Router();
const taskController = require("./../controllers/taskController");
const { checkFirebaseAuth } = require("./../middleware/authMiddleware");

router.get("/tasklist", checkFirebaseAuth, taskController.getTasks);
router.post("/addtask", checkFirebaseAuth, taskController.createTask);
//router.post("/addtask", taskController.createTask);
router.put("/updatetask/:id", checkFirebaseAuth, taskController.updateTask);
router.delete("/deletetask/:id", checkFirebaseAuth, taskController.deleteTask);

module.exports = router;
