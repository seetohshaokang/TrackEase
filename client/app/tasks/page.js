"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import BookmarkList from "../_components/BookmarkList";
import MediaQuery from "../_components/MediaQuery";
import Navbar from "../_components/Navbar";
import TaskForm from "../_components/TaskForm";
import TaskList from "../_components/TaskList";
import { TasksProvider } from "../context/TaskContext";

export default function TaskPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <MediaQuery>
      <Toaster
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <div className="flex">
        <Navbar />
        <div className="flex-grow flex flex-row pl-28 pr-10 pt-4">
          <TasksProvider>
            <div className=" basis-3/5 pr-4">
              <TaskList />
            </div>

            <div className=" basis-2/5 pl-4 ">
              <div className="flex flex-col ">
                <button
                  className="btn btn-success btn-lg text-white mb-4 w-2/5 mx-auto shadow-md"
                  onClick={() => setShowForm(true)}
                >
                  Add Task
                </button>
                {showForm && <TaskForm onClose={() => setShowForm(false)} />}
                <h2 className="text-center w-full text-2xl font-bold pt-1 pb-2">
                  Bookmarked
                </h2>
                <BookmarkList />
              </div>
            </div>
          </TasksProvider>
        </div>
      </div>
    </MediaQuery>
  );
}
