import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import {
  makeStyles,
  createStyles,
  Theme,
  Typography,
  Box,
  Avatar,
  Button,
  ListItemSecondaryAction,
  Switch,
} from '@material-ui/core';
import DarkModeIcon from '@material-ui/icons/SettingsBrightness';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks/use-stores';
import { CustomLink } from '../CustomLink';
import { useHistory } from 'react-router-dom';

const drawerWidth = 320;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    drawer: {
      width: drawerWidth + 'px',
      height: '100vh',
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
    yellow: {
      backgroundColor: theme.palette.primary.dark,
      height: '60px',
      width: '60px',
      marginRight: theme.spacing(2),
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    logoutButton: {
      padding: theme.spacing(2),
      borderRadius: 0,
    },
  })
);

export const PermanentDrawer = observer(() => {
  const classes = useStyles();
  const { authStore, themeStore } = useStores();
  const user = authStore.user;
  const history = useHistory();

  const logout = () => {
    authStore.logout();
    history.push('/login');
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <Box className={classes.toolbar} padding={2}>
        <Typography color="primary" variant="h5" align="center">
          Hilbert Hostel
        </Typography>
      </Box>
      <Divider />
      <Box
        display="flex"
        alignItems="center"
        marginTop={2}
        marginBottom={2}
        padding={2}
      >
        <Avatar className={classes.yellow}>
          {user?.firstname && user?.firstname[0]}
          {user?.lastname && user?.lastname[0]}
        </Avatar>
        <Box>
          <Typography variant="h5">
            {user && `Hi, ${user?.firstname} ${user?.lastname}`}
          </Typography>
          <Typography variant="subtitle1">{user && user.email}</Typography>
        </Box>
      </Box>
      <Box flexGrow={1} width="100%">
        <List>
          <ListItem button key="customer">
            <CustomLink to="/customers">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText color="pirmary" primary="Customer" />
            </CustomLink>
          </ListItem>
          <ListItem button key="reservation">
            <CustomLink to="/reservations">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Reservation" />
            </CustomLink>
          </ListItem>
          <ListItem button key="check-in-status">
            <CustomLink to="/check-in-status">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Check-in/Check-out" />
            </CustomLink>
          </ListItem>
          <ListItem button key="doorunlock">
            <CustomLink to="/door-unlock">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Door unlock" />
            </CustomLink>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText id="dark-theme-switch" primary="Dark Theme" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                onChange={() => themeStore.setDarkMode(!themeStore.dark)}
                checked={themeStore.dark}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Box>
      <Button
        variant="contained"
        color="primary"
        className={classes.logoutButton}
        onClick={() => logout()}
      >
        Logout
      </Button>
    </Drawer>
  );
});
