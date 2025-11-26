import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import DropdownOptionsField from './DropdownOptionsField';

const FormikValuesChangeObserver: React.FC<{
  onValuesChange: (values: any) => void;
}> = ({ onValuesChange }) => {
  const { values } = useFormikContext();

  React.useEffect(() => {
    onValuesChange(values);
  }, [values, onValuesChange]);

  return null;
};

interface CustomFieldFormValues {
  field_label: string;
  field_type: 'alphanumeric' | 'numeric' | 'date' | 'dropdown';
  is_required: boolean;
  description: string;
  dropdown_values: CustomFieldDropdownValue[];
}

interface CustomFieldFormProps {
  initialValues: CustomFieldFormValues;
  onSubmit: (
    values: CustomFieldFormValues,
    helpers: FormikHelpers<CustomFieldFormValues>
  ) => void;
  onCancel: () => void;
  onDeleteField?: (fieldId: number, fieldLabel: string) => void;
  onValuesChange?: (values: CustomFieldFormValues) => void;
  isSubmitting: boolean;
  loading: boolean;
  isEditing: boolean;
  editingField: CustomFieldDefinition | null;
  fieldTypeOptions: Array<{ value: string; label: string }>;
  validationSchema: Yup.ObjectSchema<any>;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  onDeleteField,
  onValuesChange,
  isSubmitting,
  loading,
  isEditing,
  editingField,
  fieldTypeOptions,
  validationSchema,
}) => {
  const handleDelete = () => {
    if (editingField?.id && onDeleteField) {
      onDeleteField(editingField.id, editingField.field_label);
    }
  };
  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          resetForm,
        }) => (
          <Form>
            {onValuesChange && (
              <FormikValuesChangeObserver onValuesChange={onValuesChange} />
            )}
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardHeader
                title={
                  isEditing
                    ? `Edit field: ${editingField?.field_label}`
                    : 'Create new field'
                }
              />
              <CardContent>
                <Box sx={{ display: 'grid', gap: 3 }}>
                  <TextField
                    label="Field Label"
                    name="field_label"
                    value={values.field_label}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.field_label && Boolean(errors.field_label)}
                    helperText={touched.field_label && errors.field_label}
                    fullWidth
                    placeholder="Enter a descriptive label for this field"
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start',
                    }}
                  >
                    <Autocomplete
                      fullWidth
                      options={fieldTypeOptions}
                      getOptionLabel={(option) => option.label}
                      value={
                        fieldTypeOptions.find(
                          (option) => option.value === values.field_type
                        ) || null
                      }
                      onChange={(_, newValue) => {
                        setFieldValue('field_type', newValue?.value || '');
                      }}
                      onBlur={handleBlur}
                      disabled={isEditing}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Field Type"
                          name="field_type"
                          error={
                            touched.field_type && Boolean(errors.field_type)
                          }
                          helperText={
                            isEditing
                              ? 'Field type cannot be changed to prevent data issues'
                              : touched.field_type && errors.field_type
                          }
                        />
                      )}
                    />

                    <Box sx={{ minWidth: '150px', pt: 1 }}>
                      <FormControlLabel
                        labelPlacement="start"
                        control={
                          <Switch
                            name="is_required"
                            checked={Boolean(values.is_required)}
                            onChange={handleChange}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Required field
                          </Typography>
                        }
                      />
                    </Box>
                  </Box>

                  <TextField
                    label="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Optional description to help employees understand this field"
                    helperText="This description will be shown to users when they fill out this field"
                  />

                  {values.field_type === 'dropdown' && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        Dropdown Options
                      </Typography>

                      <DropdownOptionsField
                        values={values.dropdown_values}
                        onChange={(newValues) =>
                          setFieldValue('dropdown_values', newValues)
                        }
                        error={
                          touched.dropdown_values && errors.dropdown_values
                            ? String(errors.dropdown_values)
                            : undefined
                        }
                        editingField={editingField}
                      />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
              }}
            >
              <Button
                onClick={() => {
                  onCancel();
                  resetForm();
                }}
                variant="outlined"
                sx={{ minWidth: '100px', textTransform: 'none' }}
              >
                Cancel
              </Button>
              {isEditing && editingField?.id && onDeleteField && (
                <Button
                  onClick={handleDelete}
                  variant="outlined"
                  color="error"
                  sx={{ minWidth: '100px', textTransform: 'none' }}
                >
                  Delete
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || loading}
                sx={{ minWidth: '120px', textTransform: 'none' }}
              >
                {isSubmitting || loading ? 'Saving...' : 'Save Field'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CustomFieldForm;
