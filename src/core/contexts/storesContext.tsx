// src/contexts/index.tsx
import React from 'react';
import { createTestStore } from '../stores';
import { createAuthStore } from '../stores/auth';
import { createThemeStore } from '../stores/theme';
import { createSnackbarStore } from '../stores/snackbar';
import { useLocalStore } from 'mobx-react-lite';

export const storesContext = React.createContext({
  testStore: createTestStore(),
  authStore: createAuthStore(),
  themeStore: createThemeStore(),
  snackbarStore: createSnackbarStore(),
});

export const StoreProvider: React.FC = ({ children }) => {
  const store = useLocalStore(() => ({
    testStore: createTestStore(),
    authStore: createAuthStore(),
    themeStore: createThemeStore(),
    snackbarStore: createSnackbarStore(),
  }));
  return (
    <storesContext.Provider value={store}>{children}</storesContext.Provider>
  );
};
