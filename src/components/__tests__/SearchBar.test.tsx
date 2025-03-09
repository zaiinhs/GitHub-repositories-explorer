import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../SearchBar";

// Mock fetch globally
global.fetch = jest.fn();

describe("SearchBar", () => {
  const mockOnSearchResults = jest.fn();
  const mockOnSearchStart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders search input and button", () => {
    render(
      <SearchBar
        onSearchResults={mockOnSearchResults}
        onSearchStart={mockOnSearchStart}
      />
    );

    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("handles successful search", async () => {
    const mockData = {
      items: [
        { id: 1, login: "user1" },
        { id: 2, login: "user2" },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <SearchBar
        onSearchResults={mockOnSearchResults}
        onSearchStart={mockOnSearchStart}
      />
    );

    const input = screen.getByPlaceholderText("Enter username");
    const button = screen.getByRole("button", { name: /search/i });

    await userEvent.type(input, "test");
    await userEvent.click(button);

    expect(mockOnSearchStart).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockOnSearchResults).toHaveBeenCalledWith(mockData.items);
    });
  });

  it("handles no results", async () => {
    const mockData = { items: [] };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <SearchBar
        onSearchResults={mockOnSearchResults}
        onSearchStart={mockOnSearchStart}
      />
    );

    const input = screen.getByPlaceholderText("Enter username");
    const button = screen.getByRole("button", { name: /search/i });

    await userEvent.type(input, "nonexistentuser");
    await userEvent.click(button);

    expect(mockOnSearchStart).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/No users found matching/)).toBeInTheDocument();
      expect(mockOnSearchResults).toHaveBeenCalledWith([]);
    });
  });

  it("handles API error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    render(
      <SearchBar
        onSearchResults={mockOnSearchResults}
        onSearchStart={mockOnSearchStart}
      />
    );

    const input = screen.getByPlaceholderText("Enter username");
    const button = screen.getByRole("button", { name: /search/i });

    await userEvent.type(input, "test");
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Error searching for users")).toBeInTheDocument();
      expect(mockOnSearchResults).toHaveBeenCalledWith([]);
    });
  });

  it("handles Enter key press", async () => {
    const mockData = { items: [{ id: 1, login: "user1" }] };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <SearchBar
        onSearchResults={mockOnSearchResults}
        onSearchStart={mockOnSearchStart}
      />
    );

    const input = screen.getByPlaceholderText("Enter username");
    await userEvent.type(input, "test{enter}");

    expect(mockOnSearchStart).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockOnSearchResults).toHaveBeenCalledWith(mockData.items);
    });
  });
});
