import React, { useState } from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { RoomTypeResult, Room } from '../../../../core/models/room';
import { ReservationStatusResponse } from '../../../../core/models/reservation';

import IconButton from '@material-ui/core/IconButton';
import ArrowIcon from '@material-ui/icons/ExpandLess';
import TodayIcon from '@material-ui/icons/Today';
import CircularProgress from '@material-ui/core/CircularProgress';
import { number } from 'yup';
import { client } from '../../../../core/repository/api/backend';
import * as Yup from 'yup';
import {
  Maintenance,
  CreateMaintenanceModel,
} from '../../../../core/models/maintenance';
import { useFormik } from 'formik';
import { FormDatePicker } from '../../../../core/components/Forms/FormDatePicker';
import { FormText } from '../../../../core/components/Forms/FormText';
import { FormSelect } from '../../../../core/components/Forms/FormSelect';
import { roomSearchFormSchema } from '../../../../core/components/RoomSearchForm/schema';

const MAX_DATES = 7;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      flexGrow: 1,
      minWidth: 'fit-content',
      padding: theme.spacing(2),
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
    table: {
      display: 'grid',
      gridAutoFlow: 'row dense', /////
      minHeight: '40vh',
      minWidth: 'max(60vw, 1024px)',
      width: '100%',
      backgroundColor: theme.palette.divider,
    },
    dates: {
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },
    box: {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },
    reservationBlock: {
      padding: theme.spacing(0.5),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.primary.light,
      overflow: 'show',
      color: theme.palette.primary.contrastText,
      clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
    },
    reservations: {
      // padding: '5px',
    },
    noLeft: {
      clipPath: 'polygon(0 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
    },
    noRight: {
      clipPath: 'polygon(8px 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    noSlope: {
      clipPath: 'polygon(0px 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
  })
);

const schema = Yup.object<CreateMaintenanceModel>({
  roomID: Yup.number(),
  from: Yup.date()
    .required()
    .min(
      moment()
        .subtract(1, 'day')
        .set({ hours: 23, minutes: 59, seconds: 59 })
        .toDate(),
      "Check In date can't be in the past"
    ),
  to: Yup.date()
    .required()
    .min(Yup.ref('checkIn'), "Check Out date can't be before check in date"),
  description: Yup.string(),
});

export const NewMaintenanceDialog: React.FC<{
  open: boolean;
  handleSubmit: (data: CreateMaintenanceModel) => void;
  handleClose: () => void;
  rooms: Room[];
}> = ({ open, handleSubmit, handleClose, rooms = [] }) => {
  const classes = useStyles();
  const form = useFormik<CreateMaintenanceModel>({
    validationSchema: schema,
    initialValues: {
      from: new Date(),
      to: moment()
        .add(1, 'day')
        .toDate(),
      roomID: 1,
      description: '',
    },
    onSubmit: () => {},
  });

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <DialogTitle>Add new maintenance</DialogTitle>
      <DialogContent>
        <FormSelect
          id="roomID"
          choices={rooms.map(e => {
            return {
              label: 'Room ' + e.id,
              value: e.id,
            };
          })}
          label="Room"
          name="roomID"
          value={form.values.roomID}
          errorText={form.errors && (form.errors.roomID as string)}
          onChange={form.handleChange}
        />
        <FormDatePicker
          label="From"
          name="from"
          value={form.values.from}
          minDate={moment().toDate()}
          minDateMessage="Maintenance start date can not be in the past."
          format="Do MMMM YYYY"
          errorText={form.errors && (form.errors.from as string)}
          onChange={date => form.setFieldValue('from', date?.toDate())}
        />
        <FormDatePicker
          label="To"
          name="to"
          value={form.values.to}
          minDate={form.values.to}
          errorText={form.errors && (form.errors.to as string)}
          format="Do MMMM YYYY"
          onChange={date => form.setFieldValue('to', date?.toDate())}
        />
        <FormText
          id="description"
          label="Description"
          type="text"
          multiline
          name="description"
          value={form.values.description}
          onChange={form.handleChange}
          errorText={form.errors && form.errors.description}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (form.values) {
              handleSubmit && handleSubmit(form.values);
            }
          }}
          color="primary"
          autoFocus
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
