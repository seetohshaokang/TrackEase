import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import WeeklyTaskList from "./../_components/WeeklyTaskList";

// Mock the Task component
jest.mock("./../_components/Task", () => ({ task, onTaskChange }) => (
  <div data-testid="task">
    <div>{task.title}</div>
    <button onClick={onTaskChange}>Toggle Complete</button>
  </div>
));

// Mock fetch
const mockFetch = (response, ok = true) => {
  return jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
    })
  );
};

describe("WeeklyTaskList Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("renders loading state", async () => {
    global.fetch = mockFetch([], true);
    render(<WeeklyTaskList />);

    expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/Loading tasks.../i)).not.toBeInTheDocument();
    });
  });

  test("renders error state", async () => {
    global.fetch = mockFetch([], false);
    render(<WeeklyTaskList />);

    await waitFor(() => {
      expect(
        screen.getByText(/Error: Failed to load weekly tasks/i)
      ).toBeInTheDocument();
    });
  });

  test("renders tasks and handles filtering", async () => {
    const tasks = [
      { _id: "1", title: "Task 1", completed: false },
      { _id: "2", title: "Task 2", completed: true },
    ];
    global.fetch = mockFetch(tasks, true);
    render(<WeeklyTaskList />);

    await waitFor(() => expect(screen.getAllByTestId("task")).toHaveLength(2));

    fireEvent.click(screen.getByRole("button", { name: "Uncompleted" }));
    await waitFor(() => expect(screen.getAllByTestId("task")).toHaveLength(1));

    fireEvent.click(screen.getByRole("button", { name: "Completed" }));
    await waitFor(() => expect(screen.getAllByTestId("task")).toHaveLength(1));

    fireEvent.click(screen.getByRole("button", { name: "All" }));
    await waitFor(() => expect(screen.getAllByTestId("task")).toHaveLength(2));
  });

  test("toggles task completion status", async () => {
    const tasks = [{ _id: "1", title: "Task 1", completed: false }];
    global.fetch = mockFetch(tasks, true);
    render(<WeeklyTaskList />);

    await waitFor(() => expect(screen.getByTestId("task")).toBeInTheDocument());

    fireEvent.click(screen.getByText(/Toggle Complete/i));
    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          const hasText = (node) =>
            node.textContent.includes("0 of 1 tasks completed");
          const node = element.closest("p");
          return node && hasText(node);
        })
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Toggle Complete/i));
    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          const hasText = (node) =>
            node.textContent.includes("1 of 1 tasks completed");
          const node = element.closest("p");
          return node && hasText(node);
        })
      ).toBeInTheDocument();
    });
  });
});
