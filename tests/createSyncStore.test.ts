import { createSyncStore } from '../src/createSyncStore';
import type { Reducer } from '../src/types';

interface TestState {
  count: number;
}

type TestAction = { type: 'INCREMENT' } | { type: 'DECREMENT' };

describe('createSyncStore', () => {
  let store: ReturnType<typeof createSyncStore<TestState, TestAction>>;
  let consoleWarnSpy: jest.SpyInstance;
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
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  test('should initialize with correct state', () => {
    expect(store.getState()).toEqual(initialState);
  });

  test('should not update state if reducer returns same state', () => {
    const listener = jest.fn();
    store.subscribe(listener);

    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });

    expect(listener).toHaveBeenCalledTimes(2);
    expect(store.getState()).toEqual(initialState);
  });

  test('should handle errors in reducer', () => {
    const errorStore = createSyncStore<TestState, TestAction>(
      (state, action) => {
        throw new Error('Test error');
      },
      initialState
    );

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    errorStore.dispatch({ type: 'INCREMENT' });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('should reset store state', () => {
    const listener = jest.fn();
    store.subscribe(listener);

    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toEqual({ count: 1 });

    store.reset();
    expect(store.getState()).toEqual(initialState);

    // After reset, listeners are cleared, so we need to subscribe again
    const newListener = jest.fn();
    store.subscribe(newListener);

    store.dispatch({ type: 'INCREMENT' });
    expect(newListener).toHaveBeenCalledTimes(1);
    expect(store.getState()).toEqual({ count: 1 });
  });
});
