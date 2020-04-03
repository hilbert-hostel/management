import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../core/hooks/use-stores';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Typography,
  Button,
  Box,
} from '@material-ui/core';
import { BackendAPI } from '../../core/repository/api/backend';
import { useHistory } from 'react-router-dom';
import { Hero } from './components/Hero';
import { useFormik } from 'formik';
import { FormText } from '../../core/components/Forms/FormText';
import { LoginModel } from '../../core/models/auth';
import { loginSchema } from './schema';
import { useQuery } from '../../core/hooks/use-query';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(4),
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    paper: {
      padding: theme.spacing(3),
    },
    inputField: {
      marginBottom: theme.spacing(2),
    },
    text: {
      color: theme.palette.text.primary,
    },
    title: {
      flexGrow: 1,
    },
    divider: {
      marginBottom: theme.spacing(2),
    },
    button: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(4),
    },
    toRegister: {
      fontWeight: 'bold',
      display: 'block',
      textDecoration: 'none',
      marginBottom: theme.spacing(3),
    },
  })
);

export const Login: React.FC = observer(() => {
  const classes = useStyles();
  const { authStore, snackbarStore } = useStores();
  const history = useHistory();
  const query = useQuery();

  const form = useFormik<LoginModel>({
    validationSchema: loginSchema,
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async values => {
      try {
        const res = await BackendAPI.login(values);
        authStore.setToken(res.data.token);
        history.push(query.get('returnTo') || '/');
      } catch (error) {
        switch (error.response.status) {
          case 400:
            snackbarStore.sendMessage({
              type: 'error',
              message: 'Username or password is incorrect',
            });
            break;
          case 500:
            snackbarStore.sendMessage({
              type: 'error',
              message: 'Something went wrong',
            });
            break;
          default:
            snackbarStore.sendMessage({
              type: 'error',
              message: "Can't connect to server",
            });
            break;
        }
      }
    },
  });

  return (
    <>
      <Box display="flex" minHeight="100vh" justifyContent="center">
        <Hero />
        <Container maxWidth="md" className={classes.root}>
          <Typography
            variant="h3"
            className={classes.text}
            align="center"
            gutterBottom
          >
            Login
          </Typography>
          <Typography
            variant="subtitle1"
            className={classes.text}
            align="center"
            gutterBottom
          >
            Please enter your Username and Password
          </Typography>
          <form onSubmit={form.handleSubmit}>
            <Box
              alignItems="stretch"
              flexDirection="column"
              justifyContent="center"
              display="flex"
            >
              <FormText
                id="email"
                label="E-mail"
                name="email"
                errorText={
                  form.submitCount > 0 && form.touched.email
                    ? form.errors['email']
                    : undefined
                }
                onBlur={form.handleBlur}
                onChange={form.handleChange}
                value={form.values.email}
              />
              <FormText
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                errorText={
                  form.submitCount > 0 && form.touched.password
                    ? form.errors['password']
                    : undefined
                }
                onBlur={form.handleBlur}
                onChange={form.handleChange}
                value={form.values.password}
              />
              <Button
                variant="contained"
                onClick={() => form.submitForm()}
                color="primary"
                className={classes.button}
              >
                Login
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
});
