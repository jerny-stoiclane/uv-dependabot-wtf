import { Section, useNotifications } from '@armhr/ui';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { useCompany } from '../../contexts/company.context';
import { useApi } from '../../hooks/useApi';
import { useUser } from '../../hooks/useUser';
import { paths } from '../../utils/paths';

const initialValues: NewHireRequestForm = {
  first_name: '',
  last_name: '',
  email: '',
};

const NewHireRequestQuickHirePage = () => {
  const api = useApi();
  const { user } = useUser();
  const company = useCompany();
  const { showNotification } = useNotifications();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: NewHireRequestForm) => {
    setSubmitError(null);
    try {
      const res = await api.onboarding.createNewHireRequest({
        ...values,
        email: values.email.trim(),
      });
      if (res.detail) {
        throw new Error('There was a problem saving the new hire');
      }
      navigate(paths.newHires, {
        state: {
          persistNotification: true,
        },
      });
      showNotification({
        message: (
          <>
            Success! An email has been sent to <strong>{values.email}</strong>{' '}
            with instructions to provide additional information to continue the
            onboarding process.
          </>
        ),
        severity: 'success',
      });
    } catch (err: any) {
      const response = err?.response?.data;
      let errorMessage = 'There was a problem saving the new hire request.';

      // Handle Pydantic errors
      if (Array.isArray(response?.detail)) {
        const { msg, loc } = response.detail[0] || {};
        const key = loc?.[1];
        errorMessage = key ? `${key}: ${msg}` : msg || errorMessage;
      } else if (typeof response?.detail === 'string') {
        errorMessage = response.detail;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setSubmitError(errorMessage);

      showNotification({
        message: (
          <>
            There was a problem saving the new hire request. Check that there
            are no current requests for the <strong>{values.email}</strong>, and
            try again.
          </>
        ),
        severity: 'error',
      });

      window?.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Helmet>
        <title>Quick Hire Request | Armhr</title>
        <meta
          name="description"
          content="Submit a quick hire request with basic employee information."
        />
      </Helmet>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <Box sx={{ display: 'flex', justifyContent: 'start', mb: 6 }}>
              <Box>
                <Typography variant="h2" mb={0.5}>
                  Quick hire
                </Typography>
                <Typography variant="body1">
                  Start the new hire process with just a name and email address.
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={() => navigate(paths.newHires)}
                >
                  Back to new hires
                </Button>
              </Box>
            </Box>

            <Section
              title="New hire details"
              colSize={4}
              description={
                <>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    To verify their identity, the new hire is sent the following
                    details to confirm:
                  </Typography>
                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body1">
                      Client ID: <strong>{company.id}</strong>
                    </Typography>
                    <Typography variant="body1">
                      Hiring ID: <strong>{user?.id}</strong>
                    </Typography>
                  </Box>
                </>
              }
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {submitError && (
                  <Alert severity="error" onClose={() => setSubmitError(null)}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      Submission Error
                    </Typography>
                    <Typography variant="body2">{submitError}</Typography>
                  </Alert>
                )}
                <Alert
                  sx={{
                    mb: 2,
                    py: 1.5,
                    lineHeight: '20px',
                    background: 'rgb(229, 246, 253)',
                  }}
                  severity="info"
                >
                  An e-mail will be sent to the new hire with instructions to
                  begin the onboarding process and create their account. Once
                  they provide their personal information, you will be able to
                  continue the onboarding process.
                </Alert>
                <Stack direction="row" spacing={2}>
                  <Field
                    name="first_name"
                    label="Legal first name"
                    fullWidth
                    required
                    value={values.first_name}
                    onChange={handleChange}
                    component={TextField}
                  />
                  <Field
                    name="last_name"
                    label="Legal last name"
                    fullWidth
                    required
                    value={values.last_name}
                    onChange={handleChange}
                    component={TextField}
                  />
                </Stack>
                <Field
                  name="email"
                  label={
                    user?.is_work_email_enabled
                      ? 'Work email address'
                      : 'Email address'
                  }
                  fullWidth
                  required
                  value={values.email}
                  onChange={handleChange}
                  component={TextField}
                />
                <Stack sx={{ ml: 'auto' }} direction="row" spacing={2}>
                  <LoadingButton
                    color="primary"
                    size="large"
                    type="submit"
                    loading={isSubmitting}
                    variant="contained"
                  >
                    Send email
                  </LoadingButton>
                </Stack>
              </Box>
            </Section>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default NewHireRequestQuickHirePage;
