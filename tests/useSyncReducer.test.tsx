import { renderHook, act } from '@testing-library/react-hooks';
import { createSyncStore } from '../src/createSyncStore';
import type { Reducer } from '../src/types';

interface TestState {
  count: number;
}

type TestAction = { type: 'INCREMENT' } | { type: 'DECREMENT' };

describe('useSyncReducer', () => {
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

  test('should provide state and dispatch', () => {
    const store = createSyncStore(reducer, initialState);

    const { result } = renderHook(() => store.useSyncReducer());

    expect(result.current[0]).toEqual(initialState);

    act(() => {
      result.current[1]({ type: 'INCREMENT' });
    });

    expect(result.current[0]).toEqual({ count: 1 });
    expect(store.getState()).toEqual({ count: 1 });
  });

  test('should maintain dispatch identity', () => {
    const store = createSyncStore(reducer, initialState);

    const { result, rerender } = renderHook(() => store.useSyncReducer());
    const initialDispatch = result.current[1];

    rerender();

    expect(result.current[1]).toBe(initialDispatch);
  });
});
