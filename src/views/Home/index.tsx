import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Typography,
  Box,
  Paper,
} from '@material-ui/core';
import { BackendAPI } from '../../core/repository/api/backend';
import moment from 'moment';

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
    text: {
      color: theme.palette.text.primary,
    },
  })
);

export const Home: React.FC = observer(() => {
  const classes = useStyles();
  const [analytics, setAnalytics] = useState<{
    revenue: number;
    guests: number;
    utilization: number;
  }>();

  useEffect(() => {
    BackendAPI.summary({
      from: moment().format('YYYY-MM-DD'),
      to: moment()
        .add(6, 'days')
        .format('YYYY-MM-DD'),
    }).then(({ data }) => {
      setAnalytics(data);
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
        <Typography variant="h4" className={classes.text} gutterBottom>
          Welcome to Hilbert Hostel Management System
        </Typography>
        <Box width="100%">
          <Paper>
            {analytics && (
              <Box padding={2} display="flex" justifyContent="space-between">
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography variant="h4" align="center">
                    Revenue
                  </Typography>
                  <Typography variant="h2" align="center">
                    {analytics?.revenue} THB
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography variant="h4" align="center">
                    Booked Beds
                  </Typography>
                  <Typography variant="h2" align="center">
                    {analytics?.guests} Beds
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography variant="h4" align="center">
                    Room Utilization
                  </Typography>
                  <Typography variant="h2" align="center">
                    {(
                      Math.fround((analytics?.utilization ?? 0) * 1000) / 10
                    ).toFixed(1)}{' '}
                    %
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
});
