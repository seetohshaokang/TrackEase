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
    <div className="p-5 bg-white rounded-lg shadow-lg max-w-6xl m-auto mt-5">
      <h2 className="text-xl font-bold mb-4">Tasks for the Upcoming Week</h2>

      <div className="flex justify-around items-center mb-4">
        <div className="w-1/3 p-2 text-center bg-red-100 rounded-lg">
          <div className="stat">
            <div className="stat-title">Tasks Due Today</div>
            <div className="stat-value">{tasksDueToday.length}</div>
            <div className="stat-desc">due today</div>
          </div>
        </div>

        <div className="w-1/3 p-2 text-center bg-blue-100 rounded-lg">
          <div className="stat">
            <div className="stat-title">Uncompleted Tasks</div>
            <div className="stat-value">{uncompletedTasks.length}</div>
            <div className="stat-desc">out of {allTasks.length} tasks</div>
          </div>
        </div>

        <div className="w-1/3 p-2 text-center">
          <div
            key={progress}
            className="radial-progress"
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
        <div className="w-1/3 p-2">
          <h3 className="text-lg font-semibold mb-2">All Tasks</h3>
          <div className="flex flex-col gap-4">
            {allTasks.length === 0 ? (
              <div className="alert alert-warning">
                No tasks scheduled for the upcoming week.
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
              <div className="alert alert-warning">
                No uncompleted tasks for the upcoming week.
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
              <div className="alert alert-warning">
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
