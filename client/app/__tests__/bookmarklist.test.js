import { render, screen, waitFor } from "@testing-library/react";
import BookmarkList from "./../_components/BookmarkList";
import { TaskContext } from "./../context/TaskContext";

// Mock Task component
jest.mock("./../_components/Task", () => ({ task, onTaskChange }) => (
  <div data-testid="task">
    <div>{task.title}</div>
    <button onClick={onTaskChange}>Toggle Bookmark</button>
  </div>
));

describe("BookmarkList Component", () => {
  const mockFetchTasks = jest.fn(() => Promise.resolve());

  const tasks = [
    { _id: "1", title: "Task 1", bookmarked: true },
    { _id: "2", title: "Task 2", bookmarked: false },
    { _id: "3", title: "Task 3", bookmarked: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders 'No bookmarked tasks yet' when there are no bookmarked tasks", async () => {
    const contextValue = {
      tasks: [],
      fetchTasks: mockFetchTasks,
    };

    render(
      <TaskContext.Provider value={contextValue}>
        <BookmarkList />
      </TaskContext.Provider>
    );

    await waitFor(() => {
      expect(mockFetchTasks).toHaveBeenCalled();
    });

    expect(screen.getByText("No bookmarked tasks yet")).toBeInTheDocument();
  });

  test("renders bookmarked tasks correctly", async () => {
    const contextValue = {
      tasks,
      fetchTasks: mockFetchTasks,
    };

    render(
      <TaskContext.Provider value={contextValue}>
        <BookmarkList />
      </TaskContext.Provider>
    );

    await waitFor(() => {
      expect(mockFetchTasks).toHaveBeenCalled();
    });

    const bookmarkedTasks = screen.getAllByTestId("task");
    expect(bookmarkedTasks).toHaveLength(2);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });
});
