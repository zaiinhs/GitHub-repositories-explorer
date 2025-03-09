"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import UserList from "@/components/UserList";
import RepositoryList from "@/components/RepositoryList";
import ThemeToggle from "@/components/ThemeToggle";
import { User } from "@/types/github";

export default function Home() {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = (users: User[]) => {
    setSearchResults(users);
    setIsSearching(false);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">GitHub User Search</h1>
          <ThemeToggle />
        </div>
        <SearchBar
          onSearchResults={handleSearchResults}
          onSearchStart={() => setIsSearching(true)}
        />
        {(searchResults.length > 0 || isSearching) && !selectedUser && (
          <UserList
            users={searchResults}
            onUserSelect={setSelectedUser}
            isLoading={isSearching}
          />
        )}
        {selectedUser && (
          <RepositoryList
            username={selectedUser}
            onBack={() => setSelectedUser(null)}
          />
        )}
      </div>
    </main>
  );
}
