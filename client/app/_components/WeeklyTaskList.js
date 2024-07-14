"use client";

import { useEffect, useState } from "react";
import Task from "./Task";

function WeeklyTaskList() {
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/weekly-summary`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch weekly tasks");
        }
        return res.json();
      })
      .then((data) => {
        setWeeklyTasks(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error loading tasks data: ", error);
        setError("Failed to load weekly tasks");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTaskCompletionToggle = (id) => {
    setWeeklyTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = weeklyTasks.filter((task) => {
    if (activeTab === "completed") {
      return task.completed;
    }
    if (activeTab === "uncompleted") {
      return !task.completed;
    }
    return true;
  });

  const completedTasksCount = weeklyTasks.filter(
    (task) => task.completed
  ).length;

  const progress =
    weeklyTasks.length > 0
      ? Math.round((completedTasksCount / weeklyTasks.length) * 100)
      : 0;

  if (loading) {
    return <p>Loading tasks...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-5 bg-white rounded-lg shadow-lg max-w-md m-auto mt-5">
      <h2 className="text-xl font-bold mb-4"> Tasks for the Upcoming Week</h2>
      <div className="flex justify-center">
        <div
          key={progress}
          className="radial-progress"
          style={{
            "--value": progress,
            "--size": "10rem",
            "--thickness": "10px",
          }}
        >
          {progress}
        </div>
      </div>
      <p className="text-center my-2">
        {completedTasksCount} of {weeklyTasks.length} tasks completed
      </p>

      <div className="flex justify-around mb-4">
        <button
          className={`py-2 px-4 rounded-lg text-xl ${
            activeTab === "all" ? "bg-gray-300" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>

        <button
          className={`py-2 px-4 rounded-lg text-xl ${
            activeTab === "uncompleted" ? "bg-gray-300" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("uncompleted")}
        >
          Uncompleted
        </button>
        <button
          className={`py-2 px-4 rounded-lg text-xl ${
            activeTab === "completed" ? "bg-gray-300" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {filteredTasks.length === 0 ? (
          <div className="alert alert-warning">
            No tasks scheduled for the upcoming week.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <Task
              key={task._id}
              task={task}
              onTaskChange={() => handleTaskCompletionToggle(task._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default WeeklyTaskList;
