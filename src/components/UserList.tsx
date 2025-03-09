"use client";

import { User } from "@/types/github";

interface UserListProps {
  users: User[];
  onUserSelect: (username: string) => void;
  isLoading?: boolean;
}

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-3">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 
                 rounded-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

export default function UserList({
  users,
  onUserSelect,
  isLoading = false,
}: UserListProps) {
  // Get the search query from the first user's login
  const searchQuery = users[0]?.login?.toLowerCase();

  if (isLoading) {
    return (
      <div className="mt-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse" />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Showing users for "{searchQuery}"
      </p>
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onUserSelect(user.login)}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 
                     hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg 
                     transition-all duration-200 text-left
                     shadow-sm hover:shadow-md border border-gray-100
                     dark:border-gray-700 dark:text-white
                     transform hover:-translate-y-0.5"
          >
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className="w-12 h-12 rounded-full ring-2 ring-gray-100 dark:ring-gray-700"
            />
            <div>
              <span className="font-medium text-gray-900 dark:text-white block">
                {user.login}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                View repositories →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
