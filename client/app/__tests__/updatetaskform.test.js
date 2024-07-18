import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UpdateTaskForm from "./../_components/UpdateTaskForm.js";

const taskMock = {
  _id: "1",
  title: "Test Task",
  deadline: "2024-07-10T10:00",
  remarks: "Some remarks",
  tags: ["tag1", "tag2"],
};

describe("UpdateTaskForm Component", () => {
  let onTaskChange;
  let setEditMode;

  beforeEach(() => {
    // Reset mocks before each test
    onTaskChange = jest.fn();
    setEditMode = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
  });

  test("renders task form fields", () => {
    render(
      <UpdateTaskForm
        task={taskMock}
        onTaskChange={onTaskChange}
        setEditMode={setEditMode}
      />
    );

    expect(screen.getByDisplayValue(/Test Task/i)).toBeInTheDocument();
    // Check the full ISO string for the date input
    // expect(screen.getByDisplayValue("2024-07-10")).toBeInTheDocument();
    // expect(screen.getByDisplayValue("10:00")).toBeInTheDocument();

    expect(screen.getByDisplayValue(/Some remarks/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/tag1/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/tag2/i)).toBeInTheDocument();
  });

  test("calls handleUpdate when save button is clicked", async () => {
    render(
      <UpdateTaskForm
        task={taskMock}
        onTaskChange={onTaskChange}
        setEditMode={setEditMode}
      />
    );

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/updatetask/1`,
        expect.objectContaining({
          method: "PUT",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: expect.any(String),
          }),
          body: JSON.stringify({
            title: taskMock.title,
            deadline: taskMock.deadline,
            remarks: taskMock.remarks,
            tags: taskMock.tags,
          }),
        })
      );
      expect(setEditMode).toHaveBeenCalledWith(false);
      expect(onTaskChange).toHaveBeenCalled();
    });
  });

  test("calls setEditMode(false) when cancel button is clicked", () => {
    render(
      <UpdateTaskForm
        task={taskMock}
        onTaskChange={onTaskChange}
        setEditMode={setEditMode}
      />
    );

    fireEvent.click(screen.getByText(/Cancel/i));
    expect(setEditMode).toHaveBeenCalledWith(false);
  });

  test("adds a new tag when Add Tag button is clicked", () => {
    render(
      <UpdateTaskForm
        task={taskMock}
        onTaskChange={onTaskChange}
        setEditMode={setEditMode}
      />
    );
    fireEvent.click(screen.getByText(/Add Tag/i));

    // Ensure that an empty tag input is added
    const tagInputs = screen
      .getAllByRole("textbox")
      .filter((input) => input.className.includes("flex-1"));
    expect(tagInputs).toHaveLength(taskMock.tags.length + 1);
    expect(tagInputs[tagInputs.length - 1].value).toBe("");
  });

  test("removes a tag when Remove button is clicked", () => {
    render(
      <UpdateTaskForm
        task={taskMock}
        onTaskChange={onTaskChange}
        setEditMode={setEditMode}
      />
    );

    fireEvent.click(screen.getAllByText(/Remove/i)[0]);
    expect(screen.queryByDisplayValue(/tag1/i)).not.toBeInTheDocument();
  });

  test("updates tag value when changed", () => {
    render(
      <UpdateTaskForm
        task={taskMock}
        onTaskChange={onTaskChange}
        setEditMode={setEditMode}
      />
    );

    const tagInput = screen.getByDisplayValue(/tag1/i);

    // Ensure that the input it not read-only
    // Object.defineProperty(tagInput, "value", { writable: true });

    fireEvent.change(tagInput, { target: { value: "newTag1" } });
    expect(screen.getByDisplayValue(/newTag1/i)).toBeInTheDocument();
  });
});
