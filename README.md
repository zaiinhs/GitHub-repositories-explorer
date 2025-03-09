# GitHub User Search

A modern web application built with Next.js and TypeScript that allows users to search for GitHub users and view their repositories. The application features a responsive design, dark mode support, and real-time feedback.

## 🚀 Features

### 1. User Search

- Real-time GitHub user search using GitHub's REST API
- Displays up to 5 matching users per search
- Loading states with skeleton animations
- Error handling with toast notifications
- Responsive design that works on all screen sizes

### 2. Theme Support

- Light and dark mode support
- System preference detection
- Theme persistence across sessions
- Smooth theme transitions

### 3. Repository View

- Displays user repositories sorted by stars
- Shows repository details including:
  - Star count
  - Programming language
  - Description
  - Topics (up to 3)
- Loading skeleton for better UX
- Error handling for API failures

### 4. UI/UX Features

- Interactive hover effects
- Loading states for all actions
- Error notifications with auto-dismiss
- Keyboard support (Enter to search)
- Accessible design with ARIA attributes

## 🛠 Technical Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **API Integration**: GitHub REST API
- **Component Architecture**: Functional Components with Hooks

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout with theme initialization
│   └── globals.css        # Global styles
├── components/
│   ├── SearchBar.tsx      # User search component
│   ├── UserList.tsx       # User results display
│   ├── RepositoryList.tsx # Repository listing
│   ├── ThemeToggle.tsx    # Theme switcher
│   └── Toast.tsx          # Notification component
└── types/
    └── github.ts          # TypeScript interfaces for GitHub data
```

## 🔄 Component Flow

### Search Flow

1. User enters username in SearchBar
2. `handleSearch` function is triggered (on Enter or button click)
3. Loading state is activated
4. API call to GitHub is made
5. Results are processed:
   - Success: Users are displayed in UserList
   - No results: Error toast is shown
   - Error: Error toast with message is shown

### Theme Toggle Flow

1. Initial theme is determined from:
   - localStorage preference
   - System preference (if no localStorage)
2. Theme is applied to `html` element
3. User can toggle theme via button
4. New theme is:
   - Applied immediately
   - Saved to localStorage
   - Animated smoothly with CSS transitions

### Repository View Flow

1. User clicks on a user card
2. Loading state with skeleton is shown
3. API call fetches repositories
4. Results are displayed with:
   - Repository name and link
   - Star count
   - Language
   - Description
   - Topics
5. Error handling with user-friendly messages

## 🎨 Styling Architecture

### Theme System

```typescript
// Tailwind dark mode configuration
darkMode: "class"

// CSS Variables
:root {
  --foreground: #000;
  --background: #fff;
}

.dark {
  --foreground: #fff;
  --background: #1a1a1a;
}
```

### Animation System

```typescript
// Tailwind configuration
keyframes: {
  slideIn: {
    '0%': { transform: 'translateX(100%)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  }
},
animation: {
  'slideIn': 'slideIn 0.5s ease-out',
}
```

## 🔒 Error Handling

### API Errors

- Network failures
- Rate limiting
- Invalid responses
- Empty results

### User Feedback

- Toast notifications
- Loading states
- Skeleton loaders
- Error messages

## 🌐 API Integration

### GitHub API Endpoints

- User Search: `GET /search/users`
- Repository List: `GET /users/{username}/repos`

### Rate Limiting

- Handles GitHub API rate limiting
- Shows appropriate error messages
- Graceful degradation on API failures

## 🎯 Performance Optimizations

1. **Code Splitting**

   - Component-level code splitting
   - Dynamic imports where necessary

2. **State Management**

   - Local state with useState
   - Memoization with useCallback
   - Effect cleanup with useEffect

3. **Loading States**
   - Skeleton loaders
   - Progressive loading
   - Optimistic UI updates

## 🔍 Search Implementation

```typescript
const handleSearch = async (username: string) => {
  // Input validation
  if (!username.trim()) return;

  // API call
  const response = await fetch(
    `https://api.github.com/search/users?q=${username}&per_page=5`
  );

  // Response handling
  if (response.ok) {
    const data = await response.json();
    if (data.items.length === 0) {
      // No results handling
    } else {
      // Success handling
    }
  }
};
```

## 🚦 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## 📝 Development Guidelines

1. **Component Creation**

   - Use functional components
   - Implement proper TypeScript interfaces
   - Include proper prop validation
   - Add JSDoc comments for complex functions

2. **Styling**

   - Use Tailwind CSS classes
   - Follow mobile-first approach
   - Maintain dark mode support
   - Use CSS variables for theme values

3. **Error Handling**

   - Implement try-catch blocks
   - Show user-friendly error messages
   - Log errors appropriately
   - Handle edge cases

4. **Testing**

   ### Test Structure

   ```
   src/
   └── components/
       └── __tests__/
           ├── SearchBar.test.tsx    # Unit tests for SearchBar
           ├── UserList.test.tsx     # Unit tests for UserList
           └── integration.test.tsx  # Integration tests
   ```

   ### Testing Stack

   - Jest as the test runner
   - React Testing Library for component testing
   - jest-dom for DOM assertions
   - user-event for simulating user interactions

   ### Test Types

   #### Unit Tests

   - Component rendering
   - User interactions
   - Props validation
   - State changes
   - Error handling
   - Loading states

   #### Integration Tests

   - Component interactions
   - Data flow between components
   - API call handling
   - Error propagation
   - State synchronization

   ### Test Coverage

   - Component rendering states
   - User interactions (click, type, etc.)
   - API success and error scenarios
   - Empty states and edge cases
   - Theme-related functionality

   ### Testing Utilities

   ```typescript
   // Mock Setup
   global.fetch = jest.fn();

   // Navigation Mocks
   jest.mock("next/navigation", () => ({
     useRouter() {
       return { push: jest.fn() };
     },
   }));

   // Theme Mocks
   jest.mock("next-themes", () => ({
     useTheme: () => ({ theme: "light" }),
   }));
   ```

   ### Running Tests

   ```bash
   # Run all tests
   npm test

   # Run tests in watch mode
   npm run test:watch

   # Run tests with coverage report
   npm run test:coverage
   ```

## 🔄 Future Improvements

1. **Features**

   - Advanced search filters
   - User profile details
   - Repository statistics
   - Pagination support

2. **Technical**

   - API rate limit handling
   - Cache implementation
   - Performance optimizations
   - Accessibility improvements

3. **UI/UX**
   - More animation effects
   - Enhanced mobile experience
   - Additional theme options
   - Improved error messages
