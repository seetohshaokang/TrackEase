// BookmarkTaskButton.test.js
import { fireEvent, render, waitFor } from "@testing-library/react";
import BookmarkTaskButton from "./../_components/BookmarkTaskButton";

describe("BookmarkTaskButton Component", () => {
  const mockOnTaskChange = jest.fn();
  const taskId = "1";
  const bookmarked = false;

  beforeEach(() => {
    localStorage.setItem("firebaseToken", "mockToken");
    mockOnTaskChange.mockClear();
  });

  it("renders the Bookmark button when not bookmarked", () => {
    const { getByTitle } = render(
      <BookmarkTaskButton
        taskId={taskId}
        bookmarked={bookmarked}
        onTaskChange={mockOnTaskChange}
      />
    );
    expect(getByTitle("Bookmark")).toBeInTheDocument();
  });

  it("renders the Un-Bookmark button when bookmarked", () => {
    const { getByTitle } = render(
      <BookmarkTaskButton
        taskId={taskId}
        bookmarked={!bookmarked}
        onTaskChange={mockOnTaskChange}
      />
    );
    expect(getByTitle("Un-Bookmark")).toBeInTheDocument();
  });

  it("calls handleBookmark and onTaskChange when the button is clicked", async () => {
    const { getByTitle } = render(
      <BookmarkTaskButton
        taskId={taskId}
        bookmarked={bookmarked}
        onTaskChange={mockOnTaskChange}
      />
    );

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    fireEvent.click(getByTitle("Bookmark"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/bookmark/${taskId}`,
        expect.objectContaining({
          method: "PUT",
          headers: {
            Authorization: `Bearer mockToken`,
          },
        })
      );
      expect(mockOnTaskChange).toHaveBeenCalled();
    });
  });

  it("handles errors during bookmarking", async () => {
    const { getByTitle } = render(
      <BookmarkTaskButton
        taskId={taskId}
        bookmarked={bookmarked}
        onTaskChange={mockOnTaskChange}
      />
    );

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    fireEvent.click(getByTitle("Bookmark"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockOnTaskChange).not.toHaveBeenCalled();
    });
  });
});
