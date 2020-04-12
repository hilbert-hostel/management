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
import moment from 'moment';
import { grey } from '@material-ui/core/colors';

const MAX_DATES = 7;

const rooms = [
  {
    price: 600,
    description:
      'Private room with twin-size bed with 6 beds in a row. Comprising more security, social life, showers, and room with multiple bunks. There is air conditioning provided in every room. Also, a private bathroom and free wifi.',
    photos: [
      {
        photo_url:
          'https://www.myboutiquehotel.com/photos/106370/room-17553924-840x460.jpg',
        photo_description: null,
      },
    ],
    facilities: [
      { name: 'towel', description: 'per person', count: 1 },
      { name: 'soap', description: 'per person per night', count: 2 },
      { name: 'shampoo', description: 'per person per night', count: 2 },
      {
        name: 'bottled water',
        description: 'per person per night',
        count: 1,
      },
      { name: 'air conditioner', description: null, count: 1 },
      { name: 'wifi', description: null, count: 1 },
      { name: 'breakfast included', description: null, count: 1 },
      { name: 'refundable', description: null, count: 1 },
    ],
    rooms: [
      { id: 1, available: 6 },
      { id: 2, available: 6 },
      { id: 3, available: 5 },
    ],
    type: 'mixed-dorm-s',
  },
  {
    price: 600,
    description:
      'Private room with twin-size bed with 10 beds in a row. Comprising more security, social life, showers, and room with multiple bunks. There is air conditioning provided in every room. Also, a private bathroom and free wifi.',
    photos: [
      {
        photo_url:
          'https://www.myboutiquehotel.com/photos/106370/room-17553924-840x460.jpg',
        photo_description: null,
      },
    ],
    facilities: [
      { name: 'breakfast included', description: null, count: 1 },
      { name: 'wifi', description: null, count: 1 },
      { name: 'air conditioner', description: null, count: 1 },
      {
        name: 'bottled water',
        description: 'per person per night',
        count: 1,
      },
      { name: 'shampoo', description: 'per person per night', count: 2 },
      { name: 'soap', description: 'per person per night', count: 2 },
      { name: 'towel', description: 'per person', count: 1 },
      { name: 'refundable', description: null, count: 1 },
    ],
    rooms: [
      { id: 4, available: 10 },
      { id: 5, available: 9 },
    ],
    type: 'mixed-dorm-m',
  },
  {
    price: 600,
    description:
      'Private room with twin-size bed with 15 beds in a row. Comprising more security, social life, showers, and room with multiple bunks. There is air conditioning provided in every room. Also, a private bathroom and free wifi.',
    photos: [
      {
        photo_url:
          'https://www.myboutiquehotel.com/photos/106370/room-17553924-840x460.jpg',
        photo_description: null,
      },
    ],
    facilities: [
      { name: 'breakfast included', description: null, count: 1 },
      { name: 'wifi', description: null, count: 1 },
      { name: 'air conditioner', description: null, count: 1 },
      {
        name: 'bottled water',
        description: 'per person per night',
        count: 1,
      },
      { name: 'shampoo', description: 'per person per night', count: 2 },
      { name: 'soap', description: 'per person per night', count: 2 },
      { name: 'towel', description: 'per person', count: 1 },
      { name: 'refundable', description: null, count: 1 },
    ],
    rooms: [{ id: 6, available: 11 }],
    type: 'mixed-dorm',
  },
  {
    price: 600,
    description:
      'Private room with twin-size bed with 15 beds in a row. Comprising more security, social life, showers, and room with multiple bunks. There is air conditioning provided in every room. Also, a private bathroom and free wifi.',
    photos: [
      {
        photo_url:
          'https://www.myboutiquehotel.com/photos/106370/room-17553924-840x460.jpg',
        photo_description: null,
      },
    ],
    facilities: [
      { name: 'soap', description: 'per person per night', count: 2 },
      { name: 'towel', description: 'per person', count: 1 },
      { name: 'shampoo', description: 'per person per night', count: 2 },
      {
        name: 'bottled water',
        description: 'per person per night',
        count: 1,
      },
      { name: 'air conditioner', description: null, count: 1 },
      { name: 'wifi', description: null, count: 1 },
      { name: 'breakfast included', description: null, count: 1 },
      { name: 'refundable', description: null, count: 1 },
    ],
    rooms: [{ id: 7, available: 15 }],
    type: 'mixed-dorm-l',
  },
  {
    price: 650,
    description:
      'Private women room with queen-size bed with 10 beds in a row. Comprising more social life, showers, room with multiple bunks and lastly, security for women. There is air conditioning provided in every room. Also, a private bathroom and free wifi.',
    photos: [
      {
        photo_url:
          'https://a0.muscache.com/im/pictures/109451542/8989b537_original.jpg?aki_policy=large',
        photo_description: null,
      },
    ],
    facilities: [
      { name: 'towel', description: 'per person', count: 1 },
      { name: 'soap', description: 'per person per night', count: 2 },
      { name: 'shampoo', description: 'per person per night', count: 2 },
      {
        name: 'bottled water',
        description: 'per person per night',
        count: 1,
      },
      { name: 'air conditioner', description: null, count: 1 },
      { name: 'wifi', description: null, count: 1 },
      { name: 'breakfast included', description: null, count: 1 },
      { name: 'refundable', description: null, count: 1 },
    ],
    rooms: [{ id: 8, available: 10 }],
    type: 'women-dorm-m',
  },
  {
    price: 650,
    description:
      'Private women room with queen-size bed with 10 beds in a row. Comprising more social life, showers, room with multiple bunks and lastly, security for women. There is air conditioning provided in every room. Also, a private bathroom and free wifi.',
    photos: [
      {
        photo_url:
          'https://a0.muscache.com/im/pictures/109451542/8989b537_original.jpg?aki_policy=large',
        photo_description: null,
      },
    ],
    facilities: [
      { name: 'towel', description: 'per person', count: 1 },
      { name: 'soap', description: 'per person per night', count: 2 },
      { name: 'shampoo', description: 'per person per night', count: 2 },
      {
        name: 'bottled water',
        description: 'per person per night',
        count: 1,
      },
      { name: 'air conditioner', description: null, count: 1 },
      { name: 'wifi', description: null, count: 1 },
      { name: 'breakfast included', description: null, count: 1 },
      { name: 'refundable', description: null, count: 1 },
    ],
    rooms: [{ id: 9, available: 20 }],
    type: 'women-dorm-l',
  },
];

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
    table: {
      display: 'grid',
      gridAutoFlow: 'row dense', /////
      minHeight: '40vh',
      minWidth: '60vw',
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
      padding: '5px',
      width: '100%',
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

export const ReservationTable: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [startWeek, setStartWeeek] = useState(moment().startOf('week'));

  const reservations = Array(24)
    .fill(null)
    .map((_, i) => {
      const startDay = startWeek
        .clone()
        .add(Math.round(Math.random() * 9 - 1), 'days');
      return {
        id: i,
        bedid: Math.ceil(i / 2),
        checkIn: startDay,
        checkOut: startDay
          .clone()
          .add(Math.round(Math.random() * 2 + 1), 'days'),
      };
    });

  const getCoordinate = (reservation: any) => {
    const start = moment(reservation.checkIn).diff(startWeek, 'days') + 2;
    const end = moment(reservation.checkOut).diff(startWeek, 'days') + 3;
    return {
      gridColumnStart: start,
      gridColumnEnd: end,
    };
  };

  return (
    <>
      <Box className={classes.root} flexDirection="column" display="flex">
        <Paper>
          <Box
            className={classes.root}
            flexDirection="column"
            justifyContent="center"
            display="flex"
            padding={1}
          >
            <Box width="100%">
              <Typography variant="h6">
                {moment().format('MMMM YYYY')}
              </Typography>
            </Box>
            <div
              className={classes.table}
              style={{
                gridTemplateRows: `[header] 1fr repeat(${rooms.reduce(
                  (p, c) => 1 + p + c.rooms.length,
                  0
                )}, min(16px, 1fr))`,
                gridTemplateColumns: `[header] 2fr repeat(${MAX_DATES}, min(100px, 1fr))`,
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
                              gridRowGap: '10px',
                              gridAutoFlow: 'row dense',
                              gridTemplateColumns: `repeat(${MAX_DATES}, min(200px, 1fr))`,
                            }}
                          >
                            {reservations
                              .filter(e => e.bedid === room.id)
                              .map(reservation => {
                                return (
                                  <div
                                    style={getCoordinate(reservation)}
                                    className={``}
                                  >
                                    <div
                                      className={`${classes.reservationBlock} 
                                    ${
                                      reservation.checkIn.isBefore(startWeek)
                                        ? reservation.checkOut.isAfter(
                                            startWeek.clone().endOf('week')
                                          )
                                          ? classes.noSlope
                                          : classes.noLeft
                                        : reservation.checkOut.isAfter(
                                            startWeek.clone().endOf('week')
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
                                        Reservation {reservation.id}
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
