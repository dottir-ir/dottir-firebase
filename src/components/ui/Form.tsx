import React from 'react';
import { Box } from '@mui/material';
import { useForm, Controller, type FieldValues, type FieldErrors, type SubmitHandler, type Path, type UseFormProps, type DefaultValues } from 'react-hook-form';

export type ErrorMessage = string | { message?: string } | undefined;

export interface Field<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  validation?: {
    required?: boolean | string;
    min?: number | { value: number; message: string };
    max?: number | { value: number; message: string };
    minLength?: number | { value: number; message: string };
    maxLength?: number | { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    validate?: (value: any) => boolean | string;
  };
}

export interface FormProps<T extends FieldValues> {
  fields: Field<T>[];
  onSubmit: SubmitHandler<T>;
  submitLabel?: string;
  defaultValues?: DefaultValues<T>;
  formOptions?: Omit<UseFormProps<T>, 'defaultValues'>;
  className?: string;
  [key: string]: any;
}

const getErrorMessage = (error: ErrorMessage): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'Invalid input';
};

export function Form<T extends FieldValues>({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  defaultValues,
  formOptions,
  className = '',
  ...props
}: FormProps<T>) {
  const methods = useForm<T>({
    defaultValues,
    ...formOptions,
  });
  const { control, handleSubmit, formState: { errors, isSubmitting } } = methods;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className={className}
      {...props}
    >
      {fields.map((field) => (
        <Box key={String(field.name)} sx={{ mb: 2 }}>
          <Box sx={{ mb: 1 }}>
            <label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
            </label>
          </Box>
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: { onChange, value, ref } }) => (
              <input
                id={field.name}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={value}
                onChange={onChange}
                ref={ref}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-invalid={!!errors[field.name]}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              />
            )}
          />
          {errors[field.name] && (
            <Box sx={{ fontSize: '12px', color: 'red' }} id={`${field.name}-error`}>
              {getErrorMessage(errors[field.name] as ErrorMessage)}
            </Box>
          )}
        </Box>
      ))}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : submitLabel}
      </button>
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