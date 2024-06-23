const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const {
  checkFirebaseAuth,
  requireGoogleToken,
} = require("../middleware/authMiddleware");

router.get(
  "/get-events",
  [checkFirebaseAuth, requireGoogleToken],
  eventController.getEvents
);
router.post(
  "/add-event",
  [checkFirebaseAuth, requireGoogleToken],
  eventController.createEvent
);
//router.post("/addtask", taskController.createTask);
router.put(
  "/update-event/:id",
  [checkFirebaseAuth, requireGoogleToken],
  eventController.updateEvent
);
router.delete(
  "/delete-event/:id",
  [checkFirebaseAuth, requireGoogleToken],
  eventController.deleteEvent
);

module.exports = router;
