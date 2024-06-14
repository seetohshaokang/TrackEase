"use client";
import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskForm() {
  const { fetchTasks } = useContext(TaskContext);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [remarks, setRemarks] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log("API URL:", process.env.REACT_APP_API_URL);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/tasks/addtask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, deadline, remarks }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating task");
      }
      const data = await fetchTasks();
      console.log("Task created successfully:", data);
      // Clear the form fields
      setTitle("");
      setDeadline("");
      setRemarks("");
    } catch (error) {
      console.error("Error creating task", error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        placeholder="Deadline"
        required
      ></input>
      <textarea
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Remarks"
      ></textarea>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
