"use client";

import { createContext, useCallback, useEffect, useState } from "react";

export const TaskContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem("firebaseToken");
    console.log("Firebase token retrieved: ", token ? "Yes" : "No token found");

    console.log(`${process.env.NEXT_PUBLIC_API_URL}`);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/tasklist`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          `Error fetching tasks: ${data.message || "Unknown error"} (Status: ${
            response.status
          })`
        );
      }
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  }, []);

  // Automatically fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
