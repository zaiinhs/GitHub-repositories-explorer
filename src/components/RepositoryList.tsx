"use client";

import { useEffect, useState } from "react";
import { Repository } from "@/types/github";

interface RepositoryListProps {
  username: string;
  onBack: () => void;
}

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="p-5 bg-white dark:bg-gray-800 rounded-lg
                 border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="flex items-center gap-3">
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-3/4" />
          <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-1/2" />
        </div>
        <div className="flex gap-3 mt-3">
          <div className="h-5 w-16 bg-blue-100 dark:bg-blue-900/20 rounded-full" />
          <div className="h-5 w-20 bg-blue-100 dark:bg-blue-900/20 rounded-full" />
          <div className="h-5 w-24 bg-blue-100 dark:bg-blue-900/20 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export default function RepositoryList({
  username,
  onBack,
}: RepositoryListProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=stars&direction=desc`
        );
        const data = await response.json();

        if (response.ok) {
          setRepositories(data);
        } else {
          setError(data.message || "Failed to fetch repositories");
        }
      } catch (error) {
        setError("Error fetching repositories");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepositories();
  }, [username]);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 
                   dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {username} Repositories
        </h2>
      </div>

      {isLoading && <LoadingSkeleton />}

      {error && (
        <p className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          {error}
        </p>
      )}

      {!isLoading && !error && (
        <div className="flex flex-col gap-4">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="p-5 bg-white dark:bg-gray-800 rounded-lg
                       shadow-sm hover:shadow-md transition-all duration-200
                       border border-gray-100 dark:border-gray-700
                       transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-blue-500 hover:text-blue-600 
                           dark:text-blue-400 dark:hover:text-blue-300
                           hover:underline transition-colors"
                >
                  {repo.name}
                </a>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2.5 py-1 rounded-full text-sm">
                    <span>{repo.stargazers_count}</span>
                    <span className="text-yellow-500">★</span>
                  </span>
                  {repo.language && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {repo.language}
                    </span>
                  )}
                </div>
              </div>
              {repo.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {repo.description}
                </p>
              )}
              <div className="flex gap-3 mt-3 text-xs">
                {repo.topics?.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 
                             text-blue-600 dark:text-blue-300 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
