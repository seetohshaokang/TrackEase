"use client";

import { useContext, useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import Task from "./Task";

function BookmarkList() {
  const { tasks, fetchTasks } = useContext(TaskContext);

  useEffect(() => {
    if (fetchTasks) {
      fetchTasks();
      // .then(() => console.log("Tasks fetched:", tasks))
    }
  }, [fetchTasks]);

  const handleTaskChange = () => {
    fetchTasks();
  };

  const bookmarkedTasks = tasks.filter((task) => task.bookmarked);

  // console.log("Bookmarked Tasks:", bookmarkedTasks);

  return (
    <div className="flex flex-col gap-4">
      {bookmarkedTasks.length === 0 ? (
        <div className="flex items-center justify-center alert">
          No bookmarked tasks yet
        </div>
      ) : (
        bookmarkedTasks.map((task) => (
          <Task key={task._id} task={task} onTaskChange={handleTaskChange} />
        ))
      )}
    </div>
  );
}

export default BookmarkList;
