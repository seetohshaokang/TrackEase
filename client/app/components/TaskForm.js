"use client";
import { useState } from "react";

function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = axios.post(
        "/api/tasks",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      // Handle success
    } catch (error) {
      console.error("Error creating task", error);
      // Handle error
    }
  }

  return (
    <form>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      ></textarea>
      <button type="sumbit">Add Task</button>
    </form>
  );
}

export default TaskForm;
