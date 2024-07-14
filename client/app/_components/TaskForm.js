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
    setIsSubmitting(true); // Disable submit button while processing
    const token = localStorage.getItem("firebaseToken");
    if (!token) {
      console.error("No firebase token found in localStorage");
      setIsSubmitting(false);
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
          body: JSON.stringify({ title, deadline, remarks, tags }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        setIsSubmitting(false);

        if (response.status === 409) {
          alert(errorData.message);
        } else {
          throw new Error(errorData.message || "Error creating task");
        }
        return;
      }
      const savedTask = await response.json();
      console.log("Task created successfully", savedTask);
      // Clear the form fields
      fetchTasks();
      setTitle("");
      setDeadline("");
      setRemarks("");
      setTags([]); // Clear tags
      onClose();
    } catch (error) {
      console.error("Error creating task", error);
      setIsSubmitting(false); // Enable submit button again in case of error
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

          {tags.map((tag, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter tag"
                value={tag}
                onChange={(e) => handleTagChange(e.target.value, index)}
              />
              <button
                type="button"
                className="btn btn-error"
                onClick={() => handleRemoveTag(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={handleAddTag}
          >
            Add Tag
          </button>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="btn btn-success text-white"
              disabled={isSubmitting}
            >
              Add Task
            </button>
            <button
              type="button"
              className="btn bg-gray-300"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
