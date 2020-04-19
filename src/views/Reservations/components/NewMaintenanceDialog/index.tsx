import React from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import moment from 'moment';
import { Room } from '../../../../core/models/room';
import * as Yup from 'yup';
import { CreateMaintenanceModel } from '../../../../core/models/maintenance';
import { useFormik } from 'formik';
import { FormDatePicker } from '../../../../core/components/Forms/FormDatePicker';
import { FormText } from '../../../../core/components/Forms/FormText';
import { FormSelect } from '../../../../core/components/Forms/FormSelect';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
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
      "Maintenance start date can't be in the past"
    ),
  to: Yup.date()
    .required()
    .min(Yup.ref('from'), "Maintenance end date can't be before check in date"),
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
      <DialogContent className={classes.root}>
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
          minDate={form.values.from}
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
