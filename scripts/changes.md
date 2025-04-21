Okay, here are the complete files for the `react-sync-reducer` package, formatted as requested.

--- START OF MODIFIED FILE package.json ---
```json
{
  "name": "react-sync-reducer",
  "version": "1.0.0",
  "description": "A React state management utility providing a useReducer-like hook with synchronous state access and selector support, powered by a factory function.",
  "main": "dist/cjs/index.js",
  "module": "dist/esm/index.js",
  "types": "dist/types/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/types/index.d.ts",
        "default": "./dist/esm/index.js"
      },
      "require": {
        "types": "./dist/types/index.d.ts",
        "default": "./dist/cjs/index.js"
      }
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "clean": "rimraf dist",
    "build:cjs": "tsc --project tsconfig.build.json --module commonjs --outDir dist/cjs",
    "build:esm": "tsc --project tsconfig.build.json --module ESNext --outDir dist/esm",
    "build:types": "tsc --project tsconfig.build.json --declaration --emitDeclarationOnly --outDir dist/types",
    "build": "npm run clean && npm run build:types && npm run build:cjs && npm run build:esm",
    "lint": "eslint \"src/**/*.{ts,tsx}\" --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx}\" \"tests/**/*.{ts,tsx}\" \"*.{js,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\" \"tests/**/*.{ts,tsx}\" \"*.{js,json,md}\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "typecheck": "tsc --noEmit",
    "validate": "npm run typecheck && npm run lint && npm run format:check && npm run test",
    "prepublishOnly": "npm run validate && npm run build"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/rakshitbharat/react-sync-reducer.git"
  },
  "keywords": [
    "react",
    "hooks",
    "state",
    "state management",
    "reducer",
    "synchronous",
    "zustand",
    "redux",
    "useReducer",
    "useSyncExternalStore",
    "factory"
  ],
  "author": "Rakshit Bharat",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/rakshitbharat/react-sync-reducer/issues"
  },
  "homepage": "https://github.com/rakshitbharat/react-sync-reducer#readme",
  "peerDependencies": {
    "react": "^16.8.0 || ^17.0.0 || ^18.0.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": false
    }
  },
  "dependencies": {
    "use-sync-external-store": "^1.2.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.5",
    "@testing-library/react": "^15.0.7",
    "@types/jest": "^29.5.12",
    "@types/react": "^18.3.3",
    "@types/use-sync-external-store": "^0.0.6",
    "@typescript-eslint/eslint-plugin": "^7.11.0",
    "@typescript-eslint/parser": "^7.11.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "eslint-plugin-react": "^7.34.2",
    "eslint-plugin-react-hooks": "^4.6.2",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "prettier": "^3.3.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "rimraf": "^5.0.7",
    "ts-jest": "^29.1.4",
    "typescript": "^5.4.5"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```
--- END OF MODIFIED FILE package.json ---

--- START OF MODIFIED FILE tsconfig.json ---
```json
{
  "compilerOptions": {
    "target": "ES2016",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "CommonJS", // Node tools default
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true, // This config is for type checking, linting, tests etc. Build uses tsconfig.build.json
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".", // Allows imports relative to root
    "paths": {
      "react-sync-reducer": ["./src/index"] // For potential internal testing imports
    },

    // Strictness Flags Enabled
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": false, // Sometimes tricky with class/constructor patterns, adjust if needed
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Linting-like checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "tests/**/*.ts", "tests/**/*.tsx", "jest.config.js", "setupTests.ts"],
  "exclude": ["node_modules", "dist"]
}
```
--- END OF MODIFIED FILE tsconfig.json ---

--- START OF MODIFIED FILE tsconfig.build.json ---
```json
{
  // This config is specifically for building the distributable files
  // It inherits settings from the base tsconfig.json
  "extends": "./tsconfig.json",
  "compilerOptions": {
    // Overrides for build output
    "noEmit": false, // We *do* want to emit files
    "declaration": true, // Generate .d.ts files
    "declarationMap": false, // Optional: source maps for declarations
    "sourceMap": true, // Generate .map files for JS
    "outDir": "dist", // Base directory for output (will be overridden by scripts)
    "isolatedModules": false // Not strictly needed for build output
  },
  "include": ["src/**/*"], // Only include source files in the build
  "exclude": ["node_modules", "dist", "tests"] // Exclude dev dependencies and tests
}
```
--- END OF MODIFIED FILE tsconfig.build.json ---

--- START OF MODIFIED FILE jest.config.js ---
```javascript
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json', // Use the main tsconfig for tests
      },
    ],
  },
  testMatch: ['**/tests/**/*.test.(ts|tsx)'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    // If you need to map module paths (e.g., for aliases)
    // '^@src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.ts', // Usually not necessary to test index files
    '!src/types.ts', // No executable code in types files
    '!src/**/*.d.ts',
  ],
};
```
--- END OF MODIFIED FILE jest.config.js ---

--- START OF MODIFIED FILE setupTests.ts ---
```typescript
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// You can add other global setup configurations here if needed
// For example, mocking global objects or functions
```
--- END OF MODIFIED FILE setupTests.ts ---

