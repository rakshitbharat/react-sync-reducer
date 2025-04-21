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
