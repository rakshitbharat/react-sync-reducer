import { createSyncStore } from '../src/createSyncStore';

describe('Multiple Store Instances', () => {
  test('should maintain separate state for different stores', () => {
    const counterStore = createSyncStore(
      (state: number, action: 'INCREMENT' | 'DECREMENT') =>
        action === 'INCREMENT' ? state + 1 : state - 1,
      0
    );

    const todoStore = createSyncStore(
      (state: string[], action: { type: 'ADD'; text: string }) => [
        ...state,
        action.text,
      ],
      []
    );

    counterStore.dispatch('INCREMENT');
    todoStore.dispatch({ type: 'ADD', text: 'Test' });

    expect(counterStore.getState()).toBe(1);
    expect(todoStore.getState()).toEqual(['Test']);
  });
});
