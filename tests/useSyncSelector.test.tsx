import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { createSyncStore } from '../src/createSyncStore';
import { Reducer } from '../src/types';

// Test setup: More complex state
type UserState = {
  user: { id: number; name: string; email?: string } | null;
  settings: { theme: 'light' | 'dark'; notifications: boolean };
  lastUpdate: number | null;
};
type UserAction =
  | { type: 'LOGIN'; payload: { id: number; name: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'SET_EMAIL'; payload: string };

const userInitialState: UserState = {
  user: null,
  settings: { theme: 'light', notifications: true },
  lastUpdate: null,
};

const userReducer: Reducer<UserState, UserAction> = (state, action) => {
  const timestamp = Date.now();
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, lastUpdate: timestamp };
    case 'LOGOUT':
      return { ...state, user: null, lastUpdate: timestamp };
    case 'SET_THEME':
      return {
        ...state,
        settings: { ...state.settings, theme: action.payload },
        lastUpdate: timestamp,
      };
    case 'TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        settings: {
          ...state.settings,
          notifications: !state.settings.notifications,
        },
        lastUpdate: timestamp,
      };
    case 'SET_EMAIL':
      return state.user
        ? {
            ...state,
            user: { ...state.user, email: action.payload },
            lastUpdate: timestamp,
          }
        : state; // No change if logged out
    default:
      return state;
  }
};

// --- Test Components ---

interface SelectorComponentProps<Selected> {
    store: ReturnType<typeof createSyncStore<UserState, UserAction>>;
    selector: (state: UserState) => Selected;
    equalityFn?: (a: Selected, b: Selected) => boolean;
    dataTestId: string;
    onRender?: () => void;
  }

const SelectorComponent = <Selected,>({
    store,
    selector,
    equalityFn,
    dataTestId,
    onRender,
}: SelectorComponentProps<Selected>) => {
  const selectedState = store.useSyncSelector(selector, equalityFn);
  onRender?.();

  // Displaying the selected state (handling objects for display)
  const displayValue = typeof selectedState === 'object'
    ? JSON.stringify(selectedState)
    : String(selectedState);

  return <div data-testid={dataTestId}>{displayValue}</div>;
};

