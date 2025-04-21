import { createSyncStore } from '../src/createSyncStore';
import { renderHook } from '@testing-library/react';

describe('SSR Support', () => {
  test('should provide initial state during SSR', () => {
    const initialState = { count: 5 };
    const store = createSyncStore(
      (state, _action: 'INCREMENT') => ({ count: state.count + 1 }),
      initialState
    );

    // Verify getServerState returns initial state
    expect(store.getServerState()).toEqual(initialState);

    // Test SSR rendering
    const { result } = renderHook(() => store.useSyncReducer());
    expect(result.current[0]).toEqual(initialState);
  });
});
