import { createSyncStore } from '../src/createSyncStore';

describe('Direct State Access', () => {
  test('should provide immediate state access after dispatch', () => {
    const store = createSyncStore(
      (_state: number, _action: 'INCREMENT') => _state + 1, // Add underscore prefix
      0
    );

    store.dispatch('INCREMENT');
    // Should have immediate access
    expect(store.getState()).toBe(1);

    // Test in async context
    const asyncOperation = async () => {
      store.dispatch('INCREMENT');
      // Should have immediate access even in async context
      expect(store.getState()).toBe(2);
    };

    return asyncOperation();
  });

  test('should handle errors gracefully', () => {
    const errorStore = createSyncStore(() => {
      throw new Error('Test error');
    }, 0);

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    errorStore.dispatch('INCREMENT');

    expect(consoleSpy).toHaveBeenCalled();
    expect(errorStore.getState()).toBe(0); // State should remain unchanged

    consoleSpy.mockRestore();
  });
});
