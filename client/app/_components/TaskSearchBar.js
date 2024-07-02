import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskSearchbar() {
  const { fetchTasks } = useContext(TaskContext);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchTasks(term); // Fetch and filter tasks as the user types
  };

  return (
    <input
      type="text"
      className="input input-bordered w-full mb-4"
      placeholder="Search Tasks..."
      value={searchTerm}
      onChange={handleSearchChange}
    />
  );
}

export default TaskSearchbar;