--- START OF MODIFIED FILE .eslintrc.js ---
```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Uses recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:react-hooks/recommended', // Enforces Rules of Hooks
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  env: {
    browser: true, // enable browser global variables
    node: true, // enable Node.js global variables and Node.js scoping
    es2021: true, // enable ES2021 globals
    jest: true, // enable Jest global variables
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'react/prop-types': 'off', // Disable prop-types as we use TypeScript for type checking
    'react/react-in-jsx-scope': 'off', // Disable requirement for React import (new JSX transform)
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow implicit return types for module boundaries (can be enabled for stricter checks)
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn about unused vars, allow underscore prefix
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn on console.log, allow warn/error
    'prettier/prettier': ['warn', {}, { usePrettierrc: true }], // Integrate prettier formatting checks
  },
  ignorePatterns: ['node_modules/', 'dist/', 'coverage/', '*.js', '*.json'], // Ignore compiled JS, configs at root
};
```
--- END OF MODIFIED FILE .eslintrc.js ---

--- START OF MODIFIED FILE .prettierrc.json ---
```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```
--- END OF MODIFIED FILE .prettierrc.json ---

--- START OF MODIFIED FILE .gitignore ---
```gitignore
# Node dependencies
node_modules/

# Build output
dist/
coverage/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Environment variables
.env
.env.*
!.env.example

# IDE files
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Operating system files
.DS_Store
Thumbs.db

# Optional config files
*.local

# Test artifacts
junit.xml
```
--- END OF MODIFIED FILE .gitignore ---

--- START OF MODIFIED FILE README.md ---
```markdown
# react-sync-reducer

[![npm version](https://badge.fury.io/js/react-sync-reducer.svg)](https://badge.fury.io/js/react-sync-reducer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A React state management utility providing a `useReducer`-like hook with synchronous state access and selector support. Uses a factory function (`createSyncStore`) to create isolated state containers.

## Features

*   **Reducer Logic:** Manage state updates using familiar reducer functions.
*   **Synchronous Access:** Get the latest state immediately after dispatch using `store.getState()`.
*   **React Integration:** Hooks (`useSyncReducer`, `useSyncSelector`) powered by `useSyncExternalStore` for optimal React 18+ compatibility.
*   **Isolated Stores:** Create multiple independent state stores using the `createSyncStore` factory.
*   **Selector Support:** Efficiently subscribe to specific state slices or derived data using `useSyncSelector`.
*   **TypeScript:** Fully typed for a better developer experience.

## Installation

```bash
npm install react-sync-reducer
# or
yarn add react-sync-reducer
# or
pnpm add react-sync-reducer
```

## Basic Usage

```typescript
// src/store/counterStore.ts
import { createSyncStore } from 'react-sync-reducer';

type State = { count: number };
type Action = { type: 'INCREMENT' } | { type: 'DECREMENT' } | { type: 'RESET' };

