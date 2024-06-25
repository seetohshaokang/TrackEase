"use client";

import { getIdToken } from "firebase/auth";
import { useEffect, useState } from "react";
import EventForm from "../_components/EventForm";
import EventList from "../_components/EventList";
import { auth } from "../_firebase/firebaseConfig";
import Navbar from "../_components/Navbar";


export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // Obtain and check firebase token from local storage
        let firebaseToken = localStorage.getItem("firebaseToken");
        if (!firebaseToken) {
          console.error("No Firebase token found in localStorage");
          return;
        }
        // Obtain and check google access token from local storage
        const googleAccessToken = localStorage.getItem("googleAccessToken");
        if (!googleAccessToken) {
          console.error("No Google access token found in localStorage");
          return;
        }

        const user = auth.currentUser;
        if (user) {
          firebaseToken = await getIdToken(user, true);
          localStorage.setItem("firebaseToken", firebaseToken);
        }

        const response = await fetch(
          "http://localhost:8000/api/events/get-events",
          {
            headers: {
              Authorization: `Bearer ${firebaseToken}`,
              "Google-Token": `Bearer ${googleAccessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        console.log("Fetched events:", data);
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    }
    fetchEvents();
  }, []);

  console.log("Rendering EventsPage with events", events);

  return (
    <div>
      <Navbar />
    <div className="px-40">
      <h1>Events Page</h1>
      <EventForm onSuccess={(event) => setEvents([...events, event])} />
      <EventList events={events} setEvents={setEvents} />
    </div>
    </div>
  );
}
