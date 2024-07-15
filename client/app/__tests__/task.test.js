import { fireEvent, render, screen } from "@testing-library/react";
import Task from "./../_components/Task.js";

const taskMock = {
  _id: "1",
  title: "Test Task",
  deadline: "2024-07-10T10:00:00Z",
  remarks: "Some remarks",
  tags: ["tag1", "tag2"],
  completed: false,
  bookmarked: false,
};

describe("Task Component", () => {
  test("renders task details", () => {
    render(<Task task={taskMock} onTaskChange={() => {}} />);

    expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
    expect(screen.getByText(/Deadline:/i)).toBeInTheDocument();
    expect(screen.getByText(/Some remarks/i)).toBeInTheDocument();
    expect(screen.getByText(/tag1/i)).toBeInTheDocument();
    expect(screen.getByText(/tag2/i)).toBeInTheDocument();
  });

  test("calls on TaskChange when edit button is clicked", () => {
    const onTaskChange = jest.fn();
    render(<Task task={taskMock} onTaskChange={onTaskChange} />);

    fireEvent.click(screen.getByTitle(/Edit/i));
    expect(onTaskChange).toHaveBeenCalled();
  });

  test("calls onTaskChange when delete button is clicked", () => {
    const onTaskChange = jest.fn();
    render(<Task task={taskMock} onTaskChange={onTaskChange} />);

    fireEvent.click(screen.getByTitle(/Delete/i));
    expect(onTaskChange).toHaveBeenCalled();
  });

  test("calls onTaskChange when bookmark button is clicked", () => {
    const onTaskChange = jest.fn();
    render(<Task task={taskMock} onTaskChange={onTaskChange} />);

    fireEvent.click(screen.getByTitle(/Bookmark/i));
    expect(onTaskChange).toHaveBeenCalled();
  });

  test("calls onTaskChange when complete button is clicked", () => {
    const onTaskChange = jest.fn();
    render(<Task task={taskMock} onTaskChange={onTaskChange} />);

    fireEvent.click(screen.getByTitle(/Complete/i));
    expect(onTaskChange).toHaveBeenCalled();
  });

  test("calls onTaskChange when schedule button is clicked", () => {
    const onTaskChange = jest.fn();
    render(<Task task={taskMock} onTaskChange={onTaskChange} />);

    fireEvent.click(screen.getAllByTitle(/Schedule as Event/i));
    expect(onTaskChange).toHaveBeenCalled();
  });
});
