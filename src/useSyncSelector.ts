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
