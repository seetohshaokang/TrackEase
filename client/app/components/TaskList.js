"use client";

import { useContext, useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import Task from "./Task";

function TaskList() {
  const { tasks, fetchTasks } = useContext(TaskContext);

  useEffect(() => {
    if (fetchTasks) {
      fetchTasks(); // Ensure tasks are fetched on component mount
    }
  }, [fetchTasks]);

  return (
    <div>
      {tasks.length === 0 ? (
        <div>No tasks found</div>
      ) : (
        tasks.map((task) => <Task key={task.id} task={task} />)
      )}
    </div>
  );
}
export default TaskList;
