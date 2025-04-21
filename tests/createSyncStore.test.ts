import { createSyncStore } from '../src/createSyncStore';
import { Reducer } from '../src/types';

// Define simple state and actions for testing
type TestState = { count: number; message?: string };
type TestAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'RESET' };

const initialState: TestState = { count: 0 };

const reducer: Reducer<TestState, TestAction> = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'RESET':
      return initialState;
    default:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Unknown action type: ${(action as any).type}`);
  }
};

describe('createSyncStore', () => {
  it('should initialize with the initial state', () => {
    const store = createSyncStore(reducer, initialState);
    expect(store.getState()).toEqual(initialState);
    expect(store.getServerState()).toEqual(initialState); // For SSR check
  });

  it('should update state correctly on dispatch', () => {
    const store = createSyncStore(reducer, initialState);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toEqual({ count: 1 });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toEqual({ count: 2 });
    store.dispatch({ type: 'DECREMENT' });
    expect(store.getState()).toEqual({ count: 1 });
    store.dispatch({ type: 'SET_MESSAGE', payload: 'hello' });
    expect(store.getState()).toEqual({ count: 1, message: 'hello' });
  });

  it('should not update state if reducer returns the same state object', () => {
    const identicalStateReducer: Reducer<TestState, TestAction> = (state, _action) => {
        // Always return the exact same object reference
        return state;
    }
    const store = createSyncStore(identicalStateReducer, initialState);
    const listener = jest.fn();
    store.subscribe(listener);

    store.dispatch({ type: 'INCREMENT' }); // Action doesn't matter due to reducer

    expect(store.getState()).toBe(initialState); // Check object identity
    expect(listener).not.toHaveBeenCalled(); // Listener should not be called if state object is identical
  });

  it('should notify subscribers when state changes', () => {
    const store = createSyncStore(reducer, initialState);
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    store.subscribe(listener1);
    store.subscribe(listener2);

    store.dispatch({ type: 'INCREMENT' });

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);

    store.dispatch({ type: 'SET_MESSAGE', payload: 'world' });

    expect(listener1).toHaveBeenCalledTimes(2);
    expect(listener2).toHaveBeenCalledTimes(2);
  });

  it('should not notify unsubscribed listeners', () => {
    const store = createSyncStore(reducer, initialState);
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    const unsubscribe1 = store.subscribe(listener1);
    store.subscribe(listener2);

    store.dispatch({ type: 'INCREMENT' });
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);

    unsubscribe1(); // Unsubscribe listener1

    store.dispatch({ type: 'DECREMENT' });
    expect(listener1).toHaveBeenCalledTimes(1); // Should not have been called again
    expect(listener2).toHaveBeenCalledTimes(2);
  });

  it('should allow multiple independent store instances', () => {
    const store1 = createSyncStore(reducer, { count: 10 });
    const store2 = createSyncStore(reducer, { count: 100 });

    store1.dispatch({ type: 'INCREMENT' });
    store2.dispatch({ type: 'DECREMENT' });

    expect(store1.getState()).toEqual({ count: 11 });
    expect(store2.getState()).toEqual({ count: 99 });
  });

  it('should handle errors within the reducer gracefully', () => {
    const errorReducer: Reducer<TestState, TestAction> = (state, action) => {
      if (action.type === 'INCREMENT') {
        throw new Error('Reducer error!');
      }
      return state;
    };
    const store = createSyncStore(errorReducer, initialState);
    const originalState = store.getState();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(); // Silence console.error

    // Dispatching an action that causes an error
    expect(() => store.dispatch({ type: 'INCREMENT' })).not.toThrow(); // Dispatch itself shouldn't throw

    // Check that state remains unchanged
    expect(store.getState()).toBe(originalState);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error occurred during dispatch or in reducer:',
        expect.any(Error)
      );

    consoleErrorSpy.mockRestore();
  });

    it('should reset the store to initial state and clear listeners', () => {
        const store = createSyncStore(reducer, initialState);
        const listener = jest.fn();
        store.subscribe(listener);

        store.dispatch({ type: 'INCREMENT' });
        store.dispatch({ type: 'SET_MESSAGE', payload: 'test' });
        expect(store.getState()).toEqual({ count: 1, message: 'test' });

        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        store.reset();
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('SyncStore reset'));

        expect(store.getState()).toEqual(initialState);

        // Dispatch again after reset, listener should not be called as it was cleared
        store.dispatch({ type: 'INCREMENT' });
        expect(listener).not.toHaveBeenCalled();
        expect(store.getState()).toEqual({ count: 1 }); // State updates correctly after reset

        consoleWarnSpy.mockRestore();
    });
});
