import { useState } from "react";

function ScheduleTaskForm({ task, onTaskChange, setScheduleMode }) {
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  async function handleSchedule() {
    const token = localStorage.getItem("firebaseToken");
    const googleAccessToken = localStorage.getItem("googleAccessToken");
    const scheduleData = {
      taskId: task._id,
      startDateTime,
      endDateTime,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Google-Token": `Bearer ${googleAccessToken}`,
          },
          body: JSON.stringify(scheduleData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to schedule task as event");
      }

      setScheduleMode(false);
      onTaskChange();
    } catch (error) {
      console.error("Error scheduling tasks as event", error);
    }
  }

  return (
    <div>
      <input
        type="datetime-local"
        value={startDateTime}
        onChange={(e) => setStartDateTime(e.target.value)}
        className="input input-bordered w-full mb-2"
        placeholder="Start DateTime"
        required={true}
      />

      <input
        type="datetime-local"
        value={endDateTime}
        onChange={(e) => setEndDateTime(e.target.value)}
        className="input input-bordered w-full mb-2"
        placeholder="End DateTime"
        required={true}
      />

      <button
        onClick={handleSchedule}
        className="btn btn-success text-white mt-2"
      >
        Schedule
      </button>

      <button
        onClick={() => setScheduleMode(false)}
        className="btn btn-secondary text-white mt-2"
      >
        Cancel
      </button>
    </div>
  );
}

export default ScheduleTaskForm;
