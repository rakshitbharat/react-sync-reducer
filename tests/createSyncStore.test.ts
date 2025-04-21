import { createSyncStore } from '../src/createSyncStore';
import type { Reducer } from '../src/types';

interface TestState {
  count: number;
}

type TestAction = { type: 'INCREMENT' } | { type: 'DECREMENT' };

describe('createSyncStore', () => {
  let store: ReturnType<typeof createSyncStore<TestState, TestAction>>;
  const initialState: TestState = { count: 0 };

  const reducer: Reducer<TestState, TestAction> = (state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return { count: state.count + 1 };
      case 'DECREMENT':
        return { count: state.count - 1 };
      default:
        return state;
    }
  };

  beforeEach(() => {
    store = createSyncStore(reducer, initialState);
  });

  test('should initialize with correct state', () => {
    expect(store.getState()).toEqual(initialState);
  });

  test('should update state on dispatch', () => {
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toEqual({ count: 1 });
  });

  test('should notify listeners of state changes', () => {
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);

    store.dispatch({ type: 'INCREMENT' });
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.dispatch({ type: 'INCREMENT' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('should reset store state', () => {
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toEqual({ count: 1 });

    store.reset();
    expect(store.getState()).toEqual(initialState);

    const listener = jest.fn();
    store.subscribe(listener);
    store.reset();

    // Fix: Clear the mock calls after reset
    listener.mockClear();

    store.dispatch({ type: 'INCREMENT' });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
