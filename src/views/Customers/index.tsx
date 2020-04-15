import React, { useState, useEffect } from 'react';
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
import { useStores } from '../../core/hooks/use-stores';
import MaterialTable from 'material-table';
import { BackendAPI } from '../../core/repository/api/backend';

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

export const Customers: React.FC = observer(() => {
  const classes = useStyles();
  const history = useHistory();
  const { authStore } = useStores();
  const [data, setData] = useState();

  useEffect(() => {
    BackendAPI.guests().then(res => {
      setData(
        res.data.map(e => {
          return {
            ...e,
            fullname: e.firstname + ' ' + e.lastname,
          };
        })
      );
    });
  }, []);

  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h4">Customers</Typography>
        </Toolbar>
      </AppBar>
      <Box
        className={classes.root}
        flexDirection="column"
        justifyContent="center"
        display="flex"
      >
        <Container maxWidth="lg" className={classes.content}>
          <MaterialTable
            columns={[
              { title: 'Fullname', field: 'fullname' },
              { title: 'Email', field: 'email' },
              { title: 'Address', field: 'address' },
              { title: 'Phone', field: 'phone' },
              {
                title: 'National ID',
                field: 'nationalID',
              },
            ]}
            data={data}
            title=" "
            options={{
              selection: true,
              pageSize: 10,
              pageSizeOptions: [5, 10],
            }}
          />
        </Container>
      </Box>
    </>
  );
});