const initialState: State = { count: 0 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const counterStore = createSyncStore(reducer, initialState);

// Export hooks specific to this store instance
export const useCounter = counterStore.useSyncReducer;
export const useCounterSelector = counterStore.useSyncSelector;
export const dispatchCounterAction = counterStore.dispatch;
export const getCounterState = counterStore.getState;

// src/components/Counter.tsx
import React from 'react';
import { useCounter, dispatchCounterAction, useCounterSelector } from '../store/counterStore';

const CounterDisplay = () => {
  // Select only the count value
  const count = useCounterSelector((state) => state.count);
  console.log('CounterDisplay render');
  return <p>Count: {count}</p>;
};

const CounterControls = () => {
    // Get the dispatch function (can also get state here if needed)
    // const [state, dispatch] = useCounter(); // Alternative: gets full state and dispatch
    const dispatch = dispatchCounterAction;
    console.log('CounterControls render');

    return (
        <div>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>
            <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
        </div>
    );
};


export const Counter = () => {
  return (
    <div>
      <h2>Counter Example</h2>
      <CounterDisplay />
      <CounterControls />
    </div>
  );
};
```

## API

### `createSyncStore(reducer, initialState)`

Creates a new store instance.

*   **`reducer`**: `(state: State, action: Action) => State` - Your reducer function.
*   **`initialState`**: `State` - The initial state object.

Returns a `SyncStore` object with the following methods and hooks:

*   **`getState()`**: `() => State` - Returns the current state synchronously.
*   **`dispatch(action: Action)`**: `(action: Action) => void` - Dispatches an action to the reducer.
*   **`subscribe(listener: () => void)`**: `(listener: () => void) => () => void` - Subscribes a listener function to state changes. Returns an unsubscribe function.
*   **`getServerState()`**: `() => State` - Returns the initial state (useful for SSR scenarios with `useSyncExternalStore`).
*   **`useSyncReducer()`**: `() => [State, (action: Action) => void]` - Hook to get the full state and dispatch function. Re-renders when state changes.
*   **`useSyncSelector(selector: (state: State) => Selected, equalityFn?: (a: Selected, b: Selected) => boolean)`**: `(selector, equalityFn?) => Selected` - Hook to subscribe to a selected part of the state. Re-renders only when the selected value changes (using `Object.is` by default, or the provided `equalityFn`).

## License

MIT
```
--- END OF MODIFIED FILE README.md ---

--- START OF MODIFIED FILE src/types.ts ---
```typescript

/**
 * A standard reducer function signature.
 * @template S The type of the state.
 * @template A The type of the actions.
 * @param state The current state.
 * @param action The action to process.
 * @returns The new state.
 */
export type Reducer<S, A> = (state: S, action: A) => S;

/**
 * A function to select a slice of state.
 * @template S The type of the state.
 * @template Selected The type of the selected slice.
 * @param state The current state.
 * @returns The selected slice of state.
 */
export type Selector<S, Selected> = (state: S) => Selected;

/**
 * A function to compare two values for equality.
 * Used by useSyncSelector to determine if a re-render is needed.
 * Defaults to Object.is.
 * @template Selected The type of the values being compared.
 * @param a The first value.
 * @param b The second value.
 * @returns True if the values are considered equal, false otherwise.
 */
export type EqualityFn<Selected> = (a: Selected, b: Selected) => boolean;

/**
 * The interface for the store instance created by createSyncStore.
 * @template S The type of the state.
 * @template A The type of the actions.
 */
export interface SyncStore<S, A> {
  /**
   * Returns the current state synchronously.
   * @returns {S} The current state.
   */
  getState: () => S;

  /**
   * Dispatches an action to the reducer, updating the state
   * and notifying subscribers.
   * @param {A} action The action to dispatch.
   */
  dispatch: (action: A) => void;

  /**
   * Subscribes a listener function to be called whenever the state changes.
   * @param {() => void} listener The callback function to execute on state change.
   * @returns {() => void} An unsubscribe function to remove the listener.
   */
  subscribe: (listener: () => void) => () => void;

  /**
   * Returns the initial state. Primarily used for server-side rendering (SSR)
   * hydration with `useSyncExternalStore`.
   * @returns {S} The initial state.
   */
  getServerState: () => S;

  /**
   * React hook to get the entire state object and the dispatch function.
   * Subscribes the component to store updates.
   * @returns {[S, (action: A) => void]} A tuple containing the current state and the dispatch function.
   */
  useSyncReducer: () => [S, (action: A) => void];

  /**
   * React hook to subscribe to a selected part of the state.
   * Only re-renders the component if the selected value changes.
   * @template Selected The type of the selected state slice.
   * @param {(state: S) => Selected} selector A function that selects a value from the state.
   * @param {(a: Selected, b: Selected) => boolean} [equalityFn=Object.is] Optional equality function
   *        to compare the selected value between renders. Defaults to `Object.is`.
   * @returns {Selected} The selected state value.
   */
  useSyncSelector: <Selected>(
    selector: Selector<S, Selected>,
    equalityFn?: EqualityFn<Selected>
  ) => Selected;

  /**
   * Resets the store to its initial state and clears all listeners.
   * Primarily useful for testing or specific application reset logic.
   */
  reset: () => void;
}
```
--- END OF MODIFIED FILE src/types.ts ---

--- START OF MODIFIED FILE src/createSyncStore.ts ---
```typescript
import { Reducer, SyncStore } from './types';
import { useSyncReducer } from './useSyncReducer';
import { useSyncSelector } from './useSyncSelector';

/**
 * Creates a new synchronized state store instance based on a reducer.
 *
 * This factory function encapsulates the state, reducer, and listeners,
 * allowing for multiple independent stores within an application. It provides
 * methods for synchronous state access, dispatching actions, subscribing to
 * changes, and React hooks for component integration.
 *
 * @template S The type of the state managed by the store.
 * @template A The type of the actions accepted by the reducer.
 *
 * @param {Reducer<S, A>} reducer The reducer function that handles state transitions.
 * @param {S} initialState The initial state of the store.
 *
 * @returns {SyncStore<S, A>} An object containing methods and hooks to interact with the store.
 *
 * @example
 * type State = { count: number };
 * type Action = { type: 'INCREMENT' } | { type: 'DECREMENT' };
 * const initialState: State = { count: 0 };
 * function reducer(state: State, action: Action): State {
 *   // ... reducer logic
 * }
 *
 * const counterStore = createSyncStore(reducer, initialState);
 *
 * // Accessing state synchronously
 * const currentState = counterStore.getState();
 *
 * // Dispatching an action
 * counterStore.dispatch({ type: 'INCREMENT' });
 *
 * // Using hooks in React components
 * const MyComponent = () => {
 *   const [state, dispatch] = counterStore.useSyncReducer();
 *   const count = counterStore.useSyncSelector(s => s.count);
 *   // ...
 * }
 */
export function createSyncStore<S, A>(
  reducer: Reducer<S, A>,
  initialState: S
): SyncStore<S, A> {
  let state: S = initialState;
  let listeners: Set<() => void> = new Set();

  const getState = (): S => {
    return state;
  };

  const dispatch = (action: A): void => {
    try {
      const nextState = reducer(state, action);
      if (!Object.is(state, nextState)) {
        state = nextState;
        // Notify listeners *after* state update
        listeners.forEach((listener) => listener());
      }
    } catch (error) {
      console.error('Error occurred during dispatch or in reducer:', error);
      // Depending on requirements, you might want to re-throw or handle differently
    }
  };

  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);
    // Return unsubscribe function
    return () => {
      listeners.delete(listener);
    };
  };

  // getServerState is needed for useSyncExternalStore for SSR compatibility/hydration.
  // In this simple case, it just returns the initial state.
  // For more complex SSR, this might need to return the state captured on the server.
  const getServerState = (): S => {
    return initialState;
  };

  const reset = (): void => {
    state = initialState;
    // Clear existing listeners, components using the hooks will re-subscribe
    listeners.clear();
    // Optionally, notify listeners after reset if needed, though clearing is often sufficient
    // listeners.forEach((listener) => listener());
    if (process.env.NODE_ENV !== 'production') {
      console.warn('SyncStore reset. Ensure this is intended, often used for testing.');
    }
  };


  // Bind hooks to this specific store instance
  const instanceUseSyncReducer = () =>
    useSyncReducer(subscribe, getState, getServerState, dispatch);
  const instanceUseSyncSelector = <Selected>(
    selector: (state: S) => Selected,
    equalityFn?: (a: Selected, b: Selected) => boolean
  ) =>
    useSyncSelector(
      subscribe,
      getState,
      getServerState,
      selector,
      equalityFn
    );

  return {
    getState,
    dispatch,
    subscribe,
    getServerState,
    useSyncReducer: instanceUseSyncReducer,
    useSyncSelector: instanceUseSyncSelector,
    reset,
  };
}
```
--- END OF MODIFIED FILE src/createSyncStore.ts ---

--- START OF MODIFIED FILE src/useSyncReducer.ts ---
```typescript
import { useSyncExternalStore } from 'use-sync-external-store/shim'; // Provides React 18+ and shim for older versions
import { useCallback } from 'react';

/**
 * Internal implementation hook used by SyncStore.useSyncReducer.
 * Leverages useSyncExternalStore for safe concurrent rendering integration.
 *
 * @template S State type.
 * @template A Action type.
 *
 * @param subscribe The store's subscribe function.
 * @param getState The store's getState function.
 * @param getServerState The store's getServerState function (for SSR).
 * @param dispatch The store's dispatch function.
 *
 * @returns A tuple containing the current state and the memoized dispatch function.
 */
export function useSyncReducer<S, A>(
  subscribe: (onStoreChange: () => void) => () => void,
  getState: () => S,
  getServerState: () => S,
  dispatch: (action: A) => void
): [S, (action: A) => void] {
  const state = useSyncExternalStore(subscribe, getState, getServerState);

  // Memoize dispatch to ensure stable identity across renders
  const stableDispatch = useCallback(
    (action: A) => {
      dispatch(action);
    },
    [dispatch] // Dependency array includes the original dispatch function
  );

  return [state, stableDispatch];
}
```
--- END OF MODIFIED FILE src/useSyncReducer.ts ---

--- START OF MODIFIED FILE src/useSyncSelector.ts ---
```typescript
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector'; // Use the selector-specific version
import { EqualityFn, Selector } from './types';

/**
 * Default equality function using Object.is comparison.
 */
const defaultEqualityFn: EqualityFn<unknown> = (a, b) => Object.is(a, b);

/**
 * Internal implementation hook used by SyncStore.useSyncSelector.
 * Leverages useSyncExternalStoreWithSelector for efficient selective subscriptions.
 *
 * @template S State type.
 * @template A Action type (not directly used, but part of store context).
 * @template Selected The type of the derived/selected state slice.
 *
 * @param subscribe The store's subscribe function.
 * @param getState The store's getState function.
 * @param getServerState The store's getServerState function (for SSR).
 * @param selector Function to select a slice of state.
 * @param equalityFn Optional function to compare selected values. Defaults to Object.is.
 *
 * @returns The selected state slice.
 */
export function useSyncSelector<S, Selected>(
  subscribe: (onStoreChange: () => void) => () => void,
  getState: () => S,
  getServerState: () => S,
  selector: Selector<S, Selected>,
  equalityFn: EqualityFn<Selected> = defaultEqualityFn
): Selected {
  const selectedState = useSyncExternalStoreWithSelector(
    subscribe,
    getState,
    getServerState,
    selector,
    equalityFn
  );

  return selectedState;
}
```
--- END OF MODIFIED FILE src/useSyncSelector.ts ---

--- START OF MODIFIED FILE src/index.ts ---
```typescript

// Public API Exports

export { createSyncStore } from './createSyncStore';
export type {
  SyncStore,
  Reducer,
  Selector,
  EqualityFn,
} from './types';
```
--- END OF MODIFIED FILE src/index.ts ---

--- START OF MODIFIED FILE tests/createSyncStore.test.ts ---
```typescript
import { createSyncStore } from '../src/createSyncStore';
import { Reducer } from '../src/types';

// Define simple state and actions for testing
type TestState = { count: number; message?: string };
type TestAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'RESET' };

const initialState: TestState = { count: 0 };

const reducer: Reducer<TestState, TestAction> = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'RESET':
      return initialState;
    default:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Unknown action type: ${(action as any).type}`);
  }
};

