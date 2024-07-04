"use client";
import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskForm({ onClose }) {
  const { fetchTasks } = useContext(TaskContext);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [remarks, setRemarks] = useState("");
<<<<<<< Updated upstream
=======
  const [isSubmitting, setIsSubmitting] = useState(false); // Button
  const [tags, setTags] = useState([""]);

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
>>>>>>> Stashed changes

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

        if (response.status === 409) {
          alert(errorData.message);
        } else {
          throw new Error(errorData.message || "Error creating task");
        }
        return;
      }
      //await fetchTasks();
      const savedTask = await response.json();
      console.log("Task created successfully", savedTask);
      // Clear the form fields
      setTitle("");
      setDeadline("");
      setRemarks("");
      onClose();
    } catch (error) {
      console.error("Error creating task", error);
    }
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
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
            <div key={index} className="flex items-center space-x-2">
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
            className="btn btn-secondary"
            onClick={handleAddTag}
          >
            Add Tag
          </button>

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
