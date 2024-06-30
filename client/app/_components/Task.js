import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";

export default function Task({ task, onTaskChange }) {
  const { updateTaskStatus } = useContext(TaskContext);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task.title || "");
  const [deadline, setDeadline] = useState(task.deadline || "");
  const [remarks, setRemarks] = useState(task.remarks || "");

  async function handleDelete() {
    const token = localStorage.getItem("firebaseToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/deletetask/${task._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      onTaskChange();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  }

  async function handleUpdate() {
    const token = localStorage.getItem("firebaseToken");
    const updatedTask = { title, deadline, remarks };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/updatetask/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTask),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      setEditMode(false);
      onTaskChange();
    } catch (error) {
      console.error("Error updating task", error);
    }
  }
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString()
    : "No deadline";

  async function handleBookmark() {
    const token = localStorage.getItem("firebaseToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/bookmark/${task._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to bookmark task");
      }
      onTaskChange();
    } catch (error) {
      console.error("Error bookmarking task", error);
    }
  }

  async function handleComplete() {
    const token = localStorage.getItem("firebaseToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/complete/${task._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to mark task as completed");
      }
      onTaskChange();
    } catch (error) {
      console.error("Error marking task as completed", error);
    }
  }

  return (
    <div key={task._id} className="card rounded-md w-auto bg-gray-100 shadow-md">
      {editMode ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="input input-bordered"
          />
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="textarea textarea-bordered"
          ></textarea>
          <button onClick={handleUpdate} className="btn btn-success text-white">
            Save
          </button>
          <button onClick={() => setEditMode(false)} className="btn btn-error text-white">
            Cancel
          </button>
        </>
      ) : (
        <>

        <div className="flex flex-row px-1">
          <div className="flex-col">
          <h3 className="text-xl font-bold">{task.title}</h3>
          <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
          <p>Remarks: {task.remarks}</p>
          </div>
         <div className="ml-auto flex items-center space-x-1">
          <button onClick={() => setEditMode(true)} className="btn bg-gray-400 text-white btn-sm" title="Edit">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>

          </button>
          <button onClick={handleDelete} className="btn bg-red-600 text-white btn-sm" title="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

          </button>
          <button onClick={handleBookmark} className="btn btn-accent text-white btn-sm" title={task.bookmarked?"Un-Bookmark":"Bookmark"}>
            {task.bookmarked ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5" />
</svg>
) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
</svg>
)}
          </button>
          <button onClick={handleComplete} className="btn btn-success text-white btn-sm">
            {task.completed ? "Undo Complete" : "Completed"}
          </button>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
