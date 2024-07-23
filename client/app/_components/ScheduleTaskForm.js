import { useState } from "react";

function ScheduleTaskForm({ task, onTaskChange, setScheduleMode }) {
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  async function handleSchedule() {
    try {
      const payload = {
        taskId: task._id,
        startDateTime: `${startDateTime}:00Z`,
        endDateTime: `${endDateTime}:00Z`,
      };

      console.log("Payload being sent to schedule task:", payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
            "Google-Token": `Bearer ${localStorage.getItem(
              "googleAccessToken"
            )}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error scheduling tasks as event:", errorDetails);
        throw new Error("Failed to schedule task as event");
      }

      const result = await response.json();
      onTaskChange(result);
      setScheduleMode(false);
    } catch (error) {
      console.error("Error scheduling tasks as event", error);
    }
  }

  function handleStartDateTimeChange(e) {
    setStartDateTime(e.target.value);
  }

  function handleEndDateTimeChange(e) {
    setEndDateTime(e.target.value);
  }

  return (
    <div>
      <input
        type="datetime-local"
        value={startDateTime}
        onChange={handleStartDateTimeChange}
        className="input input-bordered w-full mb-2"
        placeholder="Start DateTime"
        required={true}
      />

      <input
        type="datetime-local"
        value={endDateTime}
        onChange={handleEndDateTimeChange}
        className="input input-bordered w-full mb-2"
        placeholder="End DateTime"
        required={true}
      />

      <div className="flex justify-center space-x-1">
      <button
        onClick={handleSchedule}
        className="btn text-white bg-blue-400 mt-2"
      >
        Schedule
      </button>

      <button
        onClick={() => setScheduleMode(false)}
        className="btn bg-gray-400 text-white mt-2"
      >
        Cancel
      </button>
      </div>
    </div>
  );
}

export default ScheduleTaskForm;
