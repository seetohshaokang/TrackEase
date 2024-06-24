import { useState } from "react";

function EventForm({ event = {}, method = "POST", onSuccess }) {
  const [formData, setFormData] = useState({
    summary: event.summary || "",
    location: event.location || "",
    description: event.description || "",
    startDateTime: event.start?.dateTime || event.start?.date || "",
    endDateTime: event.end?.dateTime || event.end?.date || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const firebaseToken = localStorage.getItem("firebaseToken");
    const googleAccessToken = localStorage.getItem("googleAccessToken");

    if (!firebaseToken) {
      console.error("No token found in localStorage");
      return;
    }
    if (!googleAccessToken) {
      console.error("No token found in localStorage");
      return;
    }

    const formattedData = {
      summary: formData.summary,
      location: formData.location,
      description: formData.description,
      startDateTime: new Date(formData.startDateTime).toISOString(),
      endDateTime: new Date(formData.endDateTime).toISOString(),
    };

    const url =
      method === "POST"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/events/add-event`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/events/update-event/${event.id}`;

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firebaseToken}`,
        "Google-Token": `Bearer ${googleAccessToken}`,
      },
      body: JSON.stringify(formattedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fetch failed to execute");
        }
        return response.json();
      })
      .then((result) => onSuccess(result))
      .catch((error) => {
        console.error("Error submitting form", error);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="summary"
        value={formData.summary}
        onChange={handleChange}
        placeholder="Summary"
      />
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="datetime-local"
        name="startDateTime"
        value={formData.startDateTime}
        onChange={handleChange}
      />
      <input
        type="datetime-local"
        name="endDateTime"
        value={formData.endDateTime}
        onChange={handleChange}
      />
      <button type="submit">Add Event</button>
    </form>
  );
}

export default EventForm;
