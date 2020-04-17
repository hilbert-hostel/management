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
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../core/hooks/use-stores';
import { BackendAPI } from '../../core/repository/api/backend';
import MaterialTable from 'material-table';
import { Room } from '../../core/models/room';

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

export const DoorUnlock: React.FC = observer(() => {
  const classes = useStyles();
  const history = useHistory();
  const { authStore } = useStores();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    BackendAPI.rooms().then(res => {
      const { data } = res;
      const rooms = data
        .map(roomType => {
          return roomType.rooms.map(e => ({
            ...e,
            type: roomType.type,
            price: roomType.price,
          }));
        })
        .reduce((p, c) => {
          return [...p, ...c];
        }, [] as any[]);
      setRooms(rooms);
      console.log(rooms);
    });
  }, []);
  return (
    <Box
      className={classes.root}
      flexDirection="column"
      justifyContent="center"
      display="flex"
    >
      <Container maxWidth="lg" className={classes.content}>
        <MaterialTable
          columns={[
            { title: 'Room', render: row => <>Room {row.id}</> },
            { title: 'Type', field: 'type' },
            { title: 'Beds', field: 'beds.length' },
            { title: 'Price', field: 'price' },
          ]}
          data={rooms}
          title="Door Unlock"
          options={{
            // selection: true,
            pageSize: 10,
          }}
        />
      </Container>
    </Box>
  );
});
