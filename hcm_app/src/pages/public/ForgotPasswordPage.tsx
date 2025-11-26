import { LoadingButton } from '@mui/lab';
import { Box, CardActions, TextField, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet';

import { triggerResetPasswordFlow } from '../../api/unauthenticated.service';
import { paths } from '../../utils/paths';

const title = 'Forgot Password | Armhr';
const keywordDescription =
  'Forgot your password? Enter your email address to securely reset your password and regain access to your account. Quick and easy account recovery.';
const pageUrl = `${import.meta.env.VITE_APP_FRONTEND_BASE_URL}${
  paths.forgotPassword
}`;
const image = `${import.meta.env.VITE_APP_FRONTEND_BASE_URL}/logo.png`;

const ForgotPasswordPage: React.FC = () => {
  const [status, setStatus] = useState('');
  return (
    <Box
      sx={{
        backgroundColor: 'grey.100',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={keywordDescription} />
        <meta name="robots" content="all" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={keywordDescription} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          width: '25%',
          padding: 4,
          borderRadius: 1,
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Armhr Logo"
          width="50%"
          sx={{ mb: 1 }}
        />
        <Typography variant="h2" sx={{ m: 2 }}>
          Forgot your password?
        </Typography>
        {status ? (
          <Typography>{status}</Typography>
        ) : (
          <Box sx={{ width: '100%' }}>
            <Typography
              sx={{
                textAlign: 'center',
                mb: 2,
                mx: 2,
              }}
            >
              Enter your email address and we will send you instructions on how
              to reset your password.
            </Typography>
            <Formik
              initialValues={{ email: '' }}
              onSubmit={async (values) => {
                try {
                  const resp = await triggerResetPasswordFlow(values.email);
                  setStatus(resp.data);
                } catch (err: any) {
                  setStatus(
                    'Sorry, an unexpected error occurred. Please refresh and try again.'
                  );
                }
              }}
            >
              {({ isSubmitting, isValid }) => (
                <Form>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    required
                  />
                  <CardActions sx={{ padding: 0, marginTop: 2 }}>
                    <LoadingButton
                      type="submit"
                      loading={isSubmitting}
                      disabled={!isValid}
                      variant="contained"
                      fullWidth
                    >
                      Submit
                    </LoadingButton>
                  </CardActions>
                </Form>
              )}
            </Formik>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
