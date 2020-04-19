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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../core/hooks/use-stores';
import { ReservationTable } from './components/ReservationTable';
import { BackendAPI } from '../../core/repository/api/backend';
import moment from 'moment';
import { ReservationStatusResponse } from '../../core/models/reservation';
import { RoomTypeResult } from '../../core/models/room';
import { NewMaintenanceDialog } from './components/NewMaintenanceDialog';
import {
  CreateMaintenanceModel,
  Maintenance,
} from '../../core/models/maintenance';
import { handleServerError } from '../../core/utils/handleServerError';

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
  const { snackbarStore } = useStores();
  const [isLoading, setLoading] = useState(false);
  const [date, setDate] = useState(moment().startOf('isoWeek'));
  const [reservations, setReservations] = useState<ReservationStatusResponse[]>(
    []
  );
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [rooms, setRooms] = useState<RoomTypeResult[]>([]);
  const [toDelete, setToDelete] = useState<Maintenance>();
  const addMaintenance = async (values: CreateMaintenanceModel) => {
    try {
      await BackendAPI.addMaintenance({
        ...values,
        from: moment(values.from).format('YYYY-MM-DD'),
        to: moment(values.to).format('YYYY-MM-DD'),
      });
      snackbarStore.sendMessage({
        message: 'Maintenance created',
        type: 'success',
      });
      setFormOpen(false);
      updateMaintenance();
    } catch (error) {
      handleServerError(error, snackbarStore);
    }
  };

  const deleteMaintenance = async (maintenance: Maintenance) => {
    try {
      if (!isLoading) {
        setLoading(true);
        await BackendAPI.deleteMaintenance(maintenance.id.toString());
        snackbarStore.sendMessage({
          message: 'Maintenance Deleted Successfully',
          type: 'success',
        });
        updateMaintenance();
        setToDelete(undefined);
        setLoading(false);
      }
    } catch (error) {
      handleServerError(error, snackbarStore);
      setLoading(false);
    }
  };

  const updateMaintenance = async () => {
    try {
      const { data } = await BackendAPI.maintenances({
        from: date.format('YYYY-MM-DD'),
        to: date
          .clone()
          .add(6, 'days')
          .format('YYYY-MM-DD'),
      });
      setMaintenances(data);
    } catch (error) {
      handleServerError(error, snackbarStore);
    }
  };

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
    BackendAPI.maintenances({
      from: date.format('YYYY-MM-DD'),
      to: date
        .clone()
        .add(6, 'days')
        .format('YYYY-MM-DD'),
    }).then(({ data }) => setMaintenances(data));
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
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="stretch"
        >
          <Box paddingTop={0} paddingLeft={1} padding={1}>
            <Button onClick={() => setFormOpen(true)}>Add Maintenance</Button>
          </Box>
          <div className={classes.scrollWrapper}>
            {rooms && (
              <ReservationTable
                date={date}
                reservations={reservations}
                rooms={rooms}
                maintenances={maintenances}
                isLoading={isLoading}
                onChangeDate={newDate => {
                  setReservations([]);
                  setDate(newDate);
                }}
                // onSelectReservation={console.log}
                onDeleteMaintenance={setToDelete}
              />
            )}
          </div>
        </Box>
      </div>
      {rooms && (
        <NewMaintenanceDialog
          open={formOpen}
          rooms={rooms
            .map(roomType => {
              const { type, description, price, facilities } = roomType;
              return roomType.rooms.map(
                e =>
                  ({
                    ...e,
                    type,
                    description,
                    price,
                    facilities,
                  } as any)
              );
            })
            .reduce((p, c) => [...p, ...c], [])}
          handleClose={() => setFormOpen(false)}
          handleSubmit={values => addMaintenance(values)}
        />
      )}
      <Dialog
        open={!!toDelete}
        onClose={() => setToDelete(undefined)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this maintenance
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This can't be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(undefined)} color="default">
            Close
          </Button>
          <Button
            onClick={() => toDelete && deleteMaintenance(toDelete)}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
