import { useNotifications } from '@armhr/ui';
import { useAuth0 } from '@auth0/auth0-react';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { useApi } from '../../hooks/useApi';

const UpdateEmailSchema = Yup.object().shape({
  new_email: Yup.string().email('Invalid email').required('Required'),
  confirm_new_email: Yup.string()
    .oneOf([Yup.ref('new_email'), null], 'Emails must match')
    .required('Required'),
});

const UpdateEmailDialog: React.FC<{
  open?: boolean;
  onClose?: () => void;
  email: string;
}> = ({ open: initialOpen = false, onClose, email }) => {
  const { logout } = useAuth0();
  const [open, setOpen] = useState(initialOpen);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotifications();
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
      new_email: '',
      confirm_new_email: '',
    },
    validationSchema: UpdateEmailSchema,
    onSubmit: async (values, actions) => {
      setError(null);
      if (values.new_email === email) {
        setError('The new email cannot be the same as the current email.');
        actions.setSubmitting(false);
        return;
      }

      try {
        await api.profiles.updateEmail(values.new_email);
        setOpen(false);
        showNotification({
          severity: 'success',
          message: 'Email updated successfully. Please login again.',
        });
        logout({ returnTo: window.location.origin });
      } catch (error) {
        console.error(error);
        setError('Failed to update email. Please try again.');
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <Button color="primary" variant="outlined" onClick={() => setOpen(true)}>
        Update Armhr email
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Change your email</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ pt: 0 }}>
            <Typography variant="body1" sx={{ pb: 2, mb: 1 }}>
              This will update the email used to login to Armhr from {email} to:
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 4 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="new_email"
                label="New email"
                autoFocus
                fullWidth
                autoComplete="email"
                onChange={formik.handleChange}
                value={formik.values.new_email}
                error={Boolean(formik.errors.new_email)}
                helperText={formik.errors.new_email}
              />
              <TextField
                name="confirm_new_email"
                label="Confirm new email"
                fullWidth
                autoComplete="email"
                onChange={formik.handleChange}
                value={formik.values.confirm_new_email}
                error={Boolean(formik.errors.confirm_new_email)}
                helperText={formik.errors.confirm_new_email}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <LoadingButton
              type="submit"
              loading={formik.isSubmitting}
              variant="contained"
            >
              Save
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default UpdateEmailDialog;
