"use client";

import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import Task from "./Task";

function TaskList() {
  const { tasks, fetchTasks } = useContext(TaskContext);
  const [activeTab, setActiveTab] = useState("current");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (fetchTasks) {
      fetchTasks(searchTerm).then(() => console.log("Tasks fetched:", tasks));
    }
  }, [searchTerm, fetchTasks, tasks]);

  const handleTaskChange = () => {
    fetchTasks(searchTerm).then(() =>
      console.log("Tasks refetched after update")
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "current") {
      return !task.completed;
    }
    if (activeTab === "completed") {
      return task.completed;
    }
    return true;
  });

  console.log("Filtered Tasks:", filteredTasks);

  return (
    <div>
      <input
        type="text"
        className="input input-bordered w-full mb-4"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex justify-around mb-4">
        <button
          className={`py-2 px-4 rounded-lg text-xl ${
            activeTab === "current" ? "bg-gray-300" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("current")}
        >
          Current
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
          <div className="alert">No tasks yet</div>
        ) : (
          filteredTasks.map((task) => (
            <Task key={task._id} task={task} onTaskChange={handleTaskChange} />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;
