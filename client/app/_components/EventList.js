import Event from "./Event";

function EventList({ events, setEvents }) {
  console.log("Rendering EventList with events:", events);

  function handleDelete(id) {
    const token = localStorage.getItem("firebaseToken");
    const googleAccessToken = localStorage.getItem("googleAccessToken");
    if (!token || !googleAccessToken) {
      console.error("No token found in localStorage");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/delete-event/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Google-Token": `Bearer ${googleAccessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete event");
        }
        setEvents(events.filter((event) => event.id !== id));
      })
      .catch((error) => {
        console.error("Failed to delete event", error);
      });
  }

  if (events.length === 0) {
    return <div>No Events Available</div>;
  }

  return (
    <ul>
      {events.map((event) => (
        <Event key={event.id} event={event} handleDelete={handleDelete} />
      ))}
    </ul>
  );
}

export default EventList;
