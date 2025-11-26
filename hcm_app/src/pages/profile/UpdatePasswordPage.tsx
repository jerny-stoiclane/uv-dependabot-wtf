import {
  GlobalNotification,
  PasswordStrengthChecker,
  SecureTextField,
  useNotifications,
  validatePassword,
} from '@armhr/ui';
import { useAuth0 } from '@auth0/auth0-react';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Toolbar,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';

import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import { useApi } from '../../hooks/useApi';
import { paths } from '../../utils/paths';

const UpdatePasswordPage = () => {
  const [error, setError] = useState(null);
  const { user, logout } = useAuth0();
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
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>Update Password | Armhr</title>
        <meta
          name="description"
          content="Update your Armhr account password for enhanced security."
        />
      </Helmet>
      <OnboardingHeader logoLinkTo={paths.updatePassword} />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Toolbar />
        <GlobalNotification sx={{ mb: 0 }} />
        <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
          <Box sx={{ mx: 'auto', py: 3 }}>
            <Typography variant="h4" sx={{ py: 2 }}>
              Update your password
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <Card sx={{ pt: 0 }}>
                <CardContent>
                  <Typography variant="body1" sx={{ pb: 2, mb: 1 }}>
                    This will update your password for{' '}
                    <strong>{user?.email}</strong>. Afterwards, you will be
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
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
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
                    <PasswordStrengthChecker
                      password={formik.values.new_password}
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <LoadingButton
                    type="submit"
                    loading={formik.isSubmitting}
                    disabled={!formik.isValid}
                    variant="contained"
                  >
                    Save
                  </LoadingButton>
                </CardActions>
              </Card>
            </form>
          </Box>
        </Box>
      </Box>
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

export default UpdatePasswordPage;
