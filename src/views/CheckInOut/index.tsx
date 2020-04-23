import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Typography,
  Box,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import MaterialTable, { MTableToolbar } from 'material-table';
import {
  CheckInEntry,
  CheckOutEntry,
  Record,
} from '../../core/models/checkinout';
import { BackendAPI } from '../../core/repository/api/backend';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { orange } from '@material-ui/core/colors';

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

export const CheckInOut: React.FC = observer(() => {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState<CheckInEntry[]>([]);
  const [checkOut, setCheckOut] = useState<CheckOutEntry[]>([]);
  const [record, setRecord] = useState<Record>();

  useEffect(() => {
    setLoading(true);
    BackendAPI.checkInOut({
      from: moment().format('YYYY-MM-DD'),
      to: moment()
        .add(6, 'days')
        .format('YYYY-MM-DD'),
    }).then(res => {
      setLoading(false);
      const { checkIn, checkOut } = res.data;
      setCheckIn(checkIn);
      setCheckOut(checkOut);
    });
  }, []);

  return (
    <>
      {/* <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h4">Check In/ Check Out</Typography>
        </Toolbar>
      </AppBar> */}
      <Box
        className={classes.root}
        flexDirection="column"
        justifyContent="center"
        display="flex"
      >
        <Container maxWidth="lg" className={classes.content}>
          <MaterialTable
            components={{
              Toolbar: props => {
                return (
                  <>
                    <MTableToolbar {...props} />
                    {isLoading && (
                      <Box display="flex" alignItems="center" paddingLeft={2}>
                        <CircularProgress
                          size={20}
                          style={{ marginRight: '8px' }}
                        />
                        <Typography variant="body1">Loading...</Typography>
                      </Box>
                    )}
                  </>
                );
              },
            }}
            columns={[
              {
                title: 'Guest',
                field: 'guest.firstname',
                render: row => {
                  return (
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Avatar
                        style={{
                          backgroundColor: orange[300],
                          marginRight: '8px',
                        }}
                      >
                        {row.guest.firstname.toUpperCase()[0]}
                      </Avatar>
                      {row.guest.firstname}
                    </Box>
                  );
                },
              },
              { title: 'Nights', field: 'nights' },
              {
                title: 'Check In Time',
                field: 'checkInTime',
                render: data => (
                  <>{moment(data.checkInTime).format('DD/MM/YYYY HH:mm')}</>
                ),
              },
              {
                title: 'Check In Record',
                render: data => (
                  <Button
                    color="primary"
                    onClick={() => setRecord(data.record)}
                  >
                    View Record
                  </Button>
                ),
              },
            ]}
            data={checkIn}
            title="Check In"
            options={{
              // selection: true,
              pageSize: 6,
            }}
          />
          <br />
          <MaterialTable
            components={{
              Toolbar: props => {
                return (
                  <>
                    <MTableToolbar {...props} />
                    {isLoading && (
                      <Box display="flex" alignItems="center" paddingLeft={2}>
                        <CircularProgress
                          size={20}
                          style={{ marginRight: '8px' }}
                        />
                        <Typography variant="body1">Loading...</Typography>
                      </Box>
                    )}
                  </>
                );
              },
            }}
            columns={[
              {
                title: 'Guest',
                field: 'guest.firstname',
                render: row => {
                  return (
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Avatar
                        style={{
                          backgroundColor: orange[300],
                          marginRight: '8px',
                        }}
                      >
                        {row.guest.firstname.toUpperCase()[0]}
                      </Avatar>
                      {row.guest.firstname}
                    </Box>
                  );
                },
              },
              { title: 'Nights', field: 'nights' },
              {
                title: 'Check Out Time',
                field: 'checkOutTime',
                render: data => (
                  <>{moment(data.checkOutTime).format('DD/MM/YYYY HH:mm')}</>
                ),
              },
            ]}
            data={checkOut}
            title="Check Out"
            options={{
              // selection: true,
              pageSize: 6,
            }}
          />
          <br />
        </Container>
      </Box>
      <Dialog open={!!record} onClose={() => setRecord(undefined)}>
        <DialogTitle id="alert-dialog-title">Check-In Record</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ID: {record?.idCardData.nationalID}
          </Typography>
          <Typography variant="body1">
            Full Name (TH): {record?.idCardData.nameTH}
          </Typography>
          <Typography variant="body1">
            Full Name (EN): {record?.idCardData.nameEN}
          </Typography>
          <Typography variant="body1">
            Address: {record?.idCardData.address}
          </Typography>
          <Typography variant="body1">
            Gender: {record?.idCardData.gender}
          </Typography>
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Typography variant="body1">ID card photo</Typography>
            <img src={record?.idCardData.idCardPhoto} alt="id card" />
            <Typography variant="body1">Card photo</Typography>
            <img src={record?.idCardData.photo} alt="check in kiosk" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecord(undefined)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
