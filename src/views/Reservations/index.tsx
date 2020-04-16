import React, { useEffect, useState } from 'react';
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
import { BackendAPI } from '../../core/repository/api/backend';
import moment from 'moment';
import { ReservationStatusResponse } from '../../core/models/reservation';
import { RoomTypeResult } from '../../core/models/room';

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
  const [isLoading, setLoading] = useState(false);
  const [date, setDate] = useState(moment().startOf('isoWeek'));
  const [reservations, setReservations] = useState<ReservationStatusResponse[]>(
    []
  );
  const [rooms, setRooms] = useState<RoomTypeResult[]>([]);

  useEffect(() => {
    setLoading(true);
    BackendAPI.rooms().then(({ data }) => setRooms(data));
    BackendAPI.reservations({
      from: date.format('YYYY-MM-DD'),
      to: date
        .clone()
        .add(6, 'days')
        .format('YYYY-MM-DD'),
    }).then(({ data }) => {
      setLoading(false);
      setReservations(data);
    });
  }, [date]);
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
            {rooms && (
              <ReservationTable
                date={date}
                reservations={reservations}
                rooms={rooms}
                isLoading={isLoading}
                onChangeDate={newDate => {
                  setReservations([]);
                  setDate(newDate);
                }}
                onSelectReservation={console.log}
              />
            )}
          </div>
        </Box>
      </div>
    </>
  );
});
