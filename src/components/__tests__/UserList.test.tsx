import { render, screen, fireEvent } from "@testing-library/react";
import UserList from "../UserList";
import { User } from "@/types/github";

describe("UserList", () => {
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

  const mockOnUserSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user list correctly", () => {
    render(<UserList users={mockUsers} onUserSelect={mockOnUserSelect} />);

    expect(screen.getByText("testuser1")).toBeInTheDocument();
    expect(screen.getByText("testuser2")).toBeInTheDocument();
    expect(
      screen.getByText('Showing users for "testuser1"')
    ).toBeInTheDocument();

    const avatars = screen.getAllByRole("img");
    expect(avatars).toHaveLength(2);
    expect(avatars[0]).toHaveAttribute(
      "src",
      "https://example.com/avatar1.jpg"
    );
    expect(avatars[0]).toHaveAttribute("alt", "testuser1's avatar");
  });

  it("calls onUserSelect when a user is clicked", () => {
    render(<UserList users={mockUsers} onUserSelect={mockOnUserSelect} />);

    const firstUser = screen.getByText("testuser1");
    fireEvent.click(firstUser.parentElement!.parentElement!);

    expect(mockOnUserSelect).toHaveBeenCalledWith("testuser1");
  });

  it("renders loading skeleton when isLoading is true", () => {
    render(
      <UserList users={[]} onUserSelect={mockOnUserSelect} isLoading={true} />
    );

    // Check for loading skeleton elements
    const skeletonElements = screen
      .getAllByRole("generic")
      .filter((element) => element.className.includes("animate-pulse"));
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it("handles empty users array", () => {
    render(<UserList users={[]} onUserSelect={mockOnUserSelect} />);

    // Since searchQuery is undefined when users is empty, we should not see the "Showing users for" text
    expect(screen.queryByText(/Showing users for/)).not.toBeInTheDocument();
  });

  it('displays "View repositories" text for each user', () => {
    render(<UserList users={mockUsers} onUserSelect={mockOnUserSelect} />);

    const viewReposLinks = screen.getAllByText("View repositories →");
    expect(viewReposLinks).toHaveLength(2);
  });
});
