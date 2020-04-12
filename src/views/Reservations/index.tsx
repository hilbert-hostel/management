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
      height: '100%',
      flexGrow: 1,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    },
    title: {
      marginBottom: theme.spacing(6),
    },
    button: {
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
      zIndex: 5,
    },
    content: {
      paddingTop: theme.spacing(3),
      height: '100%',
    },
  })
);

export const Reservations: React.FC = observer(() => {
  const classes = useStyles();
  const history = useHistory();
  const { authStore } = useStores();
  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h4">Reservations</Typography>
        </Toolbar>
      </AppBar>
      <Box
        className={classes.root}
        flexDirection="column"
        justifyContent="center"
        display="flex"
      >
        <Container maxWidth="lg" className={classes.content}>
          <ReservationTable />
        </Container>
      </Box>
    </>
  );
});
