import { fireEvent, render, screen } from "@testing-library/react";
import Event from "../_components/Event";

describe("Event Component", () => {
  const mockEvent = {
    id: "1",
    summary: "Test Event",
    start: { dateTime: "2024-06-29T12:00:00", timeZone: "UTC" },
    end: { dateTime: "2024-06-29T14:00:00", timeZone: "UTC" },
    htmlLink: "http://example.com",
  };

  it("renders without crashing", () => {
    const handleDelete = jest.fn();
    render(<Event event={mockEvent} handleDelete={handleDelete} />);
    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText("View on Google Calendar")).toBeInTheDocument();
  });

  it("calls handleDelete on button click", () => {
    const handleDelete = jest.fn();
    render(<Event event={mockEvent} handleDelete={handleDelete} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(handleDelete).toHaveBeenCalledWith(mockEvent.id);
  });
});
