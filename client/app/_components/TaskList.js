"use client";

import { useContext, useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import Task from "./Task";

function TaskList() {
  const { tasks, fetchTasks } = useContext(TaskContext);

  useEffect(() => {
    if (fetchTasks) {
      fetchTasks() // Ensure tasks are fetched on component mount
        .then(() => console.log("Tasks fetched:", tasks));
    }
  }, [fetchTasks]);

  const handleTaskChange = () => {
    fetchTasks(); // Refetch tasks from the server to get updated list
  };

  console.log("Tasks:", tasks);

  return (
    <div className="flex flex-col gap-4">
      {tasks.length === 0 ? (
        <div className="alert alert-warning">No tasks found</div>
      ) : (
        tasks.map((task) => (
          <Task key={task._id} task={task} onTaskChange={handleTaskChange} />
        ))
      )}
    </div>
  );
}
export default TaskList;