describe('createSyncStore', () => {
  it('should initialize with the initial state', () => {
    const store = createSyncStore(reducer, initialState);
    expect(store.getState()).toEqual(initialState);
    expect(store.getServerState()).toEqual(initialState); // For SSR check
  });

  it('should update state correctly on dispatch', () => {
    const store = createSyncStore(reducer, initialState);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toEqual({ count: 1 });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toEqual({ count: 2 });
    store.dispatch({ type: 'DECREMENT' });
    expect(store.getState()).toEqual({ count: 1 });
    store.dispatch({ type: 'SET_MESSAGE', payload: 'hello' });
    expect(store.getState()).toEqual({ count: 1, message: 'hello' });
  });

  it('should not update state if reducer returns the same state object', () => {
    const identicalStateReducer: Reducer<TestState, TestAction> = (state, _action) => {
        // Always return the exact same object reference
        return state;
    }
    const store = createSyncStore(identicalStateReducer, initialState);
    const listener = jest.fn();
    store.subscribe(listener);

    store.dispatch({ type: 'INCREMENT' }); // Action doesn't matter due to reducer

    expect(store.getState()).toBe(initialState); // Check object identity
    expect(listener).not.toHaveBeenCalled(); // Listener should not be called if state object is identical
  });

  it('should notify subscribers when state changes', () => {
    const store = createSyncStore(reducer, initialState);
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    store.subscribe(listener1);
    store.subscribe(listener2);

    store.dispatch({ type: 'INCREMENT' });

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);

    store.dispatch({ type: 'SET_MESSAGE', payload: 'world' });

    expect(listener1).toHaveBeenCalledTimes(2);
    expect(listener2).toHaveBeenCalledTimes(2);
  });

  it('should not notify unsubscribed listeners', () => {
    const store = createSyncStore(reducer, initialState);
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    const unsubscribe1 = store.subscribe(listener1);
    store.subscribe(listener2);

    store.dispatch({ type: 'INCREMENT' });
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);

    unsubscribe1(); // Unsubscribe listener1

    store.dispatch({ type: 'DECREMENT' });
    expect(listener1).toHaveBeenCalledTimes(1); // Should not have been called again
    expect(listener2).toHaveBeenCalledTimes(2);
  });

  it('should allow multiple independent store instances', () => {
    const store1 = createSyncStore(reducer, { count: 10 });
    const store2 = createSyncStore(reducer, { count: 100 });

    store1.dispatch({ type: 'INCREMENT' });
    store2.dispatch({ type: 'DECREMENT' });

    expect(store1.getState()).toEqual({ count: 11 });
    expect(store2.getState()).toEqual({ count: 99 });
  });

  it('should handle errors within the reducer gracefully', () => {
    const errorReducer: Reducer<TestState, TestAction> = (state, action) => {
      if (action.type === 'INCREMENT') {
        throw new Error('Reducer error!');
      }
      return state;
    };
    const store = createSyncStore(errorReducer, initialState);
    const originalState = store.getState();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(); // Silence console.error

    // Dispatching an action that causes an error
    expect(() => store.dispatch({ type: 'INCREMENT' })).not.toThrow(); // Dispatch itself shouldn't throw

    // Check that state remains unchanged
    expect(store.getState()).toBe(originalState);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error occurred during dispatch or in reducer:',
        expect.any(Error)
      );

    consoleErrorSpy.mockRestore();
  });

    it('should reset the store to initial state and clear listeners', () => {
        const store = createSyncStore(reducer, initialState);
        const listener = jest.fn();
        store.subscribe(listener);

        store.dispatch({ type: 'INCREMENT' });
        store.dispatch({ type: 'SET_MESSAGE', payload: 'test' });
        expect(store.getState()).toEqual({ count: 1, message: 'test' });

        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        store.reset();
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('SyncStore reset'));

        expect(store.getState()).toEqual(initialState);

        // Dispatch again after reset, listener should not be called as it was cleared
        store.dispatch({ type: 'INCREMENT' });
        expect(listener).not.toHaveBeenCalled();
        expect(store.getState()).toEqual({ count: 1 }); // State updates correctly after reset

        consoleWarnSpy.mockRestore();
    });
});
```
--- END OF MODIFIED FILE tests/createSyncStore.test.ts ---

--- START OF MODIFIED FILE tests/useSyncReducer.test.tsx ---
```typescript
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { createSyncStore } from '../src/createSyncStore';
import { Reducer } from '../src/types';

