import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Task from "./../_components/Task.js";
import { TaskContext } from "./../context/TaskContext";

const taskMock = {
  _id: "1",
  title: "Test Task",
  deadline: "2024-07-10T10:00:00Z",
  remarks: "Some remarks",
  tags: ["tag1", "tag2"],
  completed: false,
  bookmarked: false,
};

const mockContextValue = {
  updateTaskStatus: jest.fn(),
  fetchTasks: jest.fn(),
};

const TaskProvider = ({ children }) => (
  <TaskContext.Provider value={mockContextValue}>
    {children}
  </TaskContext.Provider>
);

describe("Task Component", () => {
  test("renders task details", () => {
    render(
      <TaskProvider>
        <Task task={taskMock} onTaskChange={() => {}} />
      </TaskProvider>
    );

    expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
    expect(screen.getByText(/Deadline:/i)).toBeInTheDocument();
    expect(screen.getByText(/Some remarks/i)).toBeInTheDocument();
    expect(screen.getByText(/tag1/i)).toBeInTheDocument();
    expect(screen.getByText(/tag2/i)).toBeInTheDocument();
  });

  test("calls on TaskChange when edit button is clicked", () => {
    const onTaskChange = jest.fn();
    render(
      <TaskProvider>
        <Task task={taskMock} onTaskChange={() => {}} />
      </TaskProvider>
    );

    fireEvent.click(screen.getByTitle(/Edit/i));
    expect(onTaskChange).toHaveBeenCalled();
  });

  test("calls onTaskChange when delete button is clicked", async () => {
    const onTaskChange = jest.fn();
    render(
      <TaskProvider>
        <Task task={taskMock} onTaskChange={() => {}} />
      </TaskProvider>
    );

    fireEvent.click(screen.getByTitle(/Delete/i));

    await waitFor(() => {
      expect(onTaskChange).toHaveBeenCalled();
    });
  });

  test("calls onTaskChange when bookmark button is clicked", async () => {
    const onTaskChange = jest.fn();
    render(
      <TaskProvider>
        <Task task={taskMock} onTaskChange={() => {}} />
      </TaskProvider>
    );

    fireEvent.click(screen.getByTitle(/Bookmark/i));

    await waitFor(() => {
      expect(onTaskChange).toHaveBeenCalled();
    });
  });

  test("calls onTaskChange when complete button is clicked", async () => {
    const onTaskChange = jest.fn();
    render(
      <TaskProvider>
        <Task task={taskMock} onTaskChange={() => {}} />
      </TaskProvider>
    );

    fireEvent.click(screen.getByTitle(/Complete/i));

    await waitFor(() => {
      expect(onTaskChange).toHaveBeenCalled();
    });
  });

  test("calls onTaskChange when schedule button is clicked", async () => {
    const onTaskChange = jest.fn();
    render(
      <TaskProvider>
        <Task task={taskMock} onTaskChange={() => {}} />
      </TaskProvider>
    );

    fireEvent.click(screen.getByTitle(/Schedule as Event/i));
    //Verify the state change to schedule mode
    expect(screen.getByPlaceholderText(/Start DateTime/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/End DateTime/i)).toBeInTheDocument();

    //Simulate a form submission
    fireEvent.click(screen.getByText(/Schedule/i));

    await waitFor(() => {
      expect(onTaskChange).toHaveBeenCalled();
    });
  });
});
