import { Button } from './Button';

interface FormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  validation?: {
    required?: boolean | string;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    validate?: (value: any) => boolean | string;
  };
  options?: { label: string; value: string }[];
}

interface FormProps<T extends FieldValues> {
  fields: FormField[];
  onSubmit: SubmitHandler<T>;
  submitLabel?: string;
  defaultValues?: DefaultValues<T>;
  formOptions?: Omit<UseFormProps<T>, 'defaultValues'>;
  className?: string;
}

export function Form<T extends FieldValues>({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  defaultValues,
  formOptions,
  className = '',
}: FormProps<T>) {
  const { theme } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    defaultValues,
    ...formOptions,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-6 ${className}`}
    >
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label htmlFor={field.name} className="text-sm font-medium">
            {field.label}
          </label>
          <Controller
            name={field.name as any}
            control={control}
            rules={field.validation}
            render={({ field: { onChange, value, ref } }) => (
              <Input
                id={field.name}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={value}
                onChange={onChange}
                ref={ref}
                aria-invalid={!!errors[field.name]}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              />
            )}
          />
          {errors[field.name] && (
            <p id={`${field.name}-error`} className="text-sm text-red-500">
              {errors[field.name]?.message as string}
            </p>
          )}
        </div>
      ))}
      <Button
        type="submit"
        disabled={isSubmitting}
        className={`
          bg-${theme.colors.primary}
          text-white
          hover:bg-opacity-90
          w-full
        `}
      >
        {submitLabel}
      </Button>
    </form>
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