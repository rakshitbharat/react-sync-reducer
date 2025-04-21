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
