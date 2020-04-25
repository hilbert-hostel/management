import React, { useContext } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import CheckInIcon from '@material-ui/icons/HowToReg';
import DoorIcon from '@material-ui/icons/MeetingRoom';
import HouseIcon from '@material-ui/icons/House';
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
import { waifuContext } from '../../contexts/waifuContext';

export const drawerWidth = 280;

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
    },
    logoutButton: {
      padding: theme.spacing(2),
      borderRadius: 0,
    },
    selected: {
      color: theme.palette.primary.dark,
      '& svg': {
        color: theme.palette.primary.dark,
      },
    },
  })
);

export const PermanentDrawer = observer(() => {
  const classes = useStyles();
  const { authStore, themeStore } = useStores();
  const user = authStore.user;
  const history = useHistory();
  const { images } = useContext(waifuContext);

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
        <Avatar
          className={classes.yellow}
          src={
            themeStore.dark && user
              ? images[
                  (user.firstname.length +
                    user.lastname.length +
                    user.email.length) %
                    images.length
                ]
              : undefined
          }
        >
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
          <ListItem
            button
            key="home"
            className={
              history.location.pathname === '/' ? classes.selected : ''
            }
          >
            <CustomLink to="/">
              <ListItemIcon>
                <HouseIcon />
              </ListItemIcon>
              <ListItemText color="primary" primary="Home" />
            </CustomLink>
          </ListItem>
          <ListItem
            button
            key="customer"
            className={
              history.location.pathname === '/customers' ? classes.selected : ''
            }
          >
            <CustomLink to="/customers">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText color="primary" primary="Customer" />
            </CustomLink>
          </ListItem>
          <ListItem
            button
            key="reservation"
            className={
              history.location.pathname === '/reservations'
                ? classes.selected
                : ''
            }
          >
            <CustomLink to="/reservations">
              <ListItemIcon>
                <CalendarIcon />
              </ListItemIcon>
              <ListItemText primary="Reservation" />
            </CustomLink>
          </ListItem>
          <ListItem
            button
            key="check-in-status"
            className={
              history.location.pathname === '/check-in-status'
                ? classes.selected
                : ''
            }
          >
            <CustomLink to="/check-in-status">
              <ListItemIcon>
                <CheckInIcon />
              </ListItemIcon>
              <ListItemText primary="Check-in/Check-out" />
            </CustomLink>
          </ListItem>
          <ListItem
            button
            key="doorunlock"
            className={
              history.location.pathname === '/door-unlock'
                ? classes.selected
                : ''
            }
          >
            <CustomLink to="/door-unlock">
              <ListItemIcon>
                <DoorIcon />
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
