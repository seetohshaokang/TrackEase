const { default: EventForm } = require("../_components/EventForm");
const { render, fireEvent, waitFor } = require("@testing-library/react");

describe("EventForm", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders the EventForm component", () => {
    const { getByPlaceholderText } = render(
      <EventForm onClose={() => {}} onSuccess={() => {}} />
    );
    expect(getByPlaceholderText("Summary")).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    localStorage.setItem("firebaseToken", "mockFirebaseToken");
    localStorage.setItem("googleAccessToken", "mockGoogleAccessToken");

    const mockOnSuccess = jest.fn();
    const mockOnClose = jest.fn();

    const { getByPlaceholderText, getByLabelText, getByText } = render(
      <EventForm onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    fireEvent.change(getByPlaceholderText("Summary"), {
      target: { value: "Test Event" },
    });
    fireEvent.change(getByPlaceholderText("Location"), {
      target: { value: "Test Location" },
    });
    fireEvent.change(getByPlaceholderText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(getByLabelText("Start:"), {
      target: { value: "2023-12-31T12:00" },
    });
    fireEvent.change(getByLabelText("End:"), {
      target: { value: "2023-12-31T14:00" },
    });

    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );
    global.fetch = mockFetch;

    fireEvent.click(getByText("Add Event"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/add-event`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer mockFirebaseToken",
            "Google-Token": "Bearer mockGoogleAccessToken",
          }),
        })
      );
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("handles form submission error", async () => {
    localStorage.setItem("firebaseToken", "mockFirebaseToken");
    localStorage.setItem("googleAccessToken", "mockGoogleAccessToken");

    const mockOnSuccess = jest.fn();
    const mockOnClose = jest.fn();

    const { getByPlaceholderText, getByLabelText, getByText } = render(
      <EventForm onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    fireEvent.change(getByPlaceholderText("Summary"), {
      target: { value: "Test Event" },
    });
    fireEvent.change(getByPlaceholderText("Location"), {
      target: { value: "Test Location" },
    });
    fireEvent.change(getByPlaceholderText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(getByLabelText("Start:"), {
      target: { value: "2023-12-31T12:00" },
    });
    fireEvent.change(getByLabelText("End:"), {
      target: { value: "2023-12-31T14:00" },
    });

    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.reject(new Error("Fetch failed to execute")),
      })
    );
    global.fetch = mockFetch;

    fireEvent.click(getByText("Add Event"));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error submitting form",
        expect.any(Error)
      );
    });
  });
});
