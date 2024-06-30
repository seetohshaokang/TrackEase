function Event({ event, handleDelete }) {
  const startDateTime = event.startDateTime || event.start.date;
  const endDateTime = event.endDateTime || event.end.date;

  return (
    <li key={event.id}>
      <div>
        <strong>{event.summary}</strong>
      </div>
      <div>
        Start:
        {new Date(startDateTime).toLocaleString("en-US", {
          timeZone: event.start.timeZone,
        })}
      </div>
      <div>
        End:
        {new Date(endDateTime).toLocaleString("en-US", {
          timeZone: event.end.timeZone,
        })}
      </div>
      <div>
        <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
          View on Google calendar
        </a>
      </div>
      <button onClick={() => handleDelete(event.id)}>Delete</button>
    </li>
  );
}

export default Event;
