import { renderHook, act } from '@testing-library/react';
import { createSyncStore } from '../src/createSyncStore';
import type { Reducer } from '../src/types';

interface TestState {
  user: { name: string; age: number };
  settings: { theme: string };
}

type TestAction =
  | { type: 'UPDATE_NAME'; payload: string }
  | { type: 'UPDATE_THEME'; payload: string };

describe('useSyncSelector', () => {
  const initialState: TestState = {
    user: { name: 'John', age: 25 },
    settings: { theme: 'light' },
  };

  const reducer: Reducer<TestState, TestAction> = (state, action) => {
    switch (action.type) {
      case 'UPDATE_NAME':
        return { ...state, user: { ...state.user, name: action.payload } };
      case 'UPDATE_THEME':
        return {
          ...state,
          settings: { ...state.settings, theme: action.payload },
        };
      default:
        return state;
    }
  };

  test('should select and update specific state slice', () => {
    const store = createSyncStore(reducer, initialState);

    const { result } = renderHook(() =>
      store.useSyncSelector((state) => state.user.name)
    );

    expect(result.current).toBe('John');

    act(() => {
      store.dispatch({ type: 'UPDATE_NAME', payload: 'Jane' });
    });

    expect(result.current).toBe('Jane');
  });

  test('should respect equality function', () => {
    const store = createSyncStore(reducer, initialState);
    const renderCount = jest.fn();

    const { rerender } = renderHook(() => {
      renderCount();
      return store.useSyncSelector(
        (state) => state.settings,
        (a, b) => a.theme === b.theme
      );
    });

    act(() => {
      store.dispatch({ type: 'UPDATE_NAME', payload: 'Jane' });
    });

    rerender();

    expect(renderCount).toHaveBeenCalledTimes(1);
  });
});
