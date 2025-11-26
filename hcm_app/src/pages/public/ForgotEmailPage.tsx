import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  CardActions,
  Slide,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { triggerForgotEmailFlow } from '../../api/unauthenticated.service';
import { paths } from '../../utils/paths';

const ForgotEmailPage: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const navigate = useNavigate();

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
        <title>Forgot Email | Armhr</title>
        <meta
          name="description"
          content="Forgot your email? Enter your email address to receive instructions on how to retrieve your login details."
        />
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
          overflow: 'hidden',
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
          Forgot your email?
        </Typography>
        <Box width="100%">
          <Formik
            initialValues={{ email: '' }}
            onSubmit={async (values: { email: string }) => {
              try {
                await triggerForgotEmailFlow(values.email);
              } finally {
                setStep(1);
              }
            }}
          >
            {({ isSubmitting, isValid, values }) => (
              <Form>
                {step === 0 && (
                  <Box>
                    <Typography
                      sx={{
                        textAlign: 'center',
                        mx: 2,
                        mb: 2,
                      }}
                    >
                      Enter the email address you believe is connected with your
                      Armhr account below.
                    </Typography>
                    <Field
                      as={TextField}
                      name="email"
                      type="email"
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
                  </Box>
                )}
                {step === 1 && (
                  <Slide
                    direction="left"
                    in={step === 1}
                    mountOnEnter
                    unmountOnExit
                    timeout={{
                      enter: 400,
                      exit: 400,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          textAlign: 'center',
                          mx: 2,
                          mb: 2,
                        }}
                      >
                        Instructions have been sent to{' '}
                        <strong>{values.email}</strong>. If this email is
                        associated with an Armhr account, you'll receive login
                        details shortly.
                      </Typography>
                      <CardActions
                        sx={{
                          padding: 0,
                          marginTop: 2,
                          justifyContent: 'center',
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => navigate(paths.login)}
                        >
                          Go to Login
                        </Button>
                      </CardActions>
                    </Box>
                  </Slide>
                )}
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotEmailPage;
