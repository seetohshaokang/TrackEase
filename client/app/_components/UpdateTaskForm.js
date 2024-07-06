import { useState } from "react";

function UpdateTaskForm({ task, onTaskChange, setEditMode }) {
  const [title, setTitle] = useState(task.title || "");
  const [deadline, setDeadline] = useState(task.deadline || "");
  const [remarks, setRemarks] = useState(task.remarks || "");
  const [tags, setTags] = useState(task.tags || []);

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleAddTag = () => {
    setTags([...tags, ""]);
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  async function handleUpdate() {
    const token = localStorage.getItem("firebaseToken");
    const updatedTask = { title, deadline, remarks, tags };
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
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered w-full mb-2"
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered w-full mb-2"
      />

      <textarea
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        className="textarea textarea-bordered w-full mb-2"
      ></textarea>
      {tags.map((tag, index) => (
        <div key={index} className="flex items-center mt-2">
          <input
            type="text"
            value={tag}
            onChange={(e) => handleTagChange(index, e.target.value)}
            className="input input-bordered flex-1"
          />
          <button
            onClick={() => handleRemoveTag(index)}
            className="btn btn-error ml-2"
          >
            Remove
          </button>
        </div>
      ))}
      <button onClick={handleAddTag} className="btn btn-success mb-2">
        Add Tag
      </button>
      <button
        onClick={handleUpdate}
        className="btn btn-success text-white mt-2"
      >
        Save
      </button>
      <button
        onClick={() => setEditMode(false)}
        className="btn btn-success text-white mt-2"
      >
        Cancel
      </button>
    </div>
  );
}

export default UpdateTaskForm;
