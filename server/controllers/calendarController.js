const { google } = require("googleapis");
const oauth2Client = require("../config/googleAPI");
const admin = require("../config/firebaseAdminConfig"); // Importing existing Firebase Admin Config

// Helper function to verify Firebase token and set Google API credentials
async function verifyAndSetCredentials(req) {
  const token = req.headers.authorization?.split("Bearer")[1];
  if (!token) {
    throw new Error("No token provided");
  }

  const decodedToken = await admin.auth().verifyIdToken(token);
  oauth2Client.setCredentials({ access_token: req.headers.googleaccesstoken });
  return decodedToken.uid;
}

// Get all calendar events
exports.getEvents = async (req, res) => {
  try {
    const uid = await verifyAndSetCredentials(req);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const { data } = await calendar.events.list({
      calendarId: "primary",
    });
    res.json(data.items);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieveing events", error: error.message });
  }
};

// Create a new calendar event
exports.createEvent = async (req, res) => {
  try {
    const uid = await verifyAndSetCredentials(req);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const eventData = {
      summary: req.body.summary,
      location: req.body.location,
      description: req.body.description,
      start: {
        dataTime: req.body.startDateTime,
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: req.body.endDateTime,
        timeZone: "America/Los_Angeles",
      },
    };
    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: eventData,
    });
    res.status(201).json(event.data);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error creating event", error: error.message });
  }
};

// Updating a calendar event
exports.updateEvent = async (req, res) => {
  setAuth(req.body.token);

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  // Created updated data object
  const updateData = {
    summary: req.body.summary,
    location: req.body.location,
    description: req.body.description,
    start: {
      dateTime: req.body.startDateTime,
      timeZone: "America/Los_Angeles",
    },
    end: {
      dataTime: req.body.endDateTime,
      timeZone: "America/Los_Angeles",
    },
  };

  try {
    const event = await calendar.events.update({
      calendarId: "primary",
      eventId: req.params.id,
      requestBody: updateData,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event.data);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error updating event", error: error.message });
  }
};

// Delete a calendar event
exports.deleteEvent = async (req, res) => {
  setAuth(req.headers.authorization);

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  try {
    await calendar.events.delete({
      calendarId: "primary",
      eventId: req.params.id,
    });
    res.send("Event deleted");
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error deleting event", error: error.message });
  }
};
