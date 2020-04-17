import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Typography,
  Box,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../core/hooks/use-stores';
import MaterialTable, { MTableToolbar } from 'material-table';
import { CheckInEntry, CheckOutEntry } from '../../core/models/checkinout';
import { BackendAPI } from '../../core/repository/api/backend';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  const history = useHistory();
  const { authStore } = useStores();
  const [isLoading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState<CheckInEntry[]>([]);
  const [checkOut, setCheckOut] = useState<CheckOutEntry[]>([]);

  useEffect(() => {
    setLoading(true);
    BackendAPI.checkInOut().then(res => {
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
              { title: 'Guest', field: 'guest.firstname' },
              { title: 'Nights', field: 'nights' },
              {
                title: 'Check In Time',
                field: 'checkInTime',
                render: data => (
                  <>{moment(data.checkInTime).format('DD/MM/YYYY HH:mm')}</>
                ),
              },
            ]}
            data={checkIn}
            title="Check In"
            options={{
              selection: true,
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
              { title: 'Guest', field: 'guest.firstname' },
              { title: 'Nights', field: 'nights' },
              {
                title: 'Check Out Time',
                field: 'checkOutTime',
                render: data => (
                  <>{moment(data.checkOutTime).format('DD/MM/YYYY HH:mm')}</>
                ),
              },
              { title: 'Phone', field: 'phone' },
            ]}
            data={checkOut}
            title="Check Out"
            options={{
              selection: true,
              pageSize: 6,
            }}
          />
          <br />
        </Container>
      </Box>
    </>
  );
});
