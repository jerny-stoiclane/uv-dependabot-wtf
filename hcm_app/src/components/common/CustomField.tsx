import { Autocomplete, TextField, TextFieldProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { parseISO } from 'date-fns';
import { Field, FieldProps } from 'formik';
import { useState } from 'react';

// Reusable props for different fields
type CustomFieldProps = {
  fieldDefinition:
    | CustomFieldDefinition
    | ProfileCustomFieldValue['field_definition'];
  // Allow passing other TextField props
} & Omit<TextFieldProps, 'name'>;

// Component to render a single custom field based on its type
export const CustomField: React.FC<CustomFieldProps> = ({
  fieldDefinition,
  ...rest
}) => {
  const {
    field_key,
    field_label,
    field_type,
    is_required,
    description,
    dropdown_values,
  } = fieldDefinition;

  // State to manage date picker visibility
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  // Use Formik's Field component to handle state and validation
  return (
    <Field name={field_key}>
      {({ field, form, meta }: FieldProps) => {
        const hasError = Boolean(meta.touched && meta.error);
        const helperText =
          meta.touched && meta.error ? meta.error : description;

        const commonProps = {
          ...field,
          ...rest,
          label: field_label,
          error: hasError,
          helperText: helperText,
          required: is_required,
          fullWidth: true,
          // Ensure controlled input: coerce null/undefined to empty string
          value: field.value ?? '',
        };

        // Render different field types using a switch
        switch (field_type) {
          case 'dropdown':
            return (
              <Autocomplete
                options={dropdown_values?.map((option) => option.value) || []}
                value={field.value || null}
                onChange={(_, newValue) => {
                  // Manually update Formik's value
                  form.setFieldValue(field.name, newValue || '');
                }}
                onBlur={field.onBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name={field.name}
                    label={field_label}
                    error={hasError}
                    helperText={helperText}
                    required={is_required}
                    fullWidth
                  />
                )}
              />
            );

          case 'date': {
            const { value, ...restOfField } = field;
            const textFieldProps = { ...rest, ...restOfField };
            return (
              <DatePicker
                label={field_label}
                value={value ? parseISO(value) : null}
                open={isDatePickerOpen}
                onOpen={() => setDatePickerOpen(true)}
                onClose={() => setDatePickerOpen(false)}
                onChange={(date) => {
                  form.setFieldValue(
                    field.name,
                    date ? date.toISOString().split('T')[0] : ''
                  );
                }}
                slotProps={{
                  textField: {
                    ...textFieldProps,
                    required: is_required,
                    fullWidth: true,
                    error: hasError,
                    helperText: helperText,
                    onClick: () => setDatePickerOpen(true),
                    InputLabelProps: { shrink: true },
                  },
                }}
              />
            );
          }
          case 'numeric':
            return (
              <TextField
                {...commonProps}
                type="text"
                inputMode="decimal"
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow only numeric input
                  if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
                    field.onChange(e);
                  }
                }}
                onWheel={(e) => {
                  if (e.target instanceof HTMLElement) {
                    e.target.blur();
                  }
                }}
              />
            );

          default: // alphanumeric
            return <TextField {...commonProps} />;
        }
      }}
    </Field>
  );
};
