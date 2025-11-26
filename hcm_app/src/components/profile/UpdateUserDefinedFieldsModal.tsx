import { useNotifications } from '@armhr/ui';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { useApi } from '../../hooks/useApi';
import { CustomField } from '../common/CustomField';

interface CustomFieldFormValues {
  [key: string]: string | null;
}

interface UpdateUserDefinedFieldsModalProps {
  open: boolean;
  onClose: () => void;
  refreshProfile: () => void;
  customFields: ProfileCustomFieldValue[];
  isRequired?: boolean;
}

const UpdateUserDefinedFieldsModal: React.FC<
  UpdateUserDefinedFieldsModalProps
> = ({ open, onClose, refreshProfile, customFields, isRequired = false }) => {
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotifications();
  const api = useApi();

  useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  // Show all fields regardless of isRequired mode
  const fieldsToShow = customFields;

  // Check if all required fields are filled
  const areAllRequiredFieldsFilled = (
    values: CustomFieldFormValues
  ): boolean => {
    return customFields
      .filter((field) => field.field_definition.is_required)
      .every((field) => {
        const value = values[field.field_definition.field_key];
        return value !== null && value !== undefined && value.trim() !== '';
      });
  };

  // Create initial values from the custom fields
  const getInitialValues = (): CustomFieldFormValues => {
    const initialValues: CustomFieldFormValues = {};
    fieldsToShow.forEach((field) => {
      // Convert empty strings to null for consistent handling
      initialValues[field.field_definition.field_key] =
        field.field_value || null;
    });
    return initialValues;
  };

  // Create validation schema based on field definitions
  const createValidationSchema = () => {
    const schemaShape: any = {};

    fieldsToShow.forEach((field) => {
      const fieldKey = field.field_definition.field_key;
      const fieldLabel = field.field_definition.field_label;
      const isRequired = field.field_definition.is_required;
      const fieldType = field.field_definition.field_type;

      let fieldValidation: any;

      switch (fieldType) {
        case 'numeric':
          fieldValidation = Yup.string()
            .nullable()
            .test(
              'is-number',
              `${fieldLabel} must be a valid number`,
              (value) => !value || !isNaN(Number(value))
            );
          break;
        case 'date':
          fieldValidation = Yup.string()
            .nullable()
            .test(
              'is-date',
              `${fieldLabel} must be a valid date`,
              (value) => !value || !isNaN(Date.parse(value))
            );
          break;
        case 'dropdown':
          const dropdownValues = field.field_definition.dropdown_values.map(
            (dv) => dv.value
          );
          fieldValidation = Yup.string()
            .nullable()
            .test(
              'valid-dropdown-value',
              `${fieldLabel} must be one of the allowed values`,
              (value) => !value || dropdownValues.includes(value)
            );
          break;
        default: // alphanumeric
          fieldValidation = Yup.string().nullable();
          break;
      }

      if (isRequired) {
        fieldValidation = fieldValidation.required(`${fieldLabel} is required`);
      }

      schemaShape[fieldKey] = fieldValidation;
    });

    return Yup.object().shape(schemaShape);
  };

  const handleSubmit = async (
    values: CustomFieldFormValues,
    helpers: FormikHelpers<CustomFieldFormValues>
  ) => {
    try {
      setError(null);
      helpers.setSubmitting(true);

      // Transform form values to the expected API format
      const fieldUpdates = fieldsToShow.map((field) => ({
        field_key: field.field_definition.field_key,
        field_value: values[field.field_definition.field_key] || '',
      }));

      const updatePayload = {
        field_values: fieldUpdates,
      };

      await api.profiles.updateEmployeeCustomFields(updatePayload);

      showNotification({
        message: 'Custom fields updated successfully.',
        severity: 'success',
        autoHideDuration: 3000,
      });

      refreshProfile();

      // Only allow closing if not required or all required fields are filled
      if (!isRequired || areAllRequiredFieldsFilled(values)) {
        onClose();
      }
    } catch (err) {
      console.error('Error updating custom fields:', err);
      setError('Failed to update custom fields. Please try again.');
    } finally {
      helpers.setSubmitting(false);
    }
  };

  if (fieldsToShow.length === 0) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={isRequired ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isRequired}
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 1,
            }}
          >
            {isRequired ? 'Complete your profile' : 'Update custom fields'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: '400px',
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            {isRequired
              ? 'Please fill out the information below to complete your profile.'
              : ''}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 2 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: '0.9rem' },
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <Formik
          initialValues={getInitialValues()}
          validationSchema={createValidationSchema()}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <Box sx={{ pr: 1 }}>
                <Box
                  sx={{
                    pt: 1,
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 2.5,
                  }}
                >
                  {fieldsToShow.map((field) => (
                    <CustomField
                      key={field.field_definition.field_key}
                      fieldDefinition={field.field_definition}
                    />
                  ))}
                </Box>
              </Box>

              <DialogActions sx={{ mt: 4, px: 0, gap: 2 }}>
                {!isRequired && (
                  <Button onClick={onClose} variant="outlined">
                    Cancel{' '}
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Saving...'
                    : isRequired
                    ? 'Complete profile'
                    : 'Save changes'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserDefinedFieldsModal;