// Test setup: Counter store
type CounterState = { count: number };
type CounterAction = { type: 'INC' } | { type: 'DEC' };
const counterInitialState: CounterState = { count: 0 };
const counterReducer: Reducer<CounterState, CounterAction> = (state, action) => {
  switch (action.type) {
    case 'INC': return { count: state.count + 1 };
    case 'DEC': return { count: state.count - 1 };
    default: return state;
  }
};

// --- Test Component ---
interface TestComponentProps {
    store: ReturnType<typeof createSyncStore<CounterState, CounterAction>>;
    onRender?: () => void;
  }

const TestComponent: React.FC<TestComponentProps> = ({ store, onRender }) => {
    const [state, dispatch] = store.useSyncReducer();
    onRender?.(); // Callback to track renders

    return (
      <div>
        <span data-testid="count">{state.count}</span>
        <button onClick={() => dispatch({ type: 'INC' })}>Increment</button>
        <button onClick={() => dispatch({ type: 'DEC' })}>Decrement</button>
      </div>
    );
};

// --- Tests ---
describe('useSyncReducer Hook', () => {
  let store: ReturnType<typeof createSyncStore<CounterState, CounterAction>>;

  beforeEach(() => {
    // Create a fresh store for each test
    store = createSyncStore(counterReducer, counterInitialState);
  });

  afterEach(() => {
    // Optional: Reset store if needed, though beforeEach creates a new one
    // store.reset();
  });

  it('should return the initial state and dispatch function', () => {
    render(<TestComponent store={store} />);
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByText('Increment')).toBeInTheDocument();
    expect(screen.getByText('Decrement')).toBeInTheDocument();
  });

  it('should update the component state when the store state changes via dispatch', () => {
    render(<TestComponent store={store} />);

    act(() => {
      screen.getByText('Increment').click();
    });
    expect(screen.getByTestId('count').textContent).toBe('1');
    // Check synchronous getState access immediately after dispatch within act
    expect(store.getState().count).toBe(1);

    act(() => {
      screen.getByText('Increment').click();
    });
    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(store.getState().count).toBe(2);


    act(() => {
      screen.getByText('Decrement').click();
    });
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(store.getState().count).toBe(1);
  });

  it('should have a stable dispatch function identity across renders', () => {
    const dispatchInstances = new Set<(action: CounterAction) => void>();
    let capturedDispatch: ((action: CounterAction) => void) | null = null;

    const CaptureDispatchComponent: React.FC<{ store: typeof store }> = ({ store }) => {
        const [, dispatch] = store.useSyncReducer();
        dispatchInstances.add(dispatch);
        capturedDispatch = dispatch; // Capture the latest dispatch instance
        return null; // No UI needed
    };

    const { rerender } = render(<CaptureDispatchComponent store={store} />);
    const initialDispatch = capturedDispatch;
    expect(initialDispatch).not.toBeNull();

    // Trigger a re-render (e.g., by changing unrelated state or props, or forcing update)
    // Here we simulate by dispatching, which causes a state change and re-render
    act(() => {
      store.dispatch({ type: 'INC' });
    });
    rerender(<CaptureDispatchComponent store={store} />); // Rerender the component

    // Check if the captured dispatch is the same instance
    expect(capturedDispatch).toBe(initialDispatch);
    // Check the Set size - should only contain one instance due to memoization
    expect(dispatchInstances.size).toBe(1);
  });

  it('should re-render when state changes externally', () => {
    const renderSpy = jest.fn();
    render(<TestComponent store={store} onRender={renderSpy} />);
    expect(renderSpy).toHaveBeenCalledTimes(1); // Initial render

    // Dispatch externally (not via component's button click)
    act(() => {
      store.dispatch({ type: 'INC' });
    });

    // Component should re-render due to subscription
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(renderSpy).toHaveBeenCalledTimes(2); // Re-render occurred

    // Dispatch again
    act(() => {
        store.dispatch({ type: 'DEC' });
      });
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(renderSpy).toHaveBeenCalledTimes(3);
  });

  it('should use getServerState for initial render (simulated SSR)', () => {
        const serverState: CounterState = { count: 99 };
        const ssrStore = createSyncStore(counterReducer, serverState);

        // In a real SSR scenario, useSyncExternalStore would use getServerState initially.
        // Here, we verify the hook reads the initial state provided via getServerState.
        const Comp: React.FC = () => {
            const [state] = ssrStore.useSyncReducer();
            return <div data-testid="ssr-count">{state.count}</div>;
        }
        render(<Comp />);
        expect(screen.getByTestId('ssr-count').textContent).toBe('99');
  });
});
```
--- END OF MODIFIED FILE tests/useSyncReducer.test.tsx ---

--- START OF MODIFIED FILE tests/useSyncSelector.test.tsx ---
```typescript
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { createSyncStore } from '../src/createSyncStore';
import { Reducer } from '../src/types';

