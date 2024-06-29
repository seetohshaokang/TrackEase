import { act, fireEvent, render, screen } from "@testing-library/react";
import Task from "../_components/Task";

// Mock Fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

describe("Task Component", () => {
  const mockTask = [
    {
      _id: "1",
      title: "Test Task",
      deadline: "2024-07-01",
      remarks: "Test Remarks",
    },
  ];

  it("renders task details correctly", async () => {
    const onTaskChange = jest.fn();
    await act(async () => {
      render(<Task task={mockTask} onTaskChange={onTaskChange} />);
    });
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Remarks: Test Remarks")).toBeInTheDocument();
    expect(screen.getByText("Deadline: 7/1/2024")).toBeInTheDocument();
  });

  it("enters edit mode and updates a task", async () => {
    const onTaskChange = jest.fn();
    await act(async () => {
      render(<Task task={mockTask} onTaskChange={onTaskChange} />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Edit"));
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Title"), {
        target: { value: "Updated Task" },
      });

      fireEvent.change(screen.getByLabelText("Remarks"), {
        target: { value: "Updated Remarks" },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Save"));
    });

    expect(onTaskChange).toHaveBeenCalled();
  });
});
