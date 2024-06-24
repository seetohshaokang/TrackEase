function EventList({ events, setEvents }) {
  console.log("Rendering EventList with events:", events);

  function handleDelete(id) {
    const token = localStorage.getItem("firebaseToken");
    const googleAccessToken = localStorage.getItem("googleAccessToken");
    if (!token || !googleAccessToken) {
      console.error("No token found in localStorage");
      return;
    }

    fetch(`${process.env.API_URL}/api/events/delete-event/${id}`, {
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
      {events.map((event) => {
        console.log("Rendering event:", event);
        const startDateTime = event.startDateTime || event.start.date;
        const endDateTime = event.endDateTime || event.end.date;

        return (
          <li key={event.id}>
            <div>
              <strong>{event.summary}</strong>
            </div>
            <div>
              Start:
              {new Date(event.start.dateTime).toLocaleString("en-US", {
                timeZone: event.start.timeZone,
              })}
            </div>
            <div>
              End:
              {new Date(event.end.dateTime).toLocaleString("en-US", {
                timeZone: event.end.timeZone,
              })}
            </div>
            <div>
              <a
                href={event.htmlLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Calendar
              </a>
            </div>
            <button onClick={() => handleDelete(event.id)}>Delete</button>
          </li>
        );
      })}
    </ul>
  );
}

export default EventList;