// Test setup: More complex state
type UserState = {
  user: { id: number; name: string; email?: string } | null;
  settings: { theme: 'light' | 'dark'; notifications: boolean };
  lastUpdate: number | null;
};
type UserAction =
  | { type: 'LOGIN'; payload: { id: number; name: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'SET_EMAIL'; payload: string };

const userInitialState: UserState = {
  user: null,
  settings: { theme: 'light', notifications: true },
  lastUpdate: null,
};

const userReducer: Reducer<UserState, UserAction> = (state, action) => {
  const timestamp = Date.now();
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, lastUpdate: timestamp };
    case 'LOGOUT':
      return { ...state, user: null, lastUpdate: timestamp };
    case 'SET_THEME':
      return {
        ...state,
        settings: { ...state.settings, theme: action.payload },
        lastUpdate: timestamp,
      };
    case 'TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        settings: {
          ...state.settings,
          notifications: !state.settings.notifications,
        },
        lastUpdate: timestamp,
      };
    case 'SET_EMAIL':
      return state.user
        ? {
            ...state,
            user: { ...state.user, email: action.payload },
            lastUpdate: timestamp,
          }
        : state; // No change if logged out
    default:
      return state;
  }
};

// --- Test Components ---

interface SelectorComponentProps<Selected> {
    store: ReturnType<typeof createSyncStore<UserState, UserAction>>;
    selector: (state: UserState) => Selected;
    equalityFn?: (a: Selected, b: Selected) => boolean;
    dataTestId: string;
    onRender?: () => void;
  }

