import { useNotifications } from '@armhr/ui';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

const AddEmergencyContactDialog: React.FC<{
  open?: boolean;
  onClose?: () => void;
  emergencyContacts?: FormikEmergencyContact[];
  personChecksum: string;
  refreshProfile: () => void;
}> = ({
  open: initialOpen = false,
  onClose,
  emergencyContacts,
  personChecksum,
  refreshProfile,
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

  const formik = useFormik({
    initialValues: {
      contact_name: '',
      contact_info: '',
      contact_relationship: '',
      contact_type: '',
    },
    validationSchema: EmergencyContactSchema,
    onSubmit: async (values, actions) => {
      setError(null);
      try {
        const allEmergencyContacts = [...(emergencyContacts || []), values];
        const updatePayload: UpdateEmergencyContactsPayload = {
          person_checksum: personChecksum,
          emergency_contact: allEmergencyContacts,
        };
        await api.profiles.updateEmergencyContacts(updatePayload);
        setOpen(false);
        refresh();
        refreshProfile();
        showNotification({
          message: 'Emergency contact added successfully.',
          severity: 'success',
        });
      } catch (error) {
        console.error(error);
        setError('Failed to add new emergency contact.');
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <Button
        color="primary"
        variant="outlined"
        size="small"
        onClick={() => {
          setOpen(true);
          formik.resetForm();
        }}
      >
        Add Emergency Contact
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Add Emergency Contact</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            {error && (
              <Alert sx={{ mb: 2 }}>
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
                name="contact_name"
                label="Contact Name"
                value={formik.values.contact_name}
                onChange={formik.handleChange}
                error={
                  !!formik.errors.contact_name && formik.touched.contact_name
                }
                helperText={
                  formik.touched.contact_name && formik.errors.contact_name
                }
                fullWidth
              />
              <TextField
                name="contact_relationship"
                label="Contact Relationship"
                value={formik.values.contact_relationship}
                onChange={formik.handleChange}
                error={
                  !!formik.errors.contact_relationship &&
                  formik.touched.contact_relationship
                }
                helperText={
                  formik.touched.contact_relationship &&
                  formik.errors.contact_relationship
                }
                fullWidth
              />
              <TextField
                name="contact_type"
                label="Contact Type"
                value={formik.values.contact_type}
                onChange={formik.handleChange}
                error={
                  !!formik.errors.contact_type && formik.touched.contact_type
                }
                helperText={
                  formik.touched.contact_type && formik.errors.contact_type
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
                name="contact_info"
                label="Contact Info"
                value={formik.values.contact_info}
                onChange={formik.handleChange}
                error={
                  !!formik.errors.contact_info && formik.touched.contact_info
                }
                helperText={
                  formik.touched.contact_info && formik.errors.contact_info
                }
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="secondary"
              variant="outlined"
              sx={{ marginRight: 'auto' }}
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
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default AddEmergencyContactDialog;
