import { useNotifications } from '@armhr/ui';
import {
  Alert,
  Box,
  Button,
  Dialog,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { useApi } from '../../hooks/useApi';
import { useUser } from '../../hooks/useUser';

const EmergencyContactSchema = Yup.object().shape({
  contact_name: Yup.string().required('Contact name is required'),
  contact_info: Yup.string().required('Contact info is required'),
  contact_relationship: Yup.string().required(
    'Contact relationship is required'
  ),
  contact_type: Yup.string()
    .oneOf(
      ['PHONE', 'EMAIL', 'ADDRESS', 'TEXT', 'OTHER', ''],
      'Invalid contact type'
    )
    .required('Contact type is required'),
});

const UpdateEmergencyContactsDialog: React.FC<{
  open?: boolean;
  onClose?: () => void;
  emergencyContacts: FormikEmergencyContact[];
  personChecksum: string;
  ecIndex: number;
}> = ({
  open: initialOpen = false,
  onClose,
  emergencyContacts,
  personChecksum,
  ecIndex,
}) => {
  const [open, setOpen] = useState(initialOpen);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotifications();
  const { refresh } = useUser();
  const api = useApi();

  useEffect(() => {
    setError(null);
  }, [open]);

  useEffect(() => {
    setOpen(initialOpen);
  }, [initialOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleDelete = async () => {
    try {
      const updatePayload: UpdateEmergencyContactsPayload = {
        person_checksum: personChecksum,
        emergency_contact: emergencyContacts?.filter(
          (_, index) => index !== ecIndex
        ),
      };
      await api.profiles.updateEmergencyContacts(updatePayload);
      setOpen(false);
      refresh();
      showNotification({
        message: 'Emergency contact removed successfully.',
        severity: 'success',
      });
    } catch (error) {
      console.error(error);
      setError('Failed to remove emergency contact.');
    }
  };

  const formik = useFormik({
    initialValues: emergencyContacts[ecIndex],
    validationSchema: EmergencyContactSchema,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      setError(null);
      try {
        const updatePayload: UpdateEmergencyContactsPayload = {
          person_checksum: personChecksum,
          emergency_contact: emergencyContacts.map((contact, index) =>
            index === ecIndex ? values : contact
          ),
        };
        await api.profiles.updateEmergencyContacts(updatePayload);
        setOpen(false);
        refresh();
        showNotification({
          message: 'Emergency contacts updated successfully.',
          severity: 'success',
        });
      } catch (error) {
        console.error(error);
        setError(
          'Failed to update emergency contacts. Please refresh and try again.'
        );
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  return (
    <Box>
      <Button
        size="small"
        color="primary"
        variant="outlined"
        sx={{ minWidth: 48 }}
        onClick={() => setOpen(true)}
      >
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" mb={4}>
            Update Emergency contact
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Box>
              {error && (
                <Alert sx={{ mb: 2 }} severity="error">
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                </Alert>
              )}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <TextField
                  name={'contact_name'}
                  label="Contact Name"
                  value={formik.values.contact_name}
                  onChange={formik.handleChange}
                  error={
                    !!formik.errors?.contact_name &&
                    formik.touched?.contact_name
                  }
                  helperText={
                    formik.touched?.contact_name && formik.errors?.contact_name
                  }
                  fullWidth
                  autoComplete="name"
                />
                <TextField
                  name={`contact_relationship`}
                  label="Contact Relationship"
                  value={formik.values.contact_relationship}
                  onChange={formik.handleChange}
                  error={
                    !!formik.errors?.contact_relationship &&
                    formik.touched?.contact_relationship
                  }
                  helperText={
                    formik.touched?.contact_relationship &&
                    formik.errors?.contact_relationship
                  }
                  fullWidth
                />
                <TextField
                  name={`contact_type`}
                  label="Contact Type"
                  value={formik.values.contact_type}
                  onChange={formik.handleChange}
                  error={
                    !!formik.errors?.contact_type &&
                    formik.touched?.contact_type
                  }
                  helperText={
                    formik.touched?.contact_type && formik.errors?.contact_type
                  }
                  fullWidth
                  select
                >
                  <MenuItem value="PHONE">Phone</MenuItem>
                  <MenuItem value="EMAIL">Email</MenuItem>
                  <MenuItem value="ADDRESS">Address</MenuItem>
                  <MenuItem value="TEXT">Text</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </TextField>
                <TextField
                  name={'contact_info'}
                  label="Contact Info"
                  value={formik.values.contact_info}
                  onChange={formik.handleChange}
                  error={
                    !!formik.errors?.contact_info &&
                    formik.touched?.contact_info
                  }
                  helperText={
                    formik.touched?.contact_info && formik.errors?.contact_info
                  }
                  fullWidth
                  autoComplete="tel"
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                onClick={handleDelete}
                color="error"
                variant="outlined"
                disabled={formik.isSubmitting}
                sx={{ marginRight: 'auto' }}
              >
                Remove
              </Button>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Dialog>
    </Box>
  );
};

export default UpdateEmergencyContactsDialog;
