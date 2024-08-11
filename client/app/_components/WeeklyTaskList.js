"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Task from "./Task";

function WeeklyTaskList() {
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const allTasks = weeklyTasks;
  const uncompletedTasks = weeklyTasks.filter((task) => !task.completed);
  const completedTasks = weeklyTasks.filter((task) => task.completed);
  const today = dayjs().format("YYYY-MM-DD");
  const tasksDueToday = weeklyTasks.filter((task) => {
    const isDueToday = dayjs(task.deadline).format("YYYY-MM-DD") === today;
    if (isDueToday) {
      // console.log("Task due today:", task);
    }
    return isDueToday;
  });

  const completedTasksCount = completedTasks.length;
  const progress =
    allTasks.length > 0
      ? Math.round((completedTasksCount / allTasks.length) * 100)
      : 0;

  if (loading) {
    return <p>Loading tasks...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className=" flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">
        Your Progress for the Upcoming Week
      </h2>

      <div className=" flex flex-row justify-center items-center space-x-10 py-2">
        <div
          className={`w-1/3 p-2 text-center rounded-lg 
        ${tasksDueToday.length > 0 ? "bg-red-100" : "bg-green-100"}`}
        >
          <div className="stat">
            <div className="stat-title">Tasks Due Today</div>
            <div className="stat-value">{tasksDueToday.length}</div>
            <div className="stat-desc">due today</div>
          </div>
        </div>

        <div
          className={`w-1/3 p-2 text-center rounded-lg 
          ${
            uncompletedTasks.length === 0
              ? "bg-green-100"
              : uncompletedTasks.length / allTasks.length <= 0.5
              ? "bg-amber-100"
              : "bg-red-100"
          }`}
        >
          <div className="stat">
            <div className="stat-title">Uncompleted Tasks</div>
            <div className="stat-value">{uncompletedTasks.length}</div>
            <div className="stat-desc">out of {allTasks.length} tasks</div>
          </div>
        </div>

        <div className="w-1/3 p-2 text-center">
          <div
            key={progress}
            className="radial-progress bg-slate-100"
            style={{
              "--value": progress,
              "--size": "10rem",
              "--thickness": "10px",
            }}
          >
            {progress}%
          </div>
          <p className="mt-2">
            {completedTasksCount} of {allTasks.length} tasks completed
          </p>
        </div>
      </div>

      <div className="flex justify-around">
        <div className="w-1/3 p-2 dashboard-custom:block hidden">
          <h3 className="text-lg font-semibold mb-2">All Tasks</h3>
          <div className="flex flex-col gap-4">
            {allTasks.length === 0 ? (
              <div className="alert">
                No tasks scheduled for the upcoming week. Time to relax :)
              </div>
            ) : (
              allTasks.map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  onTaskChange={() => handleTaskCompletionToggle(task._id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="w-1/3 p-2">
          <h3 className="text-lg font-semibold mb-2">Uncompleted Tasks</h3>
          <div className="flex flex-col gap-4">
            {uncompletedTasks.length === 0 ? (
              <div className="alert">
                No uncompleted tasks for the upcoming week. Good job!
              </div>
            ) : (
              uncompletedTasks.map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  onTaskChange={() => handleTaskCompletionToggle(task._id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="w-1/3 p-2">
          <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
          <div className="flex flex-col gap-4">
            {completedTasks.length === 0 ? (
              <div className="alert">
                No completed tasks for the upcoming week.
              </div>
            ) : (
              completedTasks.map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  onTaskChange={() => handleTaskCompletionToggle(task._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyTaskList;
