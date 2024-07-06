import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import BookmarkTaskButton from "./BookmarkTaskButton";
import DeleteTaskButton from "./DeleteTaskButton";
import UpdateTaskForm from "./UpdateTaskForm";

export default function Task({ task, onTaskChange }) {
  const { updateTaskStatus } = useContext(TaskContext);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task.title || "");
  const [deadline, setDeadline] = useState(task.deadline || "");
  const [remarks, setRemarks] = useState(task.remarks || "");
  const [tags, setTags] = useState(task.tags || []);

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

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString()
    : "No deadline";

  return (
    <div
      key={task._id}
      className="card rounded-md w-auto bg-gray-100 shadow-md p-4"
    >
      {editMode ? (
        <UpdateTaskForm
          task={task}
          onTaskChange={onTaskChange}
          setEditMode={setEditMode}
        />
      ) : (
        <div className="flex flex-row px-1">
          <div className="flex-col">
            <h3 className="text-xl font-bold">{task.title}</h3>
            <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            <p>Remarks: {task.remarks}</p>
            <div className="flex flex-wrap mt-2">
              {tags.map((tag, index) => (
                <span key={index} className="badge badge-outline mr-2 mb-2">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-1">
            <button
              onClick={() => setEditMode(true)}
              className="btn bg-gray-400 text-white btn-sm"
              title="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
            <DeleteTaskButton taskId={task._id} onTaskChange={onTaskChange} />
            <BookmarkTaskButton
              taskId={task._id}
              bookmarked={task.bookmarked}
              onTaskChange={onTaskChange}
            />
            <button
              onClick={handleComplete}
              className="btn btn-success text-white btn-sm"
            >
              {task.completed ? "Uncomplete" : "Completed"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
