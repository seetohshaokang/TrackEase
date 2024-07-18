// app/__tests__/scheduletaskform.test.js

import { fireEvent, render, waitFor } from "@testing-library/react";
import ScheduleTaskForm from "../_components/ScheduleTaskForm";

describe("ScheduleTaskForm", () => {
  const task = { _id: "123", title: "Test Task" };
  const mockOnTaskChange = jest.fn();
  const mockSetScheduleMode = jest.fn();

  let consoleErrorSpy;

  beforeEach(() => {
    localStorage.setItem("firebaseToken", "mockFirebaseToken");
    localStorage.setItem("googleAccessToken", "mockGoogleAccessToken");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it("renders the ScheduleTaskForm component", () => {
    const { getByPlaceholderText } = render(
      <ScheduleTaskForm
        task={task}
        onTaskChange={mockOnTaskChange}
        setScheduleMode={mockSetScheduleMode}
      />
    );

    expect(getByPlaceholderText("Start DateTime")).toBeInTheDocument();
    expect(getByPlaceholderText("End DateTime")).toBeInTheDocument();
  });

  it("handles scheduling successfully", async () => {
    const { getByPlaceholderText, getByText } = render(
      <ScheduleTaskForm
        task={task}
        onTaskChange={mockOnTaskChange}
        setScheduleMode={mockSetScheduleMode}
      />
    );

    fireEvent.change(getByPlaceholderText("Start DateTime"), {
      target: { value: "2023-12-31T12:00" },
    });
    fireEvent.change(getByPlaceholderText("End DateTime"), {
      target: { value: "2023-12-31T14:00" },
    });

    fireEvent.click(getByText("Schedule"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/schedule`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer mockFirebaseToken",
            "Google-Token": "Bearer mockGoogleAccessToken",
          }),
        })
      );
      expect(mockSetScheduleMode).toHaveBeenCalledWith(false);
      expect(mockOnTaskChange).toHaveBeenCalled();
    });
  });

  it("handles scheduling error", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );
    const { getByPlaceholderText, getByText } = render(
      <ScheduleTaskForm
        task={task}
        onTaskChange={mockOnTaskChange}
        setScheduleMode={mockSetScheduleMode}
      />
    );

    fireEvent.change(getByPlaceholderText("Start DateTime"), {
      target: { value: "2023-12-31T12:00" },
    });
    fireEvent.change(getByPlaceholderText("End DateTime"), {
      target: { value: "2023-12-31T14:00" },
    });

    fireEvent.click(getByText("Schedule"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error scheduling tasks as event",
        expect.any(Error)
      );
    });
  });
});
