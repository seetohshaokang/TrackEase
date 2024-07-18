import { fireEvent, render, waitFor } from "@testing-library/react";
import CompleteTaskButton from "../_components/CompleteTaskButton";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

const mockOnTaskChange = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.setItem("firebaseToken", "mockFirebaseToken");
});

test("renders button with correct initial state", () => {
  const { getByTitle } = render(
    <CompleteTaskButton
      taskId="1"
      completed={false}
      onTaskChange={mockOnTaskChange}
    />
  );

  expect(getByTitle("Mark as Complete")).toBeInTheDocument();
});

test("renders button with completed state", () => {
  const { getByTitle } = render(
    <CompleteTaskButton
      taskId="1"
      completed={true}
      onTaskChange={mockOnTaskChange}
    />
  );

  expect(getByTitle("Undo Complete")).toBeInTheDocument();
});

test("calls API and onTaskChange when button is clicked", async () => {
  const { getByTitle } = render(
    <CompleteTaskButton
      taskId="1"
      completed={false}
      onTaskChange={mockOnTaskChange}
    />
  );

  fireEvent.click(getByTitle("Mark as Complete"));

  expect(fetch).toHaveBeenCalledWith(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/complete/1`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer mockFirebaseToken`,
      },
    }
  );

  await waitFor(() => {
    expect(mockOnTaskChange).toHaveBeenCalled();
  });
});

test("handles API error correctly", async () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
    })
  );

  const { getByTitle } = render(
    <CompleteTaskButton
      taskId="1"
      completed={false}
      onTaskChange={mockOnTaskChange}
    />
  );

  console.error = jest.fn();

  fireEvent.click(getByTitle("Mark as Complete"));

  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith(
      "Error marking task as completed",
      expect.any(Error)
    );
  });

  expect(mockOnTaskChange).not.toHaveBeenCalled();
});
