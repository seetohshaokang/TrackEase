import { fireEvent, render, screen } from "@testing-library/react";
import Event from "./../_components/Event.js";

const eventMock = {
  id: "1",
  summary: "Test Event",
  start: { dateTime: "2024-07-08T10:00:00Z", timeZone: "UTC" },
  end: { dateTime: "2024-07-08T11:00:00Z", timeZone: "UTC" },
  htmlLink: "https://calendar.google.com/",
};

describe("Event Component", () => {
  test("renders event details", () => {
    render(<Event event={eventMock} handleDelete={() => {}} />);

    expect(screen.getByText(/Test Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Start:/i)).toBeInTheDocument();
    expect(screen.getByText(/End:/i)).toBeInTheDocument();
    expect(screen.getByText(/View on Google Calendar/i)).toBeInTheDocument();
  });

  test("calls handleDelete when delete button is clicked", () => {
    const handleDelete = jest.fn();
    render(<Event event={eventMock} handleDelete={handleDelete} />);

    fireEvent.click(screen.getByText(/Delete/i));
    expect(handleDelete).toHaveBeenCalledWith("1");
  });
});
