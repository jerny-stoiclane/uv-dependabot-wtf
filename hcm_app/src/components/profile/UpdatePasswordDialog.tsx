import {
  PasswordStrengthChecker,
  SecureTextField,
  validatePassword,
} from '@armhr/ui';
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
  Divider,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import { useApi } from '../../hooks/useApi';
import { useUser } from '../../hooks/useUser';

const UpdatePasswordDialog = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth0();
  const { showNotification } = useNotifications();
  const api = useApi();

  const formik = useFormik({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
    validationSchema: UpdatePasswordSchema,
    onSubmit: async (values, actions) => {
      setError(null);

      const { old_password, new_password } = values;

      try {
        await api.profiles.updatePassword(old_password, new_password);
        showNotification({
          severity: 'success',
          message: 'Password updated successfully. Please login again.',
        });
        logout({ returnTo: window.location.origin });
        setOpen(false);
      } catch (error: any) {
        setError(
          error.response.data?.detail ||
            'Sorry something went wrong, please try again'
        );
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  return (
    <Box>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Update password
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Update your password</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ pt: 0 }}>
            <Typography variant="body1" sx={{ pb: 2, mb: 1 }}>
              This will update your password for{' '}
              <strong>{user?.login_email}</strong>. Afterwards, you will be
              asked to login to Armhr again.
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 4 }}>
                <AlertTitle color="error" sx={{ fontWeight: 'bold' }}>
                  Failed to update password
                </AlertTitle>
                {error}
              </Alert>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <SecureTextField
                name="old_password"
                label="Current password"
                fullWidth
                autoFocus
                onChange={formik.handleChange}
                value={formik.values.old_password}
                error={Boolean(formik.errors.old_password)}
                autoComplete="current-password"
                helperText={formik.errors.old_password}
              />
              <Divider sx={{ my: 1 }} />
              <SecureTextField
                name="new_password"
                label="New password"
                fullWidth
                autoComplete="new-password"
                onChange={formik.handleChange}
                value={formik.values.new_password}
                error={Boolean(formik.errors.new_password)}
                helperText={formik.errors.new_password}
              />
              <SecureTextField
                name="confirm_password"
                label="Confirm new password"
                fullWidth
                autoComplete="new-password"
                onChange={formik.handleChange}
                value={formik.values.confirm_password}
                error={Boolean(formik.errors.confirm_password)}
                helperText={formik.errors.confirm_password}
              />
              <PasswordStrengthChecker password={formik.values.new_password} />
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
    </Box>
  );
};

const UpdatePasswordSchema = Yup.object().shape({
  old_password: Yup.string().required('Required'),
  new_password: Yup.string()
    .required('Required')
    .test(
      'password-strength',
      'Password does not meet requirements',
      (value) => {
        const { valid } = validatePassword(value);
        return valid;
      }
    ),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
    .required('Required'),
});

export default UpdatePasswordDialog;
