import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
      set: jest.fn(),
    };
  },
}));

// Mock next/themes if you're using it
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
  }),
}));
