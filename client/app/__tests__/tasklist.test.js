import { act, render, screen } from "@testing-library/react";
import TaskList from "../_components/TaskList";
import { TaskContext } from "../context/TaskContext";

describe("TaskList Component", () => {
  const mockTasks = [
    {
      _id: "1",
      title: "Task 1",
      deadline: "2024-07-01",
      remarks: "Details for Task 1",
    },
    {
      _id: "2",
      title: "Task 2",
      deadline: "2024-07-02",
      remarks: "Details for Task 2",
    },
  ];

  it("renders tasks correctly", async () => {
    const fetchTasks = jest.fn().mockResolvedValue();

    await act(async () => {
      render(
        <TaskContext.Provider value={{ tasks: mockTasks, fetchTasks }}>
          <TaskList />
        </TaskContext.Provider>
      );
    });

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });
});
