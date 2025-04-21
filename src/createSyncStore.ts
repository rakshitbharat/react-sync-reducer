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
  const listeners: Set<() => void> = new Set();

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
      console.warn(
        'SyncStore reset. Ensure this is intended, often used for testing.'
      );
    }
  };

  // Use custom hooks prefixed with "use" to satisfy React Hooks rules
  const useReducerState = () =>
    useSyncReducer(subscribe, getState, getServerState, dispatch);

  const useSelectorState = <Selected>(
    selector: (state: S) => Selected,
    equalityFn?: (a: Selected, b: Selected) => boolean
  ) =>
    useSyncSelector(subscribe, getState, getServerState, selector, equalityFn);

  return {
    getState,
    dispatch,
    subscribe,
    getServerState,
    useSyncReducer: useReducerState,
    useSyncSelector: useSelectorState,
    reset,
  };
}
