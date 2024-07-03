import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskSearchbar() {
  const { fetchTasks } = useContext(TaskContext);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    fetchTasks(searchTerm);
  };

  const handleKeyDown = (e) => {
    // Search Term and reset search bar
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchTasks("");
  };

  return (
    <div className="flex items-center space-x-2">
      <button className="btn" onClick={handleSearch} title="Search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 21L16.65 16.65"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <input
        type="text"
        className="input input-bordered w-full mb-4"
        placeholder="Search Tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown} // Listen for key down events
      />
      {searchTerm && (
        <button className="btn" onClick={clearSearch} title="Clear search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </button>
      )}
    </div>
  );
}

export default TaskSearchbar;
