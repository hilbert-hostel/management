import React, { ChangeEvent, ReactNode } from 'react';
import {
  TextField,
  makeStyles,
  Theme,
  createStyles,
  TextFieldProps,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // paddingLeft: theme.spacing(1),
      // paddingRight: theme.spacing(1),
      width: '100%',
    },
    marginBottom: {
      marginBottom: theme.spacing(2),
    },
    formControl: {
      width: '100%',
    },
  })
);

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  errorText,
  error = !!errorText,
  onChange,
  autoComplete = name,
  helperText,
  choices,
  value,
  marginBottom = true,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <div
      className={
        classes.root + (marginBottom ? ' ' + classes.marginBottom : '')
      }
    >
      <FormControl
        variant="filled"
        className={classes.formControl}
        error={!!error}
      >
        <InputLabel id={id + '-label'}>{label}</InputLabel>
        <Select
          labelId={id + '-label'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
        >
          {choices.map(choice => {
            return (
              <MenuItem
                key={'select-' + id + '-choice-' + choice.value}
                value={choice.value}
              >
                {choice.label}
              </MenuItem>
            );
          })}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export type FormSelectProps = {
  id?: string;
  name?: string;
  type?: string;
  helperText?: string | ReactNode;
  choices: { label: string; value: string | number }[];
  label?: string | ReactNode;
  placeholder?: string;
  autoComplete?: string;
  multiline?: boolean;
  error?: boolean;
  marginBottom?: boolean;
  errorText?: string;
  onChange?: (e: ChangeEvent<any>) => void;
  value?: string | number | unknown;
};
