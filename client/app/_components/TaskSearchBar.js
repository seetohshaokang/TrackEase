import { useContext, useEffect, useRef, useState } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskSearchbar() {
  const { fetchTasks } = useContext(TaskContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const fetchRecentSearches = () => {
    const token = localStorage.getItem("firebaseToken");
    if (!token) {
      console.error("No Firebase token found in localStorage");
      setSuggestions([]);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/recentSearches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSuggestions(data);
        } else {
          console.error("Data is not an array", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching recent searches", error);
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

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    console.log("Suggestion clicked:", suggestion);
    setShowSuggestions(false);
    fetchTasks(suggestion);
  };

  useEffect(() => {
    console.log("Search term updated:", searchTerm);
  }, [searchTerm]);

  return (
    <div className="relative flex items-center space-x-2 w-full">
      
      <div className="relative w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="absolute size-6 left-2 top-3 text-gray-500"
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
        <input
          ref={inputRef}
          type="text"
          className="input input-bordered w-full pl-10 mb-4"
          placeholder="Search Tasks..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <button className="absolute right-2 top-3" onClick={clearSearch} title="Clear search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-600">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

          </button>
        )}
      </div>
      {showSuggestions && (
        <ul className="absolute bg-white shadow-lg max-h-60 overflow-auto w-full rounded-md -mt-3 -left-2 top-full z-50 ">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                handleSuggestionClick(suggestion);
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
