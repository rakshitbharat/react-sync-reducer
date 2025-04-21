/**
 * A standard reducer function that processes actions and returns a new state.
 * @template S The type of the state.
 * @template A The type of the actions.
 *
 * @example
 * ```typescript
 * type State = { count: number };
 * type Action = { type: 'INCREMENT' } | { type: 'DECREMENT' };
 *
 * const reducer: Reducer<State, Action> = (state, action) => {
 *   switch (action.type) {
 *     case 'INCREMENT':
 *       return { count: state.count + 1 };
 *     case 'DECREMENT':
 *       return { count: state.count - 1 };
 *     default:
 *       return state;
 *   }
 * };
 * ```
 */
export type Reducer<S, A> = (state: S, action: A) => S;

/**
 * A function to select and derive data from the state.
 * Use this to optimize renders by only subscribing to specific state changes.
 *
 * @template S The type of the state.
 * @template Selected The type of the selected slice.
 *
 * @example
 * ```typescript
 * interface State {
 *   user: { name: string; age: number };
 *   posts: Post[];
 * }
 *
 * const selectUserName: Selector<State, string> =
 *   (state) => state.user.name;
 *
 * const selectPostCount: Selector<State, number> =
 *   (state) => state.posts.length;
 * ```
 */
export type Selector<S, Selected> = (state: S) => Selected;

/**
 * A function to compare two values for equality.
 * Used to determine if a re-render is needed when using selectors.
 *
 * @template Selected The type of the values being compared.
 *
 * @example
 * ```typescript
 * // Custom equality function for arrays
 * const arrayEquals: EqualityFn<number[]> = (a, b) =>
 *   a.length === b.length && a.every((v, i) => v === b[i]);
 *
 * // Deep equality for objects
 * const deepEquals: EqualityFn<object> = (a, b) =>
 *   JSON.stringify(a) === JSON.stringify(b);
 * ```
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
