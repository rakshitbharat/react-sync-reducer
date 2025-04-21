/**
 * React Sync Reducer
 * A lightweight state management solution combining the simplicity of useReducer
 * with the power of Redux-like patterns and selector optimization.
 *
 * @example
 * ```typescript
 * import { createSyncStore } from 'react-sync-reducer';
 *
 * // Define your state and actions
 * interface State {
 *   count: number;
 * }
 *
 * type Action = 
 *   | { type: 'INCREMENT' }
 *   | { type: 'DECREMENT' };
 *
 * // Create your store
 * const store = createSyncStore<State, Action>(
 *   (state, action) => {
 *     switch (action.type) {
 *       case 'INCREMENT':
 *         return { count: state.count + 1 };
 *       case 'DECREMENT':
 *         return { count: state.count - 1 };
 *       default:
 *         return state;
 *     }
 *   },
 *   { count: 0 }
 * );
 *
 * // Use in components
 * function Counter() {
 *   const [state, dispatch] = store.useSyncReducer();
 *   return (
 *     <button onClick={() => dispatch({ type: 'INCREMENT' })}>
 *       Count: {state.count}
 *     </button>
 *   );
 * }
 * ```
 */

export { createSyncStore } from './createSyncStore';
export type { SyncStore, Reducer, Selector, EqualityFn } from './types';
