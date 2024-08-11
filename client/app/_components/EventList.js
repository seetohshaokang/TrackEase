import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

function EventList({ events, setEvents }) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sortOrder, setSortOrder] = useState("asc");

  function handleDelete(id) {
    const token = localStorage.getItem("firebaseToken");
    const googleAccessToken = localStorage.getItem("googleAccessToken");
    if (!token || !googleAccessToken) {
      console.error("No token found in localStorage");
      toast.error("No token found. Please log in again.");
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
        toast.success("Event deleted successfully");
      })
      .catch((error) => {
        console.error("Failed to delete event", error);
        toast.error("Failed to delete event");
      });
  }

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.start.dateTime || a.start.date).getTime();
    const dateB = new Date(b.start.dateTime || b.start.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const now = new Date().getTime();

  const filteredEvents = sortedEvents.filter((event) => {
    const endDateTime = new Date(
      event.end.dateTime || event.end.date
    ).getTime();
    // console.log(`Event: ${event.summary}, EndDateTime: ${endDateTime}, Now: ${now}`);
    return activeTab === "upcoming" ? endDateTime >= now : endDateTime < now;
  });

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-row pb-2">
        <button
          className={`py-0 px-4 rounded-md text-xl ${
            activeTab === "upcoming" ? "bg-gray-300" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`py-2 px-4 rounded-md text-xl ${
            activeTab === "past" ? "bg-gray-300" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
        <button
          className="ml-auto py-2 px-4 rounded-lg bg-gray-100 border-2 flex items-center tooltip tooltip-top"
          data-tip={
            sortOrder === "asc" ? "Sort by Descending" : "Sort by Ascending"
          }
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="alert">No Events Available</div>
      ) : (
        <ul>
          {filteredEvents.map((event) => {
            const startDateTime = event.startDateTime || event.start.date;
            const endDateTime = event.endDateTime || event.end.date;

            return (
              <div className="py-2">
                <li
                  key={event.id}
                  className="flex justify-between items-center p-2 shadow-md rounded-md bg-gray-100"
                >
                  <div>
                    <div className="font-bold text-xl">{event.summary}</div>
                    <div>
                      Start:
                      {" " +
                        new Date(event.start.dateTime).toLocaleString("en-US", {
                          timeZone: event.start.timeZone,
                        })}
                    </div>
                    <div>
                      End:
                      {" " +
                        new Date(event.end.dateTime).toLocaleString("en-US", {
                          timeZone: event.end.timeZone,
                        })}
                    </div>
                    <div
                      className="border-2 rounded-lg p-2 tooltip tooltip-right"
                      data-tip="View in Google Calendar"
                    >
                      <Link
                        href={event.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src="/google-calendar-image.png"
                          alt="google calendar image"
                          width={96}
                          height={96}
                        />
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="btn bg-red-600 text-white btn-sm mr-5"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </li>
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default EventList;
