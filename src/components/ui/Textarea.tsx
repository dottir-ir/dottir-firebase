import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface TextareaProps extends Omit<TextFieldProps, 'multiline' | 'minRows' | 'maxRows'> {
  minRows?: number;
  maxRows?: number;
}

export function Textarea({
  minRows = 3,
  maxRows = 6,
  ...props
}: TextareaProps) {
  return (
    <TextField
      multiline
      minRows={minRows}
      maxRows={maxRows}
      {...props}
    />
  );
} 