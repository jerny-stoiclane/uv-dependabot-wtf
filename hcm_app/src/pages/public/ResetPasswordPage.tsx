import { LoadingButton } from '@mui/lab';
import { Box, CardActions, TextField } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet';

import { triggerResetPasswordFlow } from '../../api/unauthenticated.service';
import { paths } from '../../utils/paths';

const title = 'Reset Password | Armhr';
const keywordDescription =
  'Enter your email address to securely reset your password and regain access to your account. Quick and easy account recovery.';
const pageUrl = `${import.meta.env.VITE_APP_FRONTEND_BASE_URL}${
  paths.forgotPassword
}`;
const image = `${import.meta.env.VITE_APP_FRONTEND_BASE_URL}/logo.png`;

const ResetPasswordPage: React.FC = () => {
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
          padding: '2rem',
          borderRadius: '5px',
        }}
      >
        <img src="/logo.png" alt="Armhr Logo" width="50%"></img>
        <h1>Reset your password</h1>
        {status ? (
          <p>{status}</p>
        ) : (
          <Box sx={{ width: 'full' }}>
            <p
              style={{
                textAlign: 'center',
                marginTop: '0px',
                marginLeft: '1rem',
                marginRight: '1rem',
              }}
            >
              Your password has expired. Enter your email address to reset your
              password.
            </p>
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
                  ></Field>
                  <CardActions sx={{ padding: '0px', marginTop: '1rem' }}>
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

export default ResetPasswordPage;
