# react-sync-reducer

[![npm version](https://badge.fury.io/js/react-sync-reducer.svg)](https://badge.fury.io/js/react-sync-reducer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A React state management utility providing a `useReducer`-like hook with synchronous state access and selector support. Uses a factory function (`createSyncStore`) to create isolated state containers.

## Features

- **Reducer Logic:** Manage state updates using familiar reducer functions.
- **Synchronous Access:** Get the latest state immediately after dispatch using `store.getState()`.
- **React Integration:** Hooks (`useSyncReducer`, `useSyncSelector`) powered by `useSyncExternalStore` for optimal React 18+ compatibility.
- **Isolated Stores:** Create multiple independent state stores using the `createSyncStore` factory.
- **Selector Support:** Efficiently subscribe to specific state slices or derived data using `useSyncSelector`.
- **TypeScript:** Fully typed for a better developer experience.

## Installation
