"use client";

import { useState } from "react";
import TaskForm from "../_components/TaskForm";
import TaskList from "../_components/TaskList";
import BookmarkList from "../_components/BookmarkList";
import { TasksProvider } from "../context/TaskContext";
import Navbar from "../_components/Navbar";

export default function TaskPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Navbar />
      <div className="flex flex-row pl-28 pr-10 pt-4">
        <TasksProvider>
          <div className=" basis-3/5 pr-4">
            <TaskList />
          </div>

          <div className=" basis-2/5 pl-4 ">
            <div className="flex flex-col ">
              <button
                className="btn btn-success btn-lg text-white mb-4 w-2/5 mx-auto"
                onClick={() => setShowForm(true)}
              >
                Add Task
              </button>
              {showForm && <TaskForm onClose={() => setShowForm(false)} />}
              <h2 className="text-center w-full text-2xl font-bold">Bookmarked</h2>
              <BookmarkList />
            </div>
          </div>
        </TasksProvider>
      </div>
    </div>
  );
}
