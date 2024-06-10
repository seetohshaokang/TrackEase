"use client";
import axios from "axios";
import { useEffect, useState } from "react";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await axios.get("/api/tasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    }
    fetchTasks();
  }, []);

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
export default TaskList;
