import { Reducer, SyncStore } from './types';
import { useSyncReducer } from './useSyncReducer';
import { useSyncSelector } from './useSyncSelector';

/**
 * Creates a new synchronized state store with Redux-like patterns and React hooks integration.
 * 
 * @example
 * ```typescript
 * // Define your state and action types
 * interface TodoState {
 *   items: string[];
 *   loading: boolean;
 * }
 * 
 * type TodoAction = 
 *   | { type: 'ADD_TODO'; payload: string }
 *   | { type: 'REMOVE_TODO'; payload: number }
 *   | { type: 'SET_LOADING'; payload: boolean };
 * 
 * // Create your reducer
 * const todoReducer: Reducer<TodoState, TodoAction> = (state, action) => {
 *   switch (action.type) {
 *     case 'ADD_TODO':
 *       return { ...state, items: [...state.items, action.payload] };
 *     case 'REMOVE_TODO':
 *       return {
 *         ...state,
 *         items: state.items.filter((_, i) => i !== action.payload)
 *       };
 *     case 'SET_LOADING':
 *       return { ...state, loading: action.payload };
 *     default:
 *       return state;
 *   }
 * };
 * 
 * // Create the store
 * const todoStore = createSyncStore(todoReducer, {
 *   items: [],
 *   loading: false
 * });
 * 
 * // Use in components
 * function TodoList() {
 *   const [state, dispatch] = todoStore.useSyncReducer();
 *   const items = todoStore.useSyncSelector(s => s.items);
 *   
 *   return (
 *     <ul>
 *       {items.map((item, index) => (
 *         <li key={index}>
 *           {item}
 *           <button onClick={() => 
 *             dispatch({ type: 'REMOVE_TODO', payload: index })
 *           }>
 *             Delete
 *           </button>
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 * 
 * @template S The type of the state managed by the store
 * @template A The type of the actions accepted by the reducer
 * 
 * @param reducer A pure function that returns the next state
 * @param initialState The initial state value
 * 
 * @returns A store instance with methods for state management and React hooks
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
