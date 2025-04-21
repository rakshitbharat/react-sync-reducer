import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useCallback } from 'react';

/**
 * Internal implementation hook used by SyncStore.useSyncReducer.
 * Provides synchronized state management with React's concurrent features.
 *
 * @template S The type of the state
 * @template A The type of actions
 *
 * @example
 * ```typescript
 * interface State {
 *   count: number;
 *   lastUpdated: string;
 * }
 *
 * type Action =
 *   | { type: 'INCREMENT' }
 *   | { type: 'DECREMENT' }
 *   | { type: 'RESET' };
 *
 * function Counter() {
 *   const [state, dispatch] = useSyncReducer<State, Action>(
 *     subscribe,
 *     getState,
 *     getServerState,
 *     dispatch
 *   );
 *
 *   return (
 *     <div>
 *       <p>Count: {state.count}</p>
 *       <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
 *       <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
 *       <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
 *       <small>Last updated: {state.lastUpdated}</small>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns A tuple containing the current state and a stable dispatch function
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
