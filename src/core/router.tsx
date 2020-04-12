import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  Redirect,
  RouteProps,
} from 'react-router-dom';
import { Login } from '../views/Login';
import { makeStyles, Theme, createStyles, Box } from '@material-ui/core';
import { Home } from '../views/Home';
import { PopupSnackbar } from './components/PopupSnackbar';
import { observer } from 'mobx-react-lite';
import { useStores } from './hooks/use-stores';
import { PermanentDrawer } from './components/Drawer';
import { DoorUnlock } from '../views/DoorUnlock';
import { Reservations } from '../views/Reservations';
import { CheckInOut } from '../views/CheckInOut';
import { Customers } from '../views/Customers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'stretch',
      overflow: 'hidden',
    },
    content: {
      height: '100%',
      width: '100%',
      marginBottom: '56px',
      // display: 'block',
      overflowX: 'hidden',
      flexGrow: 1,
      '& > div': {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        overflowX: 'hidden',
        paddingBottom: '56px',
      },
    },
  })
);

export const AppRouter: React.FC = () => {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.root}>
        {/* <Navigation /> */}
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <MainRoute path="/reservations">
            <Reservations />
          </MainRoute>
          <MainRoute path="/customers">
            <Customers />
          </MainRoute>
          <MainRoute path="/rooms">
            <Home />
          </MainRoute>
          <MainRoute path="/door-unlock">
            <DoorUnlock />
          </MainRoute>
          <MainRoute path="/check-in-status">
            <CheckInOut />
          </MainRoute>
          <MainRoute>
            <Home />
          </MainRoute>
        </Switch>
        <PopupSnackbar />
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export const MainRoute = observer<MainRouteProps>(
  ({ path, children, ...rest }) => {
    const { authStore, snackbarStore } = useStores();
    const history = useHistory();

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
                snackbarStore.sendMessage({
                  message: 'You are not logged In',
                  type: 'error',
                });
                history.push('/login');
                break;
            }
          }
        }
      };
      initStores();
    }, [authStore, snackbarStore]);

    return (
      <Route path={path} {...rest}>
        <Box width="100%" display="flex" alignItems="stretch">
          <PermanentDrawer />
          <Box width="100%" flexGrow={1}>
            {!authStore.isAuthenticated ? <Redirect to="/login" /> : children}
          </Box>
        </Box>
      </Route>
    );
  }
);

export type MainRouteProps = RouteProps;
