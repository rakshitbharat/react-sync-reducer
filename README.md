# react-use-reducer-wth-redux

[![npm version](https://badge.fury.io/js/react-use-reducer-wth-redux.svg)](https://badge.fury.io/js/react-use-reducer-wth-redux)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A React state management utility providing a `useReducer`-like hook with synchronous state access and selector support. Uses a factory function (`createSyncStore`) to create isolated state containers.

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
export const useCountValue = () => counterStore.useSyncSelector(state => state.count);
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
      <button onClick={() => dispatch({ type: 'SET', payload: 0 })}>Reset</button>
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
type State = { /* ... */ };
type Action = { /* ... */ };

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

## Examples

Check out the [tests directory](https://github.com/rakshitbharat/react-use-reducer-wth-redux/tree/main/tests) for more usage examples.

## License

MIT © [Rakshit Bharat](https://github.com/rakshitbharat)
