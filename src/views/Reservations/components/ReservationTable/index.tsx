import React, { useState } from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Box,
  Paper,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { RoomTypeResult } from '../../../../core/models/room';
import { ReservationStatusResponse } from '../../../../core/models/reservation';

import IconButton from '@material-ui/core/IconButton';
import ArrowIcon from '@material-ui/icons/ExpandLess';
import TodayIcon from '@material-ui/icons/Today';
import CircularProgress from '@material-ui/core/CircularProgress';
import { number } from 'yup';
import { client } from '../../../../core/repository/api/backend';
import { Maintenance } from '../../../../core/models/maintenance';

const MAX_DATES = 7;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      flexGrow: 1,
      minWidth: 'fit-content',
      padding: theme.spacing(2),
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
    table: {
      display: 'grid',
      gridAutoFlow: 'row dense', /////
      minHeight: '40vh',
      minWidth: 'max(60vw, 1024px)',
      width: '100%',
      backgroundColor: theme.palette.divider,
    },
    dates: {
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },
    box: {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },
    reservationBlock: {
      padding: theme.spacing(0.5),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.primary.light,
      overflow: 'show',
      color: theme.palette.primary.contrastText,
      clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
      transition: 'background-color .5s ease',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    maintenanceBlock: {
      padding: theme.spacing(0.5),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.secondary.light,
      overflow: 'show',
      color: theme.palette.primary.contrastText,
      clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
      transition: 'background-color .5s ease',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
      },
    },
    reservations: {
      // padding: '5px',
    },
    noLeft: {
      clipPath: 'polygon(0 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
    },
    noRight: {
      clipPath: 'polygon(8px 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    noSlope: {
      clipPath: 'polygon(0px 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
  })
);

