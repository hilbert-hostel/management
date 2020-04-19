import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@material-ui/core';
import { useStores } from '../../core/hooks/use-stores';
import { BackendAPI } from '../../core/repository/api/backend';
import MaterialTable from 'material-table';
import { Room } from '../../core/models/room';
import qrcode from 'qrcode';
import { handleServerError } from '../../core/utils/handleServerError';

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
    image: {
      height: 'auto',
      margin: '0 auto',
      display: 'block',
      marginBottom: theme.spacing(3),
    },
  })
);

export const DoorUnlock: React.FC = observer(() => {
  const classes = useStyles();
  const { themeStore, snackbarStore } = useStores();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const [masterKey, setMasterKey] = useState<boolean>(false);
  const [qr, setQR] = useState<string>();

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
    });
  }, []);

  useEffect(() => {
    if (masterKey) {
      BackendAPI.generateMasterKey().then(async res => {
        setQR(
          await qrcode.toDataURL(res.data.code, {
            errorCorrectionLevel: 'M',
            color: themeStore.dark
              ? {
                  dark: '#FFF',
                  light: '#0000',
                }
              : {
                  dark: '#000',
                  light: '#0000',
                },
          })
        );
      });
    }
  }, [masterKey, themeStore]);

  const unlock = async (roomID: number) => {
    try {
      await BackendAPI.openDoor(roomID);
    } catch (error) {
      handleServerError(error, snackbarStore);
    }
  };

  return (
    <>
      <Box
        className={classes.root}
        flexDirection="column"
        justifyContent="center"
        display="flex"
      >
        <Container maxWidth="lg" className={classes.content}>
          <Box paddingBottom={1}>
            <Button onClick={() => setMasterKey(true)}>
              Generate Master key
            </Button>
          </Box>
          <MaterialTable
            columns={[
              { title: 'Room', render: row => <>Room {row.id}</> },
              { title: 'Type', field: 'type' },
              { title: 'Beds', field: 'beds.length' },
              { title: 'Price', field: 'price' },
              {
                render: row => (
                  <Button color="primary" onClick={() => setSelectedRoom(row)}>
                    Unlock Door
                  </Button>
                ),
              },
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
      <Dialog
        open={!!masterKey}
        onClose={() => setMasterKey(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Masterkey</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            QR is valid for 5 minute
          </DialogContentText>
          {qr ? (
            <img src={qr} className={classes.image} alt="qrcode" />
          ) : (
            <CircularProgress className={classes.image} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMasterKey(false)} color="default">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={!!selectedRoom}
        onClose={() => setSelectedRoom(undefined)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to unlock Room {selectedRoom?.id}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Make sure to stay close to the room before unlocking.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRoom(undefined)} color="default">
            Cancel
          </Button>
          <Button
            onClick={() => {
              selectedRoom && unlock(selectedRoom?.id);
              setSelectedRoom(undefined);
            }}
            color="primary"
            autoFocus
          >
            Unlock
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
