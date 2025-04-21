# `useReducerWithRedux` Hook Documentation

## 1. Introduction & Purpose

The `useReducerWithRedux` hook is a custom React hook designed to provide a state management solution that mimics the API of React's built-in `useReducer` hook but adds a crucial feature: the ability to **synchronously access the latest state** from anywhere in the application, immediately after a dispatch.

This addresses a common scenario where developers need the updated state value right after dispatching an action, without waiting for the next React render cycle, which is the standard behavior of `useReducer` and `useState`.

**Core Goals:**

*   Provide a familiar `[state, dispatch]` API like `useReducer`.
*   Enable synchronous state retrieval via a separate `getLatestState()` function.
*   Maintain a single source of truth for the state managed by this hook.
*   Keep the implementation relatively simple and contained within a single module.

## 2. Core Concepts

### 2.1. Shared Module-Scoped Store

Unlike `useReducer` where state is typically tied to the component instance, `useReducerWithRedux` utilizes a **single, module-level store**. This means:

*   There is only **one instance** of the state (`storeState`), reducer (`storeReducer`), and listeners (`listeners`) shared across all components or modules that import and use this hook or its associated functions (`dispatch`, `getLatestState`).
*   The `initializeStore` function ensures this shared store is initialized only **once**, typically by the first component instance that mounts and uses the hook. Subsequent initializations are usually ignored to prevent accidental state resets.

### 2.2. Synchronous Updates & Access

*   **`dispatch(action)`**: When an action is dispatched:
    1.  The shared `storeReducer` is immediately executed with the current `storeState` and the `action`.
    2.  The `storeState` variable is synchronously updated with the result from the reducer.
    3.  All registered `listeners` (components using the hook) are notified *after* the state update.
*   **`getLatestState()`**: This function directly reads and returns the current value of the module-level `storeState` variable. Because `dispatch` updates `storeState` synchronously, calling `getLatestState()` immediately after `dispatch` returns the *new* state.

### 2.3. Component Subscription

*   Each component instance using the `useReducerWithRedux` hook subscribes its own listener function to the shared store via `useEffect`.
*   This listener uses the component's `setLocalState` function (from `useState`) to update the component's view of the state whenever the shared store changes.
*   This ensures components re-render with the latest state, similar to how standard context or Redux bindings work.
*   Unsubscription happens automatically when the component unmounts.

## 3. Implementation Details

*(Refer to `./src/hooks/useReducerWithRedux.ts` for the full code)*

*   **`storeState`, `storeReducer`, `listeners`**: Module-level variables holding the single store instance.
*   **`initializeStore(reducer, initialState)`**:
    *   Sets `storeReducer` and `storeState` **only if `storeState` is currently `undefined`**.
    *   Clears `listeners` upon successful initialization.
    *   Logs warnings if initialization is attempted again.
*   **`dispatch(action)`**:
    *   Checks if the store is initialized.
    *   Calls `storeReducer` to get the new state.
    *   Updates `storeState`.
    *   Iterates over a *copy* of the `listeners` Set (to handle potential mutations during iteration) and calls each listener with the new state.
    *   Includes error handling for reducer execution and listener execution.
*   **`getLatestState()`**:
    *   Checks if the store is initialized.
    *   Returns the current `storeState`.
*   **`useReducerWithRedux(reducer, initialState, initializer?)`**:
    *   Uses `useRef` (`isInitialized`) to track if the *hook instance* has performed the global initialization check.
    *   Calculates the *actual* initial state using the optional `initializer` function *before* calling `initializeStore`.
    *   Calls `initializeStore` on the first render if the ref flag is false.
    *   Uses `useState` (`localState`, `setLocalState`) to manage the component's copy of the state, initializing it from `getLatestState()`.
    *   Uses `useEffect` for subscribing/unsubscribing a listener that calls `setLocalState`. Includes an immediate sync check within the effect.
    *   Returns `[localState, stableDispatch]`, where `stableDispatch` is a memoized version of the global `dispatch`.

## 4. Usage Examples

### 4.1. In a React Component

```tsx
// filepath: ./src/components/MyECUComponent.tsx (Example Path)
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useReducerWithRedux } from '../hooks/useReducerWithRedux'; // Adjust path
import { ecuReducer, initialState } from '../ecu/context/ECUReducer'; // Adjust path
import { ECUActionType } from '../ecu/utils/types'; // Adjust path

export const MyECUComponent: React.FC = () => {
  // Use the hook just like useReducer
  const [state, dispatch] = useReducerWithRedux(ecuReducer, initialState);

  const handleConnect = () => {
    dispatch({ type: ECUActionType.CONNECT_START });
    // Simulate async connection
    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        dispatch({
          type: ECUActionType.CONNECT_SUCCESS,
          payload: { protocol: 6, protocolName: 'CAN 11-bit', voltage: 12.5 },
        });
      } else {
        dispatch({
          type: ECUActionType.CONNECT_FAILURE,
          payload: { error: 'Connection timed out' },
        });
      }
    }, 1000);
  };

  return (
    <View>
      <Text>Status: {state.status}</Text>
      <Text>Protocol: {state.protocolName || 'N/A'}</Text>
      <Text>Voltage: {state.deviceVoltage || 'N/A'}</Text>
      {state.lastError && <Text style={{ color: 'red' }}>Error: {state.lastError}</Text>}
      <Button title="Connect" onPress={handleConnect} disabled={state.status === 'CONNECTING'} />
    </View>
  );
};
```

