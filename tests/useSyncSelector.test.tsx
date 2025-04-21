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
    const customEqualityFn = jest.fn((a, b) => a.theme === b.theme);

    // Setup the hook with equality function
    renderHook(() => {
      renderCount();
      return store.useSyncSelector((state) => state.settings, customEqualityFn);
    });

    // Clear initial render count
    renderCount.mockClear();
    customEqualityFn.mockClear();

    // Dispatch an action that doesn't change the selected value
    act(() => {
      store.dispatch({ type: 'UPDATE_NAME', payload: 'Jane' });
    });

    // Should not trigger a re-render since settings didn't change
    expect(renderCount).not.toHaveBeenCalled();
    expect(customEqualityFn).toHaveBeenCalled();

    // Now dispatch an action that changes the selected value
    act(() => {
      store.dispatch({ type: 'UPDATE_THEME', payload: 'dark' });
    });

    // Should trigger a re-render since theme changed
    expect(renderCount).toHaveBeenCalledTimes(1);
  });

  test('should use default equality function', () => {
    const store = createSyncStore(reducer, initialState);
    const renderCount = jest.fn();

    // Setup the hook without custom equality function
    const { result } = renderHook(() => {
      renderCount();
      return store.useSyncSelector((state) => state.settings);
    });

    const initialSettings = result.current;
    renderCount.mockClear();

    // Dispatch an action that doesn't change the selected value
    act(() => {
      store.dispatch({ type: 'UPDATE_NAME', payload: 'Jane' });
    });

    // Should not trigger a re-render since object reference is the same
    expect(renderCount).not.toHaveBeenCalled();
    expect(result.current).toBe(initialSettings);

    // Dispatch an action that changes the selected value
    act(() => {
      store.dispatch({ type: 'UPDATE_THEME', payload: 'dark' });
    });

    // Should trigger a re-render since settings changed
    expect(renderCount).toHaveBeenCalledTimes(1);
    expect(result.current).not.toBe(initialSettings);
  });
});
