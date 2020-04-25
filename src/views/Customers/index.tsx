import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Box,
  Avatar,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { BackendAPI } from '../../core/repository/api/backend';
import { orange } from '@material-ui/core/colors';
import { User } from '../../core/models/user';
import { useStores } from '../../core/hooks/use-stores';
import { waifuContext } from '../../core/contexts/waifuContext';

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
  const { themeStore } = useStores();
  const [data, setData] = useState<(User & { fullname: string })[]>([]);
  const { images } = useContext(waifuContext);

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
      {/* <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h4">Customers</Typography>
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
            columns={[
              {
                title: 'Fullname',
                field: 'fullname',
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
                        src={
                          themeStore.dark
                            ? images[
                                (row.firstname.length +
                                  row.lastname.length +
                                  row.email.length) %
                                  images.length
                              ]
                            : undefined
                        }
                      >
                        {row.fullname.toUpperCase()[0]}
                      </Avatar>
                      {row?.fullname}
                    </Box>
                  );
                },
              },
              { title: 'Email', field: 'email' },
              { title: 'Address', field: 'address' },
              { title: 'Phone', field: 'phone' },
              {
                title: 'National ID',
                field: 'nationalID',
              },
            ]}
            data={data.map((e, i) => ({ ...e, index: i }))}
            title="Customers"
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
