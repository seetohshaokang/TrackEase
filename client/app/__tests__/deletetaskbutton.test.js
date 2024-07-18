import { fireEvent, render, waitFor } from "@testing-library/react";
import DeleteTaskButton from "../_components/DeleteTaskButton";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("DeleteTaskButton", () => {
  const taskId = "12345";
  const onTaskChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("firebaseToken", "mockToken");
  });

  afterEach(() => {
    localStorage.removeItem("firebaseToken");
  });

  it("renders the DeleteTaskButton component", () => {
    const { getByTitle } = render(
      <DeleteTaskButton taskId={taskId} onTaskChange={onTaskChange} />
    );
    expect(getByTitle("Delete")).toBeInTheDocument();
  });

  it("calls handleDelete and onTaskChange on succcesful delete", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const { getByTitle } = render(
      <DeleteTaskButton taskId={taskId} onTaskChange={onTaskChange} />
    );
    fireEvent.click(getByTitle("Delete"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/deletetask/${taskId}`,
        expect.objectContaining({
          method: "DELETE",
          headers: {
            Authorization: `Bearer mockToken`,
          },
        })
      );
      expect(onTaskChange).toHaveBeenCalled();
    });
  });

  it("handles delete error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const { getByTitle } = render(
      <DeleteTaskButton taskId={taskId} onTaskChange={onTaskChange} />
    );
    fireEvent.click(getByTitle("Delete"));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error deleting task",
        new Error("Failed to delete task")
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
