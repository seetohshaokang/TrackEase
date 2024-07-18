import { useState } from "react";

function EventForm({ event = {}, method = "POST", onSuccess, onClose }) {
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

    if (!firebaseToken || !googleAccessToken) {
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
      .then((result) => {
        onSuccess(result);
        onClose(); // Close the form after successful submission
      })
      .catch((error) => {
        console.error("Error submitting form", error);
      });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl">
        <form onSubmit={handleSubmit} className="form-control">
          <input
            type="text"
            name="summary"
            id="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Summary"
            className="input input-bordered w-full mb-2"
          />
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="input input-bordered w-full mb-2"
          />
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="input input-bordered w-full mb-2"
          />
          <label htmlFor="startDateTime" className="block text-gray-800">
            Start:
          </label>
          <input
            type="datetime-local"
            name="startDateTime"
            id="startDateTime"
            value={formData.startDateTime}
            onChange={handleChange}
            className="input input-bordered w-full mb-2"
          />
          <label htmlFor="endDateTime" className="block text-gray-800">
            End:
          </label>
          <input
            type="datetime-local"
            name="endDateTime"
            id="endDateTime"
            value={formData.endDateTime}
            onChange={handleChange}
            className="input input-bordered w-full mb-2"
          />
          <div className="flex justify-between mt-3">
            <button type="submit" className="btn btn-success text-white">
              {method === "POST" ? "Add Event" : "Update Event"}
            </button>
            <button
              type="button"
              className="btn btn-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
