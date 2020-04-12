import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../core/hooks/use-stores';
import { ReservationTable } from './components/ReservationTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100%',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'stretch',
    },
    title: {
      marginBottom: theme.spacing(6),
    },
    button: {
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
      zIndex: 5,
    },
    content: {},
    scrollWrapper: {
      flexWrap: 'nowrap',
      overflowX: 'auto',
      width: 'calc(100vw - 280px)',
    },
  })
);

export const Reservations: React.FC = observer(() => {
  const classes = useStyles();
  const history = useHistory();
  const { authStore } = useStores();
  return (
    <>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h4">Reservations</Typography>
          </Toolbar>
        </AppBar>
        <Box
          flexGrow={1}
          height="100%"
          className={classes.content}
          paddingTop={3}
          display="flex"
          alignItems="stretch"
          justifyContent="stretch"
        >
          <div className={classes.scrollWrapper}>
            <ReservationTable />
          </div>
        </Box>
      </div>
    </>
  );
});
