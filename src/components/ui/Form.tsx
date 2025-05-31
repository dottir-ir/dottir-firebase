import React from 'react';
import {
  useForm,
  Controller,
  FieldValues,
  SubmitHandler,
  UseFormProps,
} from 'react-hook-form';
import { Box, Button } from '@mui/material';

interface FormProps<T extends FieldValues> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: SubmitHandler<T>;
  defaultValues?: UseFormProps<T>['defaultValues'];
  submitLabel?: string;
  children: React.ReactNode;
}

export function Form<T extends FieldValues>({
  onSubmit,
  defaultValues,
  submitLabel = 'Submit',
  children,
  ...props
}: FormProps<T>) {
  const { control, handleSubmit } = useForm<T>({
    defaultValues,
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.props.name) {
          return (
            <Controller
              name={child.props.name}
              control={control}
              render={({ field }) =>
                React.cloneElement(child, {
                  ...field,
                  ...child.props,
                })
              }
            />
          );
        }
        return child;
      })}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        {submitLabel}
      </Button>
    </Box>
  );
}

// Example usage:
/*
const loginFormFields: FormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    validation: {
      required: 'Email is required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email address',
      },
    },
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    validation: {
      required: 'Password is required',
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters',
      },
    },
  },
];

<Form
  fields={loginFormFields}
  onSubmit={(data) => console.log(data)}
  submitLabel="Sign In"
/>
*/ 