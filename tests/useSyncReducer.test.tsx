import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { createSyncStore } from '../src/createSyncStore';
import { Reducer } from '../src/types';

// Test setup: Counter store
type CounterState = { count: number };
type CounterAction = { type: 'INC' } | { type: 'DEC' };
const counterInitialState: CounterState = { count: 0 };
const counterReducer: Reducer<CounterState, CounterAction> = (
  state,
  action
) => {
  switch (action.type) {
    case 'INC':
      return { count: state.count + 1 };
    case 'DEC':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

// --- Test Component ---
interface TestComponentProps {
  store: ReturnType<typeof createSyncStore<CounterState, CounterAction>>;
  onRender?: () => void;
}

const TestComponent: React.FC<TestComponentProps> = ({ store, onRender }) => {
  const [state, dispatch] = store.useSyncReducer();
  onRender?.(); // Callback to track renders

  return (
    <div>
      <span data-testid="count">{state.count}</span>
      <button onClick={() => dispatch({ type: 'INC' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'DEC' })}>Decrement</button>
    </div>
  );
};

// --- Tests ---
describe('useSyncReducer Hook', () => {
  let store: ReturnType<typeof createSyncStore<CounterState, CounterAction>>;

  beforeEach(() => {
    // Create a fresh store for each test
    store = createSyncStore(counterReducer, counterInitialState);
  });

  afterEach(() => {
    // Optional: Reset store if needed, though beforeEach creates a new one
    // store.reset();
  });

  it('should return the initial state and dispatch function', () => {
    render(<TestComponent store={store} />);
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByText('Increment')).toBeInTheDocument();
    expect(screen.getByText('Decrement')).toBeInTheDocument();
  });

  it('should update the component state when the store state changes via dispatch', () => {
    render(<TestComponent store={store} />);

    act(() => {
      screen.getByText('Increment').click();
    });
    expect(screen.getByTestId('count').textContent).toBe('1');
    // Check synchronous getState access immediately after dispatch within act
    expect(store.getState().count).toBe(1);

    act(() => {
      screen.getByText('Increment').click();
    });
    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(store.getState().count).toBe(2);

    act(() => {
      screen.getByText('Decrement').click();
    });
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(store.getState().count).toBe(1);
  });

  it('should have a stable dispatch function identity across renders', () => {
    const dispatchInstances = new Set<(action: CounterAction) => void>();
    let capturedDispatch: ((action: CounterAction) => void) | null = null;

    const CaptureDispatchComponent: React.FC<{ store: typeof store }> = ({
      store,
    }) => {
      const [, dispatch] = store.useSyncReducer();
      dispatchInstances.add(dispatch);
      capturedDispatch = dispatch; // Capture the latest dispatch instance
      return null; // No UI needed
    };

    const { rerender } = render(<CaptureDispatchComponent store={store} />);
    const initialDispatch = capturedDispatch;
    expect(initialDispatch).not.toBeNull();

    // Trigger a re-render (e.g., by changing unrelated state or props, or forcing update)
    // Here we simulate by dispatching, which causes a state change and re-render
    act(() => {
      store.dispatch({ type: 'INC' });
    });
    rerender(<CaptureDispatchComponent store={store} />); // Rerender the component

    // Check if the captured dispatch is the same instance
    expect(capturedDispatch).toBe(initialDispatch);
    // Check the Set size - should only contain one instance due to memoization
    expect(dispatchInstances.size).toBe(1);
  });

  it('should re-render when state changes externally', () => {
    const renderSpy = jest.fn();
    render(<TestComponent store={store} onRender={renderSpy} />);
    expect(renderSpy).toHaveBeenCalledTimes(1); // Initial render

    // Dispatch externally (not via component's button click)
    act(() => {
      store.dispatch({ type: 'INC' });
    });

    // Component should re-render due to subscription
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(renderSpy).toHaveBeenCalledTimes(2); // Re-render occurred

    // Dispatch again
    act(() => {
      store.dispatch({ type: 'DEC' });
    });
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(renderSpy).toHaveBeenCalledTimes(3);
  });

  it('should use getServerState for initial render (simulated SSR)', () => {
    const serverState: CounterState = { count: 99 };
    const ssrStore = createSyncStore(counterReducer, serverState);

    // In a real SSR scenario, useSyncExternalStore would use getServerState initially.
    // Here, we verify the hook reads the initial state provided via getServerState.
    const Comp: React.FC = () => {
      const [state] = ssrStore.useSyncReducer();
      return <div data-testid="ssr-count">{state.count}</div>;
    };
    render(<Comp />);
    expect(screen.getByTestId('ssr-count').textContent).toBe('99');
  });
});