export const ReservationTable: React.FC<ReservationTableProps> = ({
  date: startWeek,
  reservations,
  rooms,
  maintenances,
  onChangeDate,
  onSelectReservation,
  isLoading = false,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const getCoordinate = (from: Date, to: Date) => {
    const start =
      moment(from).diff(startWeek, 'days') < 0
        ? 1
        : moment(from).diff(startWeek, 'days') + 1;
    const end =
      moment(to).diff(startWeek, 'days') > 7
        ? 8
        : moment(to).diff(startWeek, 'days') + 1;
    return start !== end
      ? {
          gridColumnStart: start,
          gridColumnEnd: end,
        }
      : { display: 'none' };
  };

  return (
    <>
      <Box className={classes.root} flexDirection="column" display="flex">
        <Paper style={{ width: '100%' }}>
          <Box
            className={classes.root}
            flexDirection="column"
            justifyContent="center"
            display="flex"
            padding={1}
          >
            <Box width="100%" display="flex" alignItems="center">
              <IconButton
                aria-label="Go to week before"
                style={{ transform: 'rotate(-90deg)' }}
                onClick={() =>
                  onChangeDate &&
                  onChangeDate(startWeek.clone().subtract(1, 'week'))
                }
              >
                <ArrowIcon />
              </IconButton>
              <Typography variant="h6">
                {startWeek.format('DD MMMM YYYY')} -{' '}
                {startWeek
                  .clone()
                  .endOf('isoWeek')
                  .format('DD MMMM YYYY')}
              </Typography>
              <IconButton
                aria-label="Go to next week"
                style={{ transform: 'rotate(90deg)' }}
                onClick={() =>
                  onChangeDate && onChangeDate(startWeek.clone().add(1, 'week'))
                }
              >
                <ArrowIcon />
              </IconButton>
              <IconButton
                aria-label="Go to next week"
                onClick={() =>
                  onChangeDate && onChangeDate(moment().startOf('isoWeek'))
                }
              >
                <TodayIcon />
              </IconButton>
              {isLoading && (
                <Box display="flex" alignItems="center">
                  <CircularProgress size={20} style={{ marginRight: '8px' }} />
                  <Typography variant="body1">Loading...</Typography>
                </Box>
              )}
            </Box>
            <div
              className={classes.table}
              style={{
                gridTemplateRows: `[header] 1fr repeat(${rooms.reduce(
                  (p, c) => 1 + p + c.rooms.length,
                  0
                )}, min(16px, 1fr))`,
                gridTemplateColumns: `[header] 2fr repeat(${MAX_DATES}, minmax(60px, 1fr))`,
              }}
            >
              <div
                className={classes.box}
                style={{ gridColumnStart: 1, gridColumnEnd: 2 }}
              >
                {' '}
              </div>
              {/* header */}
              {Array(MAX_DATES)
                .fill(null)
                .map((_, i) => {
                  return (
                    <div
                      key={'day-' + i}
                      className={classes.dates}
                      style={{
                        gridRowStart: 1,
                        gridRowEnd: 2,
                        gridColumnStart: i + 2,
                        gridColumnEnd: i + 3,
                      }}
                    >
                      <Typography variant="body1" align="center">
                        {startWeek
                          .clone()
                          .add(i, 'days')
                          .format('ddd DD')}
                      </Typography>
                    </div>
                  );
                })}
              {rooms.map((room, i) => {
                return (
                  <React.Fragment key={'room-type-' + room.type}>
                    <div
                      className={classes.box}
                      style={{
                        gridColumn: '1 / 2',
                        gridColumnEnd: 9,
                      }}
                    >
                      <Typography variant="body1">{room.type}</Typography>
                    </div>
                    {room.rooms.map((room, i) => {
                      return (
                        <React.Fragment key={'room-' + room.id}>
                          <div
                            className={classes.box}
                            style={{
                              gridColumn: '1 / 2',
                            }}
                          >
                            <Typography variant="body2">
                              Room {room.id}
                            </Typography>
                          </div>
                          <div
                            key={'room-' + room.id + '-reservations'}
                            className={classes.reservations}
                            style={{
                              gridColumn: '2 / 9',
                              display: 'grid',
                              gridRowGap: '5px',
                              gridAutoFlow: 'row dense',
                              alignItems: 'center',
                              justifyItems: 'stretch',
                              gridTemplateColumns: `repeat(7, minmax(60px, 1fr))`,
                            }}
                          >
                            {reservations
                              .filter(e =>
                                e.rooms.map(e => e.id).includes(room.id)
                              )
                              .map(reservation => {
                                return (
                                  <div
                                    key={'reservation-' + reservation.id}
                                    style={{
                                      ...getCoordinate(
                                        reservation.checkIn,
                                        reservation.checkOut
                                      ),
                                      padding: '2.5px',
                                    }}
                                    onClick={() =>
                                      onSelectReservation &&
                                      onSelectReservation(reservation)
                                    }
                                  >
                                    <ReservationHover
                                      reservation={reservation}
                                      startWeek={startWeek}
                                    />
                                  </div>
                                );
                              })}
                            {maintenances
                              .filter(e => room.id === e.roomID)
                              .map(maintenance => {
                                return (
                                  <div
                                    key={'maintenance-' + maintenance.id}
                                    style={{
                                      ...getCoordinate(
                                        maintenance.from,
                                        maintenance.to
                                      ),
                                      padding: '2.5px',
                                    }}
                                  >
                                    <MaintenanceHover
                                      maintenance={maintenance}
                                      startWeek={startWeek}
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </Box>
        </Paper>
      </Box>
    </>
  );
};
export const MaintenanceHover: React.FC<{
  maintenance: Maintenance;
  startWeek: Moment;
}> = ({ maintenance, startWeek }) => {
  const classes = useStyles();
  const [show, setShow] = useState<boolean>(false);
  const [coordinate, setCoordinates] = useState<{ x: number; y: number }>();
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  return (
    <div
      onMouseEnter={event => {
        event.persist();
        setTimer(
          setTimeout(() => {
            setShow(true);
            setCoordinates({
              x:
                window.innerWidth - event.clientX < 300
                  ? event.clientX - 300
                  : event.clientX,
              y:
                window.innerHeight - event.clientY < 125
                  ? event.clientY - 125
                  : event.clientY,
            });
          }, 500)
        );
      }}
      onMouseLeave={() => {
        if (timer) clearTimeout(timer);
        setShow(false);
      }}
    >
      <div
        className={`${classes.maintenanceBlock} 
        ${
          moment(maintenance.from).isBefore(startWeek)
            ? moment(maintenance.to).isAfter(startWeek.clone().endOf('isoWeek'))
              ? classes.noSlope
              : classes.noLeft
            : moment(maintenance.to).isAfter(startWeek.clone().endOf('isoWeek'))
            ? classes.noRight
            : ''
        }`}
      >
        <Typography variant="body2" align="center">
          Maintenance
        </Typography>
      </div>
      {show && (
        <Box
          position="fixed"
          top={coordinate?.y}
          left={coordinate?.x}
          maxWidth="300px"
          zIndex="999"
        >
          <Paper>
            <Box padding={1}>
              <Typography variant="h6">
                Maintenance: {maintenance.id}
              </Typography>
              <Typography variant="body2">
                From : {moment(maintenance.from).format('DD MMM YYYY')}
              </Typography>
              <Typography variant="body2">
                To : {moment(maintenance.to).format('DD MMM YYYY')}
              </Typography>
              <Typography variant="body2">
                Description : {maintenance.description}
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </div>
  );
};
export const ReservationHover: React.FC<{
  reservation: ReservationStatusResponse;
  startWeek: Moment;
}> = ({ reservation, startWeek }) => {
  const classes = useStyles();
  const [show, setShow] = useState<boolean>(false);
  const [coordinate, setCoordinates] = useState<{ x: number; y: number }>();
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  return (
    <div
      onMouseEnter={event => {
        event.persist();
        setTimer(
          setTimeout(() => {
            setShow(true);
            setCoordinates({
              x:
                window.innerWidth - event.clientX < 300
                  ? event.clientX - 300
                  : event.clientX,
              y:
                window.innerHeight - event.clientY < 125
                  ? event.clientY - 125
                  : event.clientY,
            });
          }, 500)
        );
      }}
      onMouseLeave={() => {
        if (timer) clearTimeout(timer);
        setShow(false);
      }}
    >
      <div
        className={`${classes.reservationBlock} 
        ${
          moment(reservation.checkIn).isBefore(startWeek)
            ? moment(reservation.checkOut).isAfter(
                startWeek.clone().endOf('isoWeek')
              )
              ? classes.noSlope
              : classes.noLeft
            : moment(reservation.checkOut).isAfter(
                startWeek.clone().endOf('isoWeek')
              )
            ? classes.noRight
            : ''
        }`}
      >
        <Typography variant="body2" align="center">
          {reservation.guest.firstname} {reservation.guest.lastname[0]}.
        </Typography>
      </div>
      {show && (
        <Box
          position="fixed"
          top={coordinate?.y}
          left={coordinate?.x}
          maxWidth="300px"
          zIndex="999"
        >
          <Paper>
            <Box padding={1}>
              <Typography variant="h6">
                Reservation: {reservation.id}
              </Typography>
              <Typography variant="body2">
                Duration : {moment(reservation.checkIn).format('DD MMM YYYY')} -{' '}
                {moment(reservation.checkOut).format('DD MMM YYYY')}
              </Typography>
              <Typography variant="body2">
                Reserver: {reservation.guest.firstname}{' '}
                {reservation.guest.lastname} ({reservation.guest.email})
              </Typography>
              <Typography variant="body2">
                Rooms : {reservation.rooms.map(e => 'Room ' + e.id).join(', ')}
              </Typography>
              <Typography variant="body2">
                Special Requests : {reservation.specialRequests || '-'}
              </Typography>
              <Typography variant="body2">
                Payment : {reservation.isPaid ? 'Paid' : 'Not Paid'}
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </div>
  );
};
export interface ReservationTableProps {
  date: Moment;
  rooms: RoomTypeResult[];
  reservations: ReservationStatusResponse[];
  maintenances: Maintenance[];
  onChangeDate?: (date: Moment) => void;
  onSelectReservation?: (reservation: ReservationStatusResponse) => void;
  isLoading: boolean;
}
