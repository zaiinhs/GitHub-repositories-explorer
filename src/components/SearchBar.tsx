"use client";

import { useState, useCallback } from "react";
import { User } from "@/types/github";
import Toast from "./Toast";

interface SearchBarProps {
  onSearchResults: (users: User[]) => void;
  onSearchStart: () => void;
}

export default function SearchBar({
  onSearchResults,
  onSearchStart,
}: SearchBarProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!username.trim()) return;

    setIsLoading(true);
    setError(null);
    onSearchStart();

    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(
          username
        )}&per_page=5`
      );
      const data = await response.json();

      if (response.ok) {
        if (data.items.length === 0) {
          setError(`No users found matching "${username}"`);
          onSearchResults([]);
        } else {
          onSearchResults(data.items);
        }
      } else {
        setError(data.message || "Failed to fetch users");
        onSearchResults([]);
      }
    } catch (error) {
      setError("Error searching for users");
      onSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [username, onSearchResults, onSearchStart]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter username"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                   bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white 
                   dark:placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                   disabled:opacity-75 dark:bg-blue-600 dark:hover:bg-blue-700
                   transition-all duration-200 min-w-[100px]
                   flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Searching</span>
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
          duration={5000}
        />
      )}
    </div>
  );
}
