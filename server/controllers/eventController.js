const { google } = require("googleapis");
const oauth2Client = require("../config/googleAPI");
const admin = require("../config/firebaseAdminConfig"); // Importing existing Firebase Admin Config
const { stat } = require("fs");

// Set Google API credentials
function setGoogleAPICredentials(req) {
  const googleToken = req.headers["google-token-clean"];
  if (!googleToken) {
    const error = new Error(
      "Google access token is missing in the request headers."
    );
    error.statusCode = 400;
    throw error;
  }

  oauth2Client.setCredentials({ access_token: googleToken });
  console.log("Credentials set with token:", googleToken);
}

// Get all calendar events
exports.getEvents = async (req, res) => {
  try {
    console.log("Getting events");
    setGoogleAPICredentials(req);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: "primary",
      maxResults: 2500, // Increase max results if needed
      singleEvents: true,
      orderBy: "startTime",
    });

    console.log("Events retrieved:", response.data.items);
    res.json(response.data.items);
  } catch (error) {
    console.error("Error retrieving events: ", error);

    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    }

    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .send({ message: "Error retrieving events", error: error.message });
  }
};

// Create a new calendar event
exports.createEvent = async (req, res) => {
  try {
    setGoogleAPICredentials(req);

    if (!req.body.summary || !req.body.startDateTime || !req.body.endDateTime) {
      const error = new Error(
        "Missing required fields: summary, startDateTime, endDateTime."
      );
      error.statusCode = 400;
      throw error;
    }

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const eventData = {
      summary: req.body.summary,
      location: req.body.location,
      description: req.body.description,
      start: {
        dateTime: req.body.startDateTime,
        timeZone: "Asia/Singapore",
      },
      end: {
        dateTime: req.body.endDateTime,
        timeZone: "Asia/Singapore",
      },
    };

    console.log("Event data:", JSON.stringify(eventData, null, 2));
    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: eventData,
    });
    console.log("Event scheduled");
    res.status(201).json(event.data);
  } catch (error) {
    console.error("Error creating event:", error);

    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    }

    const statusCode = error.statusCode || 400;
    res
      .status(statusCode)
      .send({ message: "Error creating event", error: error.message });
  }
};

// Updating a calendar event
exports.updateEvent = async (req, res) => {
  try {
    setGoogleAPICredentials(req);

    if (!req.body.summary || !req.body.startDateTime || !req.body.endDateTime) {
      const error = new Error(
        "Missing required fields: summary, startDateTime, endDatetime"
      );
      error.statusCode = 400;
      throw error;
    }

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    // Created updated data object
    const updateData = {
      summary: req.body.summary,
      location: req.body.location,
      description: req.body.description,
      start: {
        dateTime: req.body.startDateTime,
        timeZone: "Asia/Singapore",
      },
      end: {
        dateTime: req.body.endDateTime,
        timeZone: "Asia/Singapore",
      },
    };

    const event = await calendar.events.update({
      calendarId: "primary",
      eventId: req.params.id,
      requestBody: updateData,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    console.log("Event updated");
    res.json(event.data);
  } catch (error) {
    console.error("Error updating event: ", error);
    const statusCode = error.statusCode || 400;
    res
      .status(statusCode)
      .send({ message: "Error updating event", error: error.message });
  }
};

// Delete a calendar event
exports.deleteEvent = async (req, res) => {
  try {
    setGoogleAPICredentials(req);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
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
