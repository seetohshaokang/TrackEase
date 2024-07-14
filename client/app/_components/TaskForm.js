"use client";
import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskForm({ onClose }) {
  const { fetchTasks } = useContext(TaskContext);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]); // Initialize tags as an empty array so no empty bubble

  // Function to handle adding new tags
  const handleAddTag = () => {
    setTags([...tags, ""]);
  };

  // Function to handle changing tags
  const handleTagChange = (value, index) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  // Function to handle removing tags
  const handleRemoveTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("firebaseToken");
    if (!token) {
      console.error("No firebase token found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/addtask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, deadline, remarks }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating task");
      }
      await fetchTasks();
      console.log("Task created successfully");
      // Clear the form fields
      setTitle("");
      setDeadline("");
      setRemarks("");
      setTags([]); // Clear tags
      onClose();
    } catch (error) {
      console.error("Error creating task", error);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="form-control">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="input input-bordered w-full"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="Deadline"
            required
            className="input input-bordered w-full mt-4"
          />
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Remarks"
            className="textarea textarea-bordered w-full mt-4"
          ></textarea>
          <div className="flex justify-between mt-4">
            <button type="submit" className="btn btn-success text-white">
              Add Task
            </button>
            <button type="button" className="btn bg-gray-300" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );  
}

export default TaskForm;
