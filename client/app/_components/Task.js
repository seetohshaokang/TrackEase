import { useState } from "react";

export default function Task({ task, onTaskChange }) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [deadline, setDeadline] = useState(task.deadline);
  const [remarks, setRemarks] = useState(task.remarks);

  async function handleDelete() {
    console.log(task);
    const token = localStorage.getItem("firebaseToken");
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/tasks/deletetask/${task._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      onTaskChange(); // notify parent component to refresh the task list
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

  return (
    <div key={task._id} className="card w-96 bg-base-100 shadow-xl">
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
            className="text-area textarea-bordered"
          ></textarea>
          <button onClick={handleUpdate} className="btn btn-success">
            Save
          </button>
          <button onClick={() => setEditMode(false)} className="btn btn-error">
            Cancel
          </button>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
          <p>Remarks: {task.remarks}</p>
          <button onClick={() => setEditMode(true)} className="btn btn-primary">
            Edit
          </button>
          <button onClick={handleDelete} className="btn btn-error">
            Delete
          </button>
        </>
      )}
    </div>
  );
}