### 4.2. Synchronous Access (e.g., in Services, Utilities, or after Dispatch)

```typescript
// filepath: ./src/services/ECUConnectionService.ts (Example Path)
import { dispatch, getLatestState } from '../hooks/useReducerWithRedux'; // Adjust path
import { ECUActionType } from '../ecu/utils/types'; // Adjust path
import { log } from '../utils/logger'; // Adjust path

// Example function within a service or utility file
async function performECUAction(command: string): Promise<string | null> {
  const currentState = getLatestState(); // Get state *before* action

  if (!currentState || currentState.status !== 'CONNECTED') {
    log.warn('Cannot send command, ECU not connected.');
    return null;
  }

  log.debug(`Sending command: ${command} with protocol ${currentState.protocolName}`);

  // Simulate sending command via Bluetooth/OBD adapter
  const response = await sendCommandToAdapter(command); // Assume this exists

  if (response.includes('ERROR')) {
    // Dispatch failure immediately
    dispatch({ type: 'COMMAND_FAILURE', payload: { command, error: response } });
    const latestStateAfterError = getLatestState(); // Get state *immediately* after error dispatch
    log.error(`Command failed. Current status: ${latestStateAfterError?.status}`);
    return null;
  } else {
    // Dispatch success immediately
    dispatch({ type: 'COMMAND_SUCCESS', payload: { command, response } });
    const latestStateAfterSuccess = getLatestState(); // Get state *immediately* after success dispatch
    log.info(`Command successful. Voltage: ${latestStateAfterSuccess?.deviceVoltage}`);
    return response;
  }
}

// Dummy function for illustration
async function sendCommandToAdapter(command: string): Promise<string> {
  await new Promise(res => setTimeout(res, 50)); // Simulate delay
  return command === '010C' ? '41 0C 1A F8' : 'OK';
}
```

## 5. Benefits

*   **Synchronous State Access**: The primary benefit. Allows immediate access to the latest state via `getLatestState()` without waiting for re-renders. Useful for complex workflows, services, or logic outside React components.
*   **Familiar API**: Mimics `useReducer`, making it relatively easy to adopt for developers familiar with React hooks.
*   **Single Source of Truth**: Consolidates state logic into a single shared store, potentially simplifying state management compared to prop drilling or multiple contexts for the *same* state shape.
*   **Decoupling**: Allows non-React parts of the application (services, utility functions) to interact with and read the state managed by the hook.

## 6. Drawbacks & Considerations

*   **Single Global Store Instance**: This is the most significant aspect. Because the store is module-scoped:
    *   **Lack of True Isolation**: If you intend to use `useReducerWithRedux` for *different* pieces of state with *different* reducers/initial states in separate parts of your app, this implementation will **not** work as expected. The first initialization "wins," and subsequent attempts are ignored (or would overwrite the single store if modified). It's designed for **one specific shared state**.
    *   **Testing**: Can be slightly more complex to test, as the module state might persist between tests unless explicitly reset. Mocks or store reset utilities might be needed.
*   **React Concurrent Mode**: Synchronous access patterns can sometimes be problematic with React's concurrent features. While `getLatestState` provides the *latest* state according to the store, React might be rendering with slightly older state during a concurrent render. This is less of an issue if `getLatestState` is used primarily outside the React render path (e.g., in event handlers, services).
*   **Boilerplate**: While simpler than full Redux, it's more boilerplate than `useReducer` or Zustand.
*   **No Middleware**: Lacks built-in support for middleware (like Redux Thunk or Saga) for handling side effects, though async logic can be managed within action creators or services that call `dispatch`.
*   **DevTools**: No direct integration with Redux DevTools out-of-the-box.

## 7. Potential Improvements & Alternatives

*   **Multiple Store Instances**: To support different state slices, the implementation would need significant changes, likely involving a factory function or a context-based approach to manage separate store instances. This moves away from the simple module-scope design.
*   **Explicit Store Reset**: Add an exported `resetStore()` function for testing or specific application needs.
*   **Selector Support**: Implement a `useSelectorWithRedux` hook for more granular state subscriptions, similar to Redux's `useSelector`.
*   **Middleware Support**: Add basic middleware capabilities.
*   **Alternatives**:
    *   **Zustand**: Provides a similar hook-based API with synchronous state access (`store.getState()`) and supports multiple independent stores easily. Often a better choice for multiple state slices.
    *   **Redux Toolkit**: The standard for robust Redux applications, offering DevTools, middleware, selectors, and good patterns for managing state, including synchronous access via `store.getState()` within thunks or middleware.
    *   **Jotai / Valtio**: Atomic state management libraries offering different paradigms but potentially fulfilling the need for accessible state.
    *   **React Context + useReducer**: Stick with the standard, but handle synchronous needs by passing dispatch and state down or using refs carefully (though `getLatestState` is often cleaner for cross-cutting access).

## 8. Conclusion

`useReducerWithRedux` offers a specific solution for bridging the gap between `useReducer`'s familiar API and the need for synchronous state access, particularly useful when integrating with non-React code or complex event handling logic. Its primary strength lies in the `getLatestState` function. However, its use of a single, module-scoped store makes it suitable only for managing **one specific piece of shared state** across the application. For managing multiple, independent state slices, libraries like Zustand or Redux Toolkit are generally more appropriate and scalable.
