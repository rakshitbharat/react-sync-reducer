# react-use-reducer-wth-redux

[![npm version](https://badge.fury.io/js/react-use-reducer-wth-redux.svg)](https://badge.fury.io/js/react-use-reducer-wth-redux)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A synchronous state management solution for React that addresses the limitations of `useReducer`.

## 🏃‍♂️ Quick Migration from useReducer

### Step 1: Replace useReducer with createSyncStore

```typescript
// Before: Your existing reducer code
const initialState = { count: 0 };
const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      return state;
  }
};

// After: Just wrap it with createSyncStore
import { createSyncStore } from 'react-use-reducer-wth-redux';
export const store = createSyncStore(reducer, initialState);

// That's it! Now you can access your state anywhere:
console.log(store.getState()); // Get state anywhere
store.dispatch({ type: 'INCREMENT' }); // Dispatch anywhere
```

### Step 2: Update Your Components

```typescript
// Before: Component with useReducer
const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <button onClick={() => dispatch({ type: 'INCREMENT' })}>{state.count}</button>;
};

// After: Just change the import and hook
const Counter = () => {
  const [state, dispatch] = store.useSyncReducer();
  return <button onClick={() => dispatch({ type: 'INCREMENT' })}>{state.count}</button>;
};
```

### Step 3: Access State Anywhere (The Main Benefit!)

```typescript
// In event handlers - get state immediately after dispatch
const handleClick = () => {
  store.dispatch({ type: 'INCREMENT' });
  console.log(store.getState().count); // ✅ Updated value!
};

// In services/utils
export const myService = {
  doSomething: () => {
    if (store.getState().count > 10) {
      // Do something
    }
  }
};

// In async functions
async function fetchData() {
  store.dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const data = await api.get('/data');
    // ✅ Check loading state immediately
    if (store.getState().loading) {
      store.dispatch({ type: 'SET_DATA', payload: data });
    }
  } catch (error) {
    store.dispatch({ type: 'SET_ERROR', payload: error });
  }
}
```

### Quick Tips

- **Direct State Access**: Use `store.getState()` anywhere
- **Global Updates**: Use `store.dispatch()` from any file
- **Component Updates**: Use `store.useSyncReducer()` in components
- **Optimized Renders**: Use `store.useSyncSelector(state => state.someField)`
- **Testing**: Reset store with `store.reset()`

## 🤔 The Problem

With React's built-in `useReducer`, you can't access the updated state immediately after dispatching:

```typescript
// ❌ The Problem with useReducer
function CounterWithUseReducer() {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return { count: state.count + 1 };
      default:
        return state;
    }
  }, { count: 0 });

  const handleClick = () => {
    dispatch({ type: 'INCREMENT' });
    // 😕 state.count is still the old value
    console.log(state.count); // Logs old value
    
    // Common workarounds:
    // 1. Use useEffect (adds complexity)
    // 2. Use refs (harder to maintain)
    // 3. Split into multiple functions (breaks flow)
  };

  return <button onClick={handleClick}>{state.count}</button>;
}
```

## ✨ The Solution

Our package provides immediate state access after dispatch:

```typescript
// ✅ The Solution with react-use-reducer-wth-redux
import { createSyncStore } from 'react-use-reducer-wth-redux';

const counterStore = createSyncStore(
  (state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return { count: state.count + 1 };
      default:
        return state;
    }
  },
  { count: 0 }
);

function CounterWithSyncStore() {
  const [state, dispatch] = counterStore.useSyncReducer();

  const handleClick = () => {
    dispatch({ type: 'INCREMENT' });
    // ✅ Get updated state immediately!
    console.log(counterStore.getState().count); // Logs new value
    
    // Can use the new state right away
    if (counterStore.getState().count === 10) {
      showCelebration();
    }
  };

  return <button onClick={handleClick}>{state.count}</button>;
}
```

## 🚀 Key Benefits

1. **Synchronous State Access**: No waiting for the next render
2. **Familiar API**: Works just like `useReducer`
3. **Type-Safe**: Full TypeScript support
4. **React 18 Ready**: Built on modern React patterns
5. **Optimized Renders**: Optional selector support
6. **SSR Compatible**: Works with Next.js/Remix

## Features

- **Reducer Logic:** Manage state updates using familiar reducer functions.
- **Synchronous Access:** Get the latest state immediately after dispatch using `store.getState()`.
- **React Integration:** Hooks (`useSyncReducer`, `useSyncSelector`) powered by `useSyncExternalStore` for optimal React 18+ compatibility.
- **Isolated Stores:** Create multiple independent state stores using the `createSyncStore` factory.
- **Selector Support:** Efficiently subscribe to specific state slices or derived data using `useSyncSelector`.
- **TypeScript:** Fully typed for a better developer experience.

## Installation

```bash
npm install react-use-reducer-wth-redux
# or
yarn add react-use-reducer-wth-redux
# or
pnpm add react-use-reducer-wth-redux
```

## Basic Usage

```typescript
// store/counterStore.ts
import { createSyncStore } from 'react-use-reducer-wth-redux';

// Define your state and action types
type State = { count: number };
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET'; payload: number };

const initialState: State = { count: 0 };

// Create your reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'SET':
      return { count: action.payload };
    default:
      return state;
  }
}

// Create your store instance
export const counterStore = createSyncStore(reducer, initialState);

// Optional: Create custom hooks for this store
export const useCounter = counterStore.useSyncReducer;
export const useCountValue = () =>
  counterStore.useSyncSelector((state) => state.count);
```

### Using in Components

```tsx
// components/Counter.tsx
import React from 'react';
import { counterStore, useCounter, useCountValue } from '../store/counterStore';

// Component using full state and dispatch
const CounterControls = () => {
  const [state, dispatch] = useCounter();

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 0 })}>
        Reset
      </button>
    </div>
  );
};

// Component using selector for optimized renders
const CountDisplay = () => {
  const count = useCountValue();
  return <span>Current count: {count}</span>;
};

// Using direct store methods outside components
const logCount = () => {
  console.log('Current count:', counterStore.getState().count);
};

// Subscribe to changes
const unsubscribe = counterStore.subscribe(() => {
  console.log('Store updated:', counterStore.getState());
});

// Clean up subscription when needed
// unsubscribe();
```

## Advanced Usage

### Complex State with Selectors

```typescript
// store/userStore.ts
import { createSyncStore } from 'react-use-reducer-wth-redux';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
}

interface State {
  user: User | null;
  settings: Settings;
  isLoading: boolean;
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: State = {
  user: null,
  settings: {
    theme: 'light',
    notifications: true
  },
  isLoading: false
};

const userStore = createSyncStore(reducer, initialState);

// Custom equality function example
const areSettingsEqual = (a: Settings, b: Settings) =>
  a.theme === b.theme && a.notifications === b.notifications;

// Usage in component
const UserSettings = () => {
  const settings = userStore.useSyncSelector(
    state => state.settings,
    areSettingsEqual // Optional equality function
  );

  return (
    <div>
      <h3>Settings</h3>
      <p>Theme: {settings.theme}</p>
      <p>Notifications: {settings.notifications ? 'On' : 'Off'}</p>
    </div>
  );
};
```

### TypeScript Support

The package is written in TypeScript and provides full type safety:

```typescript
import { createSyncStore, type Reducer } from 'react-use-reducer-wth-redux';

// Your types
type State = {
  /* ... */
};
type Action = {
  /* ... */
};

// Fully typed reducer
const reducer: Reducer<State, Action> = (state, action) => {
  // TypeScript provides full type inference here
  return state;
};

const store = createSyncStore(reducer, initialState);
// store.dispatch() will only accept valid Action types
// store.getState() will return State type
```

## Server-Side Rendering (SSR) Support

The package uses `useSyncExternalStore` internally, which provides built-in support for SSR:

```typescript
// The store's getServerState() method is used automatically
// during SSR to provide the correct initial state
const App = () => {
  const [state] = userStore.useSyncReducer();
  return <div>{/* Your app */}</div>;
};
```

## API Reference

### `createSyncStore<State, Action>(reducer, initialState)`

Creates a new store instance with the following methods:

- `getState(): State` - Get current state synchronously
- `dispatch(action: Action): void` - Dispatch an action
- `subscribe(listener: () => void): () => void` - Subscribe to changes
- `getServerState(): State` - Get state for SSR
- `useSyncReducer(): [State, Dispatch<Action>]` - React hook for full state
- `useSyncSelector<Selected>(selector, equalityFn?): Selected` - React hook for state selection
- `reset(): void` - Reset store to initial state

## Detailed Usage Examples

### Standard useReducer Replacement

```typescript
// Before (with React's useReducer)
const MyComponent = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const handleAction = async () => {
    dispatch({ type: 'START_LOADING' });
    // ❌ state.loading is still false here
    const result = await fetchData();
    dispatch({ type: 'SET_DATA', payload: result });
  };
};

// After (with react-use-reducer-wth-redux)
const store = createSyncStore(reducer, initialState);

const MyComponent = () => {
  const [state, dispatch] = store.useSyncReducer();
  
  const handleAction = async () => {
    dispatch({ type: 'START_LOADING' });
    // ✅ Can check loading state immediately
    if (store.getState().loading) {
      const result = await fetchData();
      dispatch({ type: 'SET_DATA', payload: result });
    }
  };
};
```

## Examples

Check out the [tests directory](https://github.com/rakshitbharat/react-use-reducer-wth-redux/tree/main/tests) for more usage examples.

## License

MIT © [Rakshit Bharat](https://github.com/rakshitbharat)
