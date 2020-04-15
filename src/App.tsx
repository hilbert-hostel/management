import React, { useEffect } from 'react';
import { AppRouter } from './core/router';
import { ThemeProvider } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { useStores } from './core/hooks/use-stores';
import { observer } from 'mobx-react-lite';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useLocalStorage } from './core/hooks/use-localStorage';
import { PopupSnackbar } from './core/components/PopupSnackbar';

export const App: React.FC<AppProps> = observer(() => {
  const { themeStore, authStore } = useStores();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [localDarkMode] = useLocalStorage<boolean>('dark', prefersDarkMode);
  useEffect(() => {
    const initStores = async () => {
      try {
        if (authStore.isAuthenticated) {
          await authStore.init();
        }
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              break;
          }
        }
      }
    };
    initStores();
  }, [authStore]);

  useEffect(() => {
    const isDark = localDarkMode !== null ? localDarkMode : prefersDarkMode;
    themeStore.setDarkMode(isDark);
  }, [prefersDarkMode, themeStore, localDarkMode]);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={themeStore.theme}>
        <AppRouter />
        <PopupSnackbar />
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
});

export interface AppProps {}
