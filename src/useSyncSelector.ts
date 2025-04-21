import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import { EqualityFn, Selector } from './types';

/**
 * Default equality function using Object.is comparison.
 * @template T The type of values being compared
 * @example
 * ```typescript
 * const areEqual = defaultEqualityFn(1, 1); // true
 * const areNotEqual = defaultEqualityFn({ a: 1 }, { a: 1 }); // false (different references)
 * ```
 */
const defaultEqualityFn: EqualityFn<unknown> = (a, b) => Object.is(a, b);

/**
 * Internal implementation hook used by SyncStore.useSyncSelector.
 * Provides efficient memoized state selection with custom equality comparison.
 *
 * @template S The type of the complete state
 * @template Selected The type of the selected state slice
 *
 * @example
 * ```typescript
 * interface State {
 *   users: { id: number; name: string }[];
 *   settings: { theme: string };
 * }
 *
 * // Select specific users
 * const activeUsers = useSyncSelector(
 *   subscribe,
 *   getState,
 *   getServerState,
 *   (state: State) => state.users.filter(u => u.active),
 *   (prev, next) => prev.length === next.length
 * );
 *
 * // Select nested property
 * const theme = useSyncSelector(
 *   subscribe,
 *   getState,
 *   getServerState,
 *   (state: State) => state.settings.theme
 * );
 * ```
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
