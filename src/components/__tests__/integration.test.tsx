import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../SearchBar";
import UserList from "../UserList";
import { User } from "@/types/github";

describe("SearchBar and UserList Integration", () => {
  const mockUsers: User[] = [
    {
      id: 1,
      login: "testuser1",
      avatar_url: "https://example.com/avatar1.jpg",
    },
    {
      id: 2,
      login: "testuser2",
      avatar_url: "https://example.com/avatar2.jpg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock) = jest.fn();
  });

  it("performs search and displays results in UserList", async () => {
    const mockOnUserSelect = jest.fn();
    let currentUsers: User[] = [];

    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: mockUsers }),
    });

    // Render both components
    const { rerender } = render(
      <div>
        <SearchBar
          onSearchResults={(users) => {
            currentUsers = users;
            // Force a rerender with the new users
            rerender(
              <div>
                <SearchBar
                  onSearchResults={(u) => {
                    currentUsers = u;
                    rerender(
                      <div>
                        <SearchBar
                          onSearchResults={(u) => {
                            currentUsers = u;
                          }}
                          onSearchStart={() => {
                            currentUsers = [];
                          }}
                        />
                        <UserList
                          users={currentUsers}
                          onUserSelect={mockOnUserSelect}
                        />
                      </div>
                    );
                  }}
                  onSearchStart={() => {
                    currentUsers = [];
                  }}
                />
                <UserList
                  users={currentUsers}
                  onUserSelect={mockOnUserSelect}
                />
              </div>
            );
          }}
          onSearchStart={() => {
            currentUsers = [];
          }}
        />
        <UserList users={currentUsers} onUserSelect={mockOnUserSelect} />
      </div>
    );

    // Perform search
    const searchInput = screen.getByPlaceholderText("Enter username");
    const searchButton = screen.getByRole("button", { name: /search/i });

    await userEvent.type(searchInput, "test");
    await userEvent.click(searchButton);

    // Wait for search results and verify UserList displays results
    await waitFor(() => {
      expect(screen.getByText("testuser1")).toBeInTheDocument();
    });
    expect(screen.getByText("testuser2")).toBeInTheDocument();

    // Test user selection
    const firstUser = screen.getByText("testuser1");
    await userEvent.click(firstUser.parentElement!.parentElement!);
    expect(mockOnUserSelect).toHaveBeenCalledWith("testuser1");
  });

  it("handles search with no results", async () => {
    const mockOnUserSelect = jest.fn();
    let currentUsers: User[] = [];

    // Mock API response with no results
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    });

    const { rerender } = render(
      <div>
        <SearchBar
          onSearchResults={(users) => {
            currentUsers = users;
            rerender(
              <div>
                <SearchBar
                  onSearchResults={(u) => {
                    currentUsers = u;
                  }}
                  onSearchStart={() => {
                    currentUsers = [];
                  }}
                />
                <UserList
                  users={currentUsers}
                  onUserSelect={mockOnUserSelect}
                />
              </div>
            );
          }}
          onSearchStart={() => {
            currentUsers = [];
          }}
        />
        <UserList users={currentUsers} onUserSelect={mockOnUserSelect} />
      </div>
    );

    // Perform search
    const searchInput = screen.getByPlaceholderText("Enter username");
    const searchButton = screen.getByRole("button", { name: /search/i });

    await userEvent.type(searchInput, "nonexistentuser");
    await userEvent.click(searchButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/No users found matching/)).toBeInTheDocument();
    });
  });

  it("handles API error gracefully", async () => {
    const mockOnUserSelect = jest.fn();
    let currentUsers: User[] = [];

    // Mock API error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    const { rerender } = render(
      <div>
        <SearchBar
          onSearchResults={(users) => {
            currentUsers = users;
            rerender(
              <div>
                <SearchBar
                  onSearchResults={(u) => {
                    currentUsers = u;
                  }}
                  onSearchStart={() => {
                    currentUsers = [];
                  }}
                />
                <UserList
                  users={currentUsers}
                  onUserSelect={mockOnUserSelect}
                />
              </div>
            );
          }}
          onSearchStart={() => {
            currentUsers = [];
          }}
        />
        <UserList users={currentUsers} onUserSelect={mockOnUserSelect} />
      </div>
    );

    // Perform search
    const searchInput = screen.getByPlaceholderText("Enter username");
    const searchButton = screen.getByRole("button", { name: /search/i });

    await userEvent.type(searchInput, "test");
    await userEvent.click(searchButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Error searching for users")).toBeInTheDocument();
    });
  });
});
