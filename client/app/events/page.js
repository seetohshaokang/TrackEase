"use client";

import { getIdToken } from "firebase/auth";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import EventForm from "../_components/EventForm";
import EventList from "../_components/EventList";
import MediaQuery from "../_components/MediaQuery";
import Navbar from "../_components/Navbar";
import { auth } from "../_firebase/firebaseConfig";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  async function fetchEvents() {
    try {
      let firebaseToken = localStorage.getItem("firebaseToken");
      if (!firebaseToken) {
        console.error("No Firebase token found in localStorage");
        return;
      }

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/get-events`,
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
      // console.log("Fetched events:", data);
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  // console.log("Rendering EventsPage with events", events);

  return (
    <MediaQuery>
      <Toaster
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <div>
        <Navbar />
        <div className=" flex flex-col pl-28 pr-10 py-4">
          <button
            className="btn btn-success btn-lg text-white mb-4 w-50 mx-auto shadow-md"
            onClick={() => setShowForm(true)}
          >
            Create New Event
          </button>
          {showForm && (
            <EventForm
              onSuccess={() => fetchEvents()}
              onClose={() => setShowForm(false)}
            />
          )}
          <EventList events={events} setEvents={setEvents} />
        </div>
      </div>
    </MediaQuery>
  );
}
