import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTaskPage from "../pages/CreateTaskPage";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

// Mock del hook useApi
jest.mock("../hooks/useApi");

// Mock del hook useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("CreateTaskPage Component", () => {
  const mockRequest = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({ request: mockRequest });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

 

  test("updates input values", () => {
    render(<CreateTaskPage />);

    const titleInput = screen.getByPlaceholderText("Title") as HTMLInputElement;
    const descInput = screen.getByPlaceholderText("Description") as HTMLTextAreaElement;

    fireEvent.change(titleInput, { target: { value: "My Task" } });
    fireEvent.change(descInput, { target: { value: "Some description" } });

    expect(titleInput.value).toBe("My Task");
    expect(descInput.value).toBe("Some description");
  });

  test("submits the form and navigates on success", async () => {
    mockRequest.mockResolvedValueOnce({ ok: true });

    render(<CreateTaskPage />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Test Description" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Task" }));

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledWith("https://localhost:7179/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: "Test Task",
          description: "Test Description",
        }),
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/tasks");
  });

  test("shows alert on error", async () => {
    mockRequest.mockResolvedValueOnce({ ok: false });

    window.alert = jest.fn();

    render(<CreateTaskPage />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "Task Fail" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Error case" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Task" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Error creating task");
    });
  });

  test("disables button while loading", async () => {
    mockRequest.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 200))
    );

    render(<CreateTaskPage />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "Loading Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Testing loading state" },
    });

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button.textContent).toBe("Creating...");
  });
});
