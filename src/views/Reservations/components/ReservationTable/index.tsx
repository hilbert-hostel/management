import React, { useState } from 'react';
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
  Paper,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { grey } from '@material-ui/core/colors';
import { RoomTypeResult } from '../../../../core/models/room';
import {
  ReservationResponse,
  ReservationStatusResponse,
} from '../../../../core/models/reservation';

import IconButton from '@material-ui/core/IconButton';
import ArrowIcon from '@material-ui/icons/ExpandLess';
import TodayIcon from '@material-ui/icons/Today';
import CircularProgress from '@material-ui/core/CircularProgress';

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
      color: theme.palette.primary.contrastText,
      clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
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
  onChangeDate,
  isLoading = false,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const getCoordinate = (reservation: any) => {
    const start =
      moment(reservation.checkIn).diff(startWeek, 'days') < 0
        ? 1
        : moment(reservation.checkIn).diff(startWeek, 'days') + 1;
    const end =
      moment(reservation.checkOut).diff(startWeek, 'days') > 7
        ? 7
        : moment(reservation.checkOut).diff(startWeek, 'days') + 1;
    return {
      gridColumnStart: start,
      gridColumnEnd: end,
    };
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
                  <>
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
                        <>
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
                                    style={getCoordinate(reservation)}
                                    className={``}
                                  >
                                    <div
                                      className={`${classes.reservationBlock} 
                                    ${
                                      moment(reservation.checkIn).isBefore(
                                        startWeek
                                      )
                                        ? moment(reservation.checkIn).isAfter(
                                            startWeek.clone().endOf('isoWeek')
                                          )
                                          ? classes.noSlope
                                          : classes.noLeft
                                        : moment(reservation.checkIn).isAfter(
                                            startWeek.clone().endOf('isoWeek')
                                          )
                                        ? classes.noRight
                                        : ''
                                    }
                                   
                                    `}
                                    >
                                      <Typography
                                        variant="body2"
                                        align="center"
                                      >
                                        {reservation.guest.firstname}{' '}
                                        {reservation.guest.lastname[0]}.
                                      </Typography>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </>
                      );
                    })}
                  </>
                );
              })}
            </div>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export interface ReservationTableProps {
  date: Moment;
  rooms: RoomTypeResult[];
  reservations: ReservationStatusResponse[];
  onChangeDate?: (date: Moment) => void;
  isLoading: boolean;
}
