"use client";

import { createContext, useCallback, useEffect, useState } from "react";

export const TaskContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async (searchTerm = "") => {
    const token = localStorage.getItem("firebaseToken");
    const url = searchTerm
      ? `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/tasks/searchtasks?search=${encodeURIComponent(searchTerm)}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/tasklist`;

    console.log("Firebase token retrieved: ", token ? "Yes" : "No token found");
    console.log("API URL:", url);

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          `Error fetching tasks: ${data.message || "Unknown error"} (Status: ${
            response.status
          })`
        );
      }
      setTasks(data);
      console.log("Tasks fetched successfully:", data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  }, []);

  const addTask = async (task) => {
    const token = localStorage.getItem("firebaseToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/addtask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(task),
        }
      );
      if (!response.ok) {
        throw new Error("Error adding task");
      }
      fetchTasks();
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const updateTaskStatus = async (taskId, statusType) => {
    const token = localStorage.getItem("firebaseToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${statusType}/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error updating task status: ${statusType}`);
      }
      fetchTasks();
    } catch (error) {
      console.error(`Error updating task status: ${statusType}`, error);
    }
  };

  // Automatically fetch tasks when component mounts
  useEffect(() => {
    fetchTasks().then(() => console.log("Initial fetch of tasks"));
  }, [fetchTasks]);

  return (
    <TaskContext.Provider
      value={{ tasks, fetchTasks, addTask, updateTaskStatus }}
    >
      {children}
    </TaskContext.Provider>
  );
};