// --- Tests ---
describe('useSyncSelector Hook', () => {
  let store: ReturnType<typeof createSyncStore<UserState, UserAction>>;

  beforeEach(() => {
    store = createSyncStore(userReducer, userInitialState);
    // Reset Date.now mock if used previously
    jest.restoreAllMocks();
  });

  it('should select and return the correct initial state slice', () => {
    render(
      <SelectorComponent
        store={store}
        selector={(state) => state.settings.theme}
        dataTestId="theme"
      />
    );
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('should select and return an object slice', () => {
    render(
      <SelectorComponent
        store={store}
        selector={(state) => state.settings}
        dataTestId="settings"
      />
    );
    expect(screen.getByTestId('settings').textContent).toBe(
      JSON.stringify({ theme: 'light', notifications: true })
    );
  });

  it('should update the component only when the selected state slice changes (primitive)', () => {
    const renderSpy = jest.fn();
    render(
      <SelectorComponent
        store={store}
        selector={(state) => state.settings.theme}
        dataTestId="theme"
        onRender={renderSpy}
      />
    );
    expect(renderSpy).toHaveBeenCalledTimes(1); // Initial render

    // Dispatch action that changes the selected state (theme)
    act(() => {
      store.dispatch({ type: 'SET_THEME', payload: 'dark' });
    });
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(renderSpy).toHaveBeenCalledTimes(2); // Re-rendered

    // Dispatch action that changes *other* state (notifications), but not the selected theme
    act(() => {
        store.dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
    });
    expect(screen.getByTestId('theme').textContent).toBe('dark'); // Value is the same
    expect(renderSpy).toHaveBeenCalledTimes(2); // Should *not* re-render again

     // Dispatch action that changes *other* state (login)
     act(() => {
        store.dispatch({ type: 'LOGIN', payload: { id: 1, name: 'Test User'} });
    });
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(renderSpy).toHaveBeenCalledTimes(2); // Should *not* re-render again
  });

  it('should update the component only when the selected state slice changes (object, default shallow compare)', () => {
    const renderSpy = jest.fn();
    const settingsSelector = (state: UserState) => state.settings; // Select the settings object

    render(
      <SelectorComponent
        store={store}
        selector={settingsSelector}
        dataTestId="settings"
        onRender={renderSpy}
      />
    );
    expect(renderSpy).toHaveBeenCalledTimes(1);

    // Dispatch action changing a property *within* the selected object slice
    act(() => {
      store.dispatch({ type: 'SET_THEME', payload: 'dark' });
    });
    // The settings object reference changes because the reducer creates a new settings object
    expect(screen.getByTestId('settings').textContent).toBe(
      JSON.stringify({ theme: 'dark', notifications: true })
    );
    expect(renderSpy).toHaveBeenCalledTimes(2); // Re-rendered

    // Dispatch action changing *other* state (user), which also creates a new top-level state object
    // BUT the settings object reference within the new state should be the same as the previous state's
    // if the reducer is implemented correctly (spreading only what changes).
    // However, our reducer *always* creates a new state object, which means settings ref *might* change depending on how it's structured
    // Let's test the user action which *doesn't* touch settings directly
    act(() => {
      store.dispatch({ type: 'LOGIN', payload: { id: 1, name: 'Test' }});
    });
    // Check if it re-rendered unnecessarily. useSyncExternalStoreWithSelector's default equality (Object.is)
    // should prevent re-render if the selector returns the same object reference.
    // Since our reducer returns a new state object, the selector *will* get a new state object,
    // but if `state.settings` reference hasn't changed, it should not re-render.
    // Let's refine the reducer for this case:
    const refinedReducer: Reducer<UserState, UserAction> = (state, action) => {
        const timestamp = Date.now();
        switch (action.type) {
          case 'LOGIN':
            // Only return new object if user actually changes
            if(state.user?.id !== action.payload.id) {
                return { ...state, user: action.payload, lastUpdate: timestamp };
            }
            return state; // Return same state if user is same
          case 'LOGOUT':
            return state.user !== null ? { ...state, user: null, lastUpdate: timestamp } : state;
          case 'SET_THEME':
             if(state.settings.theme !== action.payload) {
                return { ...state, settings: { ...state.settings, theme: action.payload }, lastUpdate: timestamp };
             }
             return state;
          // ... other actions similarly refined ...
          default:
             const newState = userReducer(state, action); // Use original for other cases
             return newState === state ? state : { ...newState, lastUpdate: timestamp }; // Ensure lastUpdate if changed
        }
    };
    store = createSyncStore(refinedReducer, userInitialState); // Use refined reducer

    // Render again with the refined store
    const { rerender } = render(
        <SelectorComponent store={store} selector={settingsSelector} dataTestId="settings" onRender={renderSpy} />
    );
    renderSpy.mockClear(); // Reset spy after initial render
    expect(renderSpy).toHaveBeenCalledTimes(1);

    // Dispatch login - this shouldn't change settings ref
    act(() => {
      store.dispatch({ type: 'LOGIN', payload: { id: 1, name: 'Test' }});
    });
    expect(renderSpy).toHaveBeenCalledTimes(1); // Should NOT re-render settings component

     // Dispatch set theme - this SHOULD change settings ref
     act(() => {
        store.dispatch({ type: 'SET_THEME', payload: 'dark' });
      });
      expect(renderSpy).toHaveBeenCalledTimes(2); // Should re-render settings component

  });

  it('should use custom equality function correctly', () => {
    const renderSpy = jest.fn();
    // Selector returns an object, but we only care if the theme property changes
    const themeSelector = (state: UserState) => ({ theme: state.settings.theme });
    // Custom equality: only re-render if theme string is different
    const themeEqualityFn = (a: { theme: string }, b: { theme: string }) => a.theme === b.theme;

    render(
      <SelectorComponent
        store={store}
        selector={themeSelector}
        equalityFn={themeEqualityFn}
        dataTestId="custom-eq"
        onRender={renderSpy}
      />
    );
    expect(renderSpy).toHaveBeenCalledTimes(1); // Initial render
    expect(screen.getByTestId('custom-eq').textContent).toBe(JSON.stringify({ theme: 'light' }));

    // Dispatch action that changes the theme
    act(() => {
      store.dispatch({ type: 'SET_THEME', payload: 'dark' });
    });
    expect(screen.getByTestId('custom-eq').textContent).toBe(JSON.stringify({ theme: 'dark' }));
    expect(renderSpy).toHaveBeenCalledTimes(2); // Re-rendered because theme changed

    // Dispatch action that changes notifications but NOT theme
    act(() => {
        store.dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
    });
    // The selector will return a *new object* { theme: 'dark' } because the root state changed,
    // but the custom equality function should see the 'theme' property is the same ('dark' === 'dark')
    // and prevent a re-render.
    expect(screen.getByTestId('custom-eq').textContent).toBe(JSON.stringify({ theme: 'dark' }));
    expect(renderSpy).toHaveBeenCalledTimes(2); // Should *not* re-render again due to custom equalityFn

  });

  it('should select derived data correctly', () => {
    const renderSpy = jest.fn();
    // Selector derives a boolean based on user state
    const isLoggedInSelector = (state: UserState) => state.user !== null;

    render(
      <SelectorComponent
        store={store}
        selector={isLoggedInSelector}
        dataTestId="is-logged-in"
        onRender={renderSpy}
      />
    );
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('is-logged-in').textContent).toBe('false'); // Initially logged out

    // Log in
    act(() => {
        store.dispatch({ type: 'LOGIN', payload: { id: 1, name: 'User' }});
    });
    expect(screen.getByTestId('is-logged-in').textContent).toBe('true');
    expect(renderSpy).toHaveBeenCalledTimes(2); // Re-rendered

    // Change theme (should not affect isLoggedIn)
    act(() => {
        store.dispatch({ type: 'SET_THEME', payload: 'dark' });
    });
    expect(screen.getByTestId('is-logged-in').textContent).toBe('true');
    expect(renderSpy).toHaveBeenCalledTimes(2); // Should not re-render

    // Log out
    act(() => {
        store.dispatch({ type: 'LOGOUT' });
    });
    expect(screen.getByTestId('is-logged-in').textContent).toBe('false');
    expect(renderSpy).toHaveBeenCalledTimes(3); // Re-rendered
  });
});
