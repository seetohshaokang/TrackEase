import { fireEvent, render, waitFor } from "@testing-library/react";
import TaskForm from "../_components/TaskForm";
import { TaskContext } from "../context/TaskContext";

const mockFetchTasks = jest.fn();

describe("TaskForm", () => {
  beforeEach(() => {
    localStorage.setItem("firebaseToken", "mockToken");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ title: "Test Task" }),
      })
    );
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks(); // Corrected function name
  });

  it("renders the TaskForm component", () => {
    const { getByPlaceholderText } = render(
      <TaskContext.Provider value={{ fetchTasks: mockFetchTasks }}>
        <TaskForm onClose={jest.fn()} />
      </TaskContext.Provider>
    );

    expect(getByPlaceholderText("Title")).toBeInTheDocument();
    expect(getByPlaceholderText("Remarks")).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    const onClose = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <TaskContext.Provider value={{ fetchTasks: mockFetchTasks }}>
        <TaskForm onClose={onClose} />
      </TaskContext.Provider>
    );

    fireEvent.change(getByPlaceholderText("Title"), {
      target: { value: "Test Task" },
    });

    fireEvent.change(getByPlaceholderText("Deadline"), {
      target: { value: "2023-12-31" },
    });

    fireEvent.change(getByPlaceholderText("Remarks"), {
      target: { value: "Test Remarks" },
    });

    fireEvent.click(getByText("Add Task"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/addtask`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer mockToken`,
          }),
          body: JSON.stringify({
            title: "Test Task",
            deadline: "2023-12-31",
            remarks: "Test Remarks",
            tags: [],
          }),
        })
      );
    });

    await waitFor(() => expect(mockFetchTasks).toHaveBeenCalled());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("handles form submission error", async () => {
    global.fetch.mockImplementationOnce(() => {
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: "Error creating task" }),
      });
    });

    const onClose = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <TaskContext.Provider value={{ fetchTasks: mockFetchTasks }}>
        <TaskForm onClose={onClose} />
      </TaskContext.Provider>
    );

    fireEvent.change(getByPlaceholderText("Title"), {
      target: { value: "Test Task" },
    });
    fireEvent.change(getByPlaceholderText("Deadline"), {
      target: { value: "2023-12-31" },
    });
    fireEvent.change(getByPlaceholderText("Remarks"), {
      target: { value: "Test Remarks" },
    });

    fireEvent.click(getByText("Add Task"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/addtask`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer mockToken`,
          }),
          body: JSON.stringify({
            title: "Test Task",
            deadline: "2023-12-31",
            remarks: "Test Remarks",
            tags: [],
          }),
        })
      );
    });

    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(
        "Error creating task",
        expect.any(TypeError)
      )
    );
  });
});