const SelectorComponent = <Selected,>({
    store,
    selector,
    equalityFn,
    dataTestId,
    onRender,
}: SelectorComponentProps<Selected>) => {
  const selectedState = store.useSyncSelector(selector, equalityFn);
  onRender?.();

  // Displaying the selected state (handling objects for display)
  const displayValue = typeof selectedState === 'object'
    ? JSON.stringify(selectedState)
    : String(selectedState);

  return <div data-testid={dataTestId}>{displayValue}</div>;
};

// --- Tests ---
describe('useSyncSelector Hook', () => {
  let store: ReturnType<typeof createSyncStore<UserState, UserAction>>;

  beforeEach(() => {
    store = createSyncStore(userReducer, userInitialState);
    // Reset Date.now mock if used previously
    jest.restoreAllMocks();
  });

  it('should select and return the correct initial state slice', () => {
    render(
      <SelectorComponent
        store={store}
        selector={(state) => state.settings.theme}
        dataTestId="theme"
      />
    );
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('should select and return an object slice', () => {
    render(
      <SelectorComponent
        store={store}
        selector={(state) => state.settings}
        dataTestId="settings"
      />
    );
    expect(screen.getByTestId('settings').textContent).toBe(
      JSON.stringify({ theme: 'light', notifications: true })
    );
  });

  it('should update the component only when the selected state slice changes (primitive)', () => {
    const renderSpy = jest.fn();
    render(
      <SelectorComponent
        store={store}
        selector={(state) => state.settings.theme}
        dataTestId="theme"
        onRender={renderSpy}
      />
    );
    expect(renderSpy).toHaveBeenCalledTimes(1); // Initial render

    // Dispatch action that changes the selected state (theme)
    act(() => {
      store.dispatch({ type: 'SET_THEME', payload: 'dark' });
    });
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(renderSpy).toHaveBeenCalledTimes(2); // Re-rendered

    // Dispatch action that changes *other* state (notifications), but not the selected theme
    act(() => {
        store.dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
    });
    expect(screen.getByTestId('theme').textContent).toBe('dark'); // Value is the same
    expect(renderSpy).toHaveBeenCalledTimes(2); // Should *not* re-render again

     // Dispatch action that changes *other* state (login)
     act(() => {
        store.dispatch({ type: 'LOGIN', payload: { id: 1, name: 'Test User'} });
    });
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(renderSpy).toHaveBeenCalledTimes(2); // Should *not* re-render again
  });

  it('should update the component only when the selected state slice changes (object, default shallow compare)', () => {
    const renderSpy = jest.fn();
    const settingsSelector = (state: UserState) => state.settings; // Select the settings object

    render(
      <SelectorComponent
        store={store}
        selector={settingsSelector}
        dataTestId="settings"
        onRender={renderSpy}
      />
    );
    expect(renderSpy).toHaveBeenCalledTimes(1);

    // Dispatch action changing a property *within* the selected object slice
    act(() => {
      store.dispatch({ type: 'SET_THEME', payload: 'dark' });
    });
    // The settings object reference changes because the reducer creates a new settings object
    expect(screen.getByTestId('settings').textContent).toBe(
      JSON.stringify({ theme: 'dark', notifications: true })
    );
    expect(renderSpy).toHaveBeenCalledTimes(2); // Re-rendered

    // Dispatch action changing *other* state (user), which also creates a new top-level state object
    // BUT the settings object reference within the new state should be the same as the previous state's
    // if the reducer is implemented correctly (spreading only what changes).
    // However, our reducer *always* creates a new state object, which means settings ref *might* change depending on how it's structured
    // Let's test the user action which *doesn't* touch settings directly
    act(() => {
      store.dispatch({ type: 'LOGIN', payload: { id: 1, name: 'Test' }});
    });
    // Check if it re-rendered unnecessarily. useSyncExternalStoreWithSelector's default equality (Object.is)
    // should prevent re-render if the selector returns the same object reference.
    // Since our reducer returns a new state object, the selector *will* get a new state object,
    // but if `state.settings` reference hasn't changed, it should not re-render.
    // Let's refine the reducer for this case:
    const refinedReducer: Reducer<UserState, UserAction> = (state, action) => {
        const timestamp = Date.now();
        switch (action.type) {
          case 'LOGIN':
            // Only return new object if user actually changes
            if(state.user?.id !== action.payload.id) {
                return { ...state, user: action.payload, lastUpdate: timestamp };
            }
            return state; // Return same state if user is same
          case 'LOGOUT':
            return state.user !== null ? { ...state, user: null, lastUpdate: timestamp } : state;
          case 'SET_THEME':
             if(state.settings.theme !== action.payload) {
                return { ...state, settings: { ...state.settings, theme: action.payload }, lastUpdate: timestamp };
             }
             return state;
          // ... other actions similarly refined ...
          default:
             const newState = userReducer(state, action); // Use original for other cases
             return newState === state ? state : { ...newState, lastUpdate: timestamp }; // Ensure lastUpdate if changed
        }
    };
    store = createSyncStore(refinedReducer, userInitialState); // Use refined reducer

    // Render again with the refined store
    const { rerender } = render(
        <SelectorComponent store={store} selector={settingsSelector} dataTestId="settings" onRender={renderSpy} />
    );
    renderSpy.mockClear(); // Reset spy after initial render
    expect(renderSpy).toHaveBeenCalledTimes(1);

    // Dispatch login - this shouldn't change settings ref
    act(() => {
      store.dispatch({ type: 'LOGIN', payload: { id: 1, name: 'Test' }});
    });
    expect(renderSpy).toHaveBeenCalledTimes(1); // Should NOT re-render settings component

     // Dispatch set theme - this SHOULD change settings ref
     act(() => {
        store.dispatch({ type: 'SET_THEME', payload: 'dark' });
      });
      expect(renderSpy).toHaveBeenCalledTimes(2); // Should re-render settings component

  });

  it('should use custom equality function correctly', () => {
    const renderSpy = jest.fn();
    // Selector returns an object, but we only care if the theme property changes
    const themeSelector = (state: UserState) => ({ theme: state.settings.theme });
    // Custom equality: only re-render if theme string is different
    const themeEqualityFn = (a: { theme: string }, b: { theme: string }) => a.theme === b.theme;

    render(
      <SelectorComponent
        store={store}
        selector={themeSelector}
        equalityFn={themeEqualityFn}
        dataTestId="custom-eq"
        onRender={renderSpy}
      />
    );
    expect(renderSpy).toHaveBeenCalledTimes(1); // Initial render
    expect(screen.getByTestId('custom-eq').textContent).toBe(JSON.stringify({ theme: 'light' }));

    // Dispatch action that changes the theme
    act(() => {
      store.dispatch({ type: 'SET_THEME', payload: 'dark' });
    });
    expect(screen.getByTestId('custom-eq').textContent).toBe(JSON.stringify({ theme: 'dark' }));
    expect(renderSpy).toHaveBeenCalledTimes(2); // Re-rendered because theme changed

    // Dispatch action that changes notifications but NOT theme
    act(() => {
        store.dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
    });
    // The selector will return a *new object* { theme: 'dark' } because the root state changed,
    // but the custom equality function should see the 'theme' property is the same ('dark' === 'dark')
    // and prevent a re-render.
    expect(screen.getByTestId('custom-eq').textContent).toBe(JSON.stringify({ theme: 'dark' }));
    expect(renderSpy).toHaveBeenCalledTimes(2); // Should *not* re-render again due to custom equalityFn

  });

  it('should select derived data correctly', () => {
    const renderSpy = jest.fn();
    // Selector derives a boolean based on user state
    const isLoggedInSelector = (state: UserState) => state.user !== null;

    render(
      <SelectorComponent
        store={store}
        selector={isLoggedInSelector}
        dataTestId="is-logged-in"
        onRender={renderSpy}
      />
    );
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('is-logged-in').textContent).toBe('false'); // Initially logged out

    // Log in
    act(() => {
        store.dispatch({ type: 'LOGIN', payload: { id: 1, name: 'User' }});
    });
    expect(screen.getByTestId('is-logged-in').textContent).toBe('true');
    expect(renderSpy).toHaveBeenCalledTimes(2); // Re-rendered

    // Change theme (should not affect isLoggedIn)
    act(() => {
        store.dispatch({ type: 'SET_THEME', payload: 'dark' });
    });
    expect(screen.getByTestId('is-logged-in').textContent).toBe('true');
    expect(renderSpy).toHaveBeenCalledTimes(2); // Should not re-render

    // Log out
    act(() => {
        store.dispatch({ type: 'LOGOUT' });
    });
    expect(screen.getByTestId('is-logged-in').textContent).toBe('false');
    expect(renderSpy).toHaveBeenCalledTimes(3); // Re-rendered
  });
});
```
--- END OF MODIFIED FILE tests/useSyncSelector.test.tsx ---

This completes the setup for your `react-sync-reducer` package, including core logic, hooks, strict TypeScript, linting, formatting, testing, and build configurations. You should now be able to run `npm install`, `npm run validate`, and `npm run build`.