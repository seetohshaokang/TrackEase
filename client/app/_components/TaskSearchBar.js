import { useContext, useEffect, useRef, useState } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskSearchbar() {
  const { fetchTasks } = useContext(TaskContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Function to fetch recent searches
  const fetchRecentSearches = () => {
    const token = localStorage.getItem("firebaseToken");
    if (!token) {
      console.error("No Firebase token found in localStorage");
      setSuggestions([]);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/recentSearches}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length === 0) {
        } else if (Array.isArray(data)) {
          setSuggestions(data);
        } else {
          console.error("Data is not an array", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching recent searches ", error);
      });
  };

  const fetchAutocompleteSuggestions = (input) => {
    const token = localStorage.getItem("firebaseToken");
    if (!token) {
      console.error("No Firebase token found in localStorage");
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/suggestions?prefix=${input}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSuggestions(data);
        } else {
          console.error("Data is not an array", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching autocomplete suggestions:", error);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    fetchRecentSearches();
    setShowSuggestions(true);
  };

  const handleInputChange = (event) => {
    const input = event.target.value;
    setSearchTerm(input);
    if (input) {
      fetchAutocompleteSuggestions(input);
    } else {
      fetchRecentSearches();
    }
  };

  const handleSearch = () => {
    fetchTasks(searchTerm);
    setSuggestions([]);
    setShowSuggestions(false);
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
    setSuggestions([]);
    setShowSuggestions(false);
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
        ref={inputRef}
        type="text"
        className="input input-bordered w-full mb-4"
        placeholder="Search Tasks..."
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
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
      {showSuggestions && (
        <ul className="absolute bg-white shadow-lg max-h-60 overflow-auto w-full rounded-md">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setSearchTerm(suggestion);
                handleSearch();
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskSearchbar;
