import {
  Dropdown,
  Logo,
  PhoneNumberField,
  SecureIdentifierField,
} from '@armhr/ui';
import { useAuth0 } from '@auth0/auth0-react';
import { Help } from '@mui/icons-material';
// Adjust import path as needed
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  InputAdornment,
  Link,
  Slide,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import axios from 'axios';
import { formatISO, isValid, parseISO } from 'date-fns';
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import Cookie from 'js-cookie';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';

import SuccessAnimation from '../../components/onboarding/SuccessAnimation';
import CreatePasswordFields from '../../components/public/CreatePasswordFields';
import useCookieFlag from '../../hooks/useCookieFlag';
import { QUICKHIRE_COOKIE } from '../../utils/constants';
import { passwordValidationSchema } from '../../utils/schemas/passwordValidationSchemas';

const baseUrl = import.meta.env.VITE_APP_BACKEND_BASE_URL;

interface OnboardingToken {
  client: string;
  id: string;
  personal_email?: string;
  work_email?: string;
  use_work_email_for_login: boolean;
}

interface ClientVerificationStepValues {
  client_id: string;
  intake_employee_id: string;
}

interface EmployeeInfoStepValues extends ClientVerificationStepValues {
  work_email: string;
  personal_email: string;
  home_phone: string;
  ssn: string;
  birth_date: string;
  gender: string | null;
  preferred_name: string;
}

interface LoginStepValues extends EmployeeInfoStepValues {
  password: string;
  confirm_password: string;
  login_email: string;
}

const decodeToken = (token: string): OnboardingToken | null => {
  try {
    const decoded = atob(token);
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Failed to decode onboarding token:', e);
    return null;
  }
};

const StartPage = () => {
  useCookieFlag(QUICKHIRE_COOKIE, true);
  const { loginWithRedirect } = useAuth0();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const decodedToken = token ? decodeToken(token) : null;
  const emailInputRef = useRef<HTMLInputElement>(null);
  const formikRef = useRef<FormikProps<LoginStepValues>>(null);
  const [hasAttemptedAutoSubmit, setHasAttemptedAutoSubmit] = useState(false);
  const shouldCreateAuth0Account = Cookie.get(QUICKHIRE_COOKIE) === 'true';
  const useWorkEmailForLogin = !!decodedToken?.use_work_email_for_login;
  const defaultLoginEmail = useWorkEmailForLogin
    ? decodedToken?.work_email
    : decodedToken?.personal_email;

  const autoSubmitFirstStep = async () => {
    if (
      !decodedToken?.client ||
      !decodedToken?.id ||
      !formikRef.current ||
      hasAttemptedAutoSubmit
    ) {
      return;
    }

    setHasAttemptedAutoSubmit(true);

    try {
      const response = await axios.post(
        `${baseUrl}/public/prehire/new_hire_requests/verify_client`,
        {
          client_id: decodedToken.client,
          intake_employee_id: decodedToken.id,
        }
      );

      if (response.data.success) {
        setStep(2);
        setError(null);
      } else {
        throw new Error();
      }
    } catch (error) {
      setError('Unable to verify client, please try again.');
    }
  };

  useEffect(() => {
    // Auto-submit first step if token exists and is valid
    autoSubmitFirstStep();
  }, [formikRef.current]); // Re-run when formikRef is available

  useEffect(() => {
    // Focus email input when reaching step 2
    if (step === 2 && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [step]);

  const handleFirstStepSubmit = async (
    values: ClientVerificationStepValues
  ) => {
    try {
      const response = await axios.post(
        `${baseUrl}/public/prehire/new_hire_requests/verify_client`,
        {
          client_id: values.client_id,
          intake_employee_id: values.intake_employee_id,
        }
      );

      if (response.data.success) {
        setStep(2);
        setError(null);
      } else {
        throw new Error();
      }
    } catch (error) {
      setError('Unable to verify client, please try again.');
    }
  };

  const handleSecondStepSubmit = async (values: EmployeeInfoStepValues) => {
    try {
      const response = await axios.put(
        `${baseUrl}/public/prehire/new_hire_requests`,
        {
          client_id: values.client_id,
          intake_employee_id: values.intake_employee_id,
          personal_email: values.personal_email,
          work_email: values.work_email,
          home_phone: values.home_phone,
          ssn: values.ssn,
          birth_date: values.birth_date,
          gender: values.gender,
          preferred_name: values.preferred_name,
        },
        {
          withCredentials: true, // Enable sending cookies
        }
      );
      if (response.data.success) {
        setIsSuccess(true);
        setError(null);
        shouldCreateAuth0Account ? setStep(3) : setStep(4);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setError('Unable to verify. Please validate your IDs and email.');
      } else if (error?.response?.status === 422) {
        loginWithRedirect({
          login_hint: defaultLoginEmail || values.personal_email,
        });
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleLoginSubmit = async (values: LoginStepValues) => {
    try {
      const response = await axios.post(
        `${baseUrl}/public/prehire/create_auth0_user`,
        {
          client_id: values.client_id,
          intake_employee_id: values.intake_employee_id,
          login_email: values.login_email,
          password: values.password,
          ssn: values.ssn,
        },
        {
          withCredentials: true, // Enable sending cookies
        }
      );
      if (response.data.success) {
        setIsSuccess(true);
        setError(null);
        setStep(4);
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        loginWithRedirect({
          login_hint: values.login_email,
        });
      } else {
        setError('Sorry, something went wrong. Please try again.');
      }
    }
  };

  const validationSchema =
    step === 1
      ? firstStepValidationSchema
      : step === 2
      ? secondStepValidationSchema
      : loginStepValidationSchema;

  const handleSubmitMap: Record<
    number,
    (values: LoginStepValues) => void | Promise<void>
  > = {
    1: handleFirstStepSubmit,
    2: handleSecondStepSubmit,
    3: shouldCreateAuth0Account ? handleLoginSubmit : () => undefined,
    4: () => undefined,
  };

  const handleSubmit = handleSubmitMap[step] || (() => undefined);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        backgroundImage:
          'url(https://armhr.com/assets/background1-61395f10.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        overflow: 'visible',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Helmet>
        <title>New Hire Start | Armhr</title>
        <meta
          name="description"
          content="Start your new hire process with Armhr. Complete your onboarding information to get started."
        />
      </Helmet>
      <Formik<LoginStepValues>
        innerRef={formikRef}
        initialValues={{
          login_email: defaultLoginEmail || '',
          personal_email: decodedToken?.personal_email || '',
          client_id: decodedToken?.client || '',
          intake_employee_id: decodedToken?.id || '',
          work_email: decodedToken?.work_email || '',
          home_phone: '',
          ssn: '',
          birth_date: '',
          gender: null,
          preferred_name: '',
          password: '',
          confirm_password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          setFieldValue,
          handleChange,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <Form noValidate>
            <Box
              sx={{
                display: 'flex',
                height: '100%',
                minHeight: '100vh',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'start',
                pt: 12,
              }}
            >
              <Logo width={120} height={80} />

              <Card
                sx={{ width: '100%', p: 3, mt: 1, maxWidth: 450, zIndex: 1 }}
              >
                {error && (
                  <Alert sx={{ mb: 3 }} severity="error">
                    {error}
                  </Alert>
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
                      <Typography variant="h4" mb={0.5} textAlign="center">
                        Join your workplace
                      </Typography>
                      <Typography
                        variant="body1"
                        textAlign="center"
                        mt={1}
                        mb={4}
                      >
                        First, verify your identity by entering <br /> your
                        client and hiring ID from your onboarding email.
                      </Typography>
                      <Stack spacing={2}>
                        <Field
                          as={TextField}
                          name="client_id"
                          label="Client ID"
                          fullWidth
                          required
                        />
                        <Field
                          as={TextField}
                          name="intake_employee_id"
                          label="Hiring ID"
                          fullWidth
                          required
                        />
                      </Stack>

                      <Stack direction="row" spacing={2} sx={{ pt: 4 }}>
                        <LoadingButton
                          fullWidth
                          size="large"
                          type="submit"
                          loading={isSubmitting}
                          variant="contained"
                        >
                          Next
                        </LoadingButton>
                      </Stack>
                      <Divider light sx={{ py: 0.5 }} />
                      <Box
                        sx={{
                          mt: 2,
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          Don't know your Client ID or Hiring ID?
                        </Typography>
                        <Typography variant="body2">
                          <Link href="mailto:hr@armhr.com">Contact us</Link>
                        </Typography>
                      </Box>
                    </Box>
                  </Slide>
                )}

                {step === 2 && (
                  <Slide
                    direction="right"
                    in={step === 2}
                    mountOnEnter
                    unmountOnExit
                    timeout={{
                      enter: 400,
                      exit: 400,
                    }}
                  >
                    <Box>
                      <Typography variant="h4" mb={0.5} textAlign="center">
                        Enter your information
                      </Typography>
                      <Stack spacing={2}>
                        <Typography
                          variant="body1"
                          textAlign="center"
                          mt={1}
                          mb={4}
                        >
                          Please enter your information below to continue the
                          onboarding process.
                        </Typography>
                        <Field
                          as={TextField}
                          name="personal_email"
                          label="Personal email address"
                          value={values.personal_email}
                          onChange={(e) => {
                            if (!useWorkEmailForLogin) {
                              setFieldValue('login_email', e.target.value);
                            }
                            handleChange(e);
                          }}
                          error={
                            touched.personal_email && !!errors.personal_email
                          }
                          helperText={<ErrorMessage name="personal_email" />}
                          fullWidth
                          required
                          inputRef={emailInputRef}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip
                                  title="This should be the email address where you received your onboarding email."
                                  placement="right"
                                  arrow={true}
                                >
                                  <Help />
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Field
                          as={TextField}
                          name="work_email"
                          label="Work email address"
                          value={values.work_email}
                          onChange={(e) => {
                            if (useWorkEmailForLogin) {
                              setFieldValue('login_email', e.target.value);
                            }
                            handleChange(e);
                          }}
                          fullWidth
                        />
                        <Field
                          as={PhoneNumberField}
                          name="home_phone"
                          label="Phone number"
                          value={values.home_phone}
                          onChange={handleChange}
                          error={touched.home_phone && !!errors.home_phone}
                          helperText={<ErrorMessage name="home_phone" />}
                          fullWidth
                        />
                        <Field
                          as={SecureIdentifierField}
                          name="ssn"
                          label="SSN"
                          onChange={handleChange}
                          value={values.ssn}
                          identifierType="SSN"
                          style={{ flexGrow: 1 }}
                          error={touched.ssn && !!errors.ssn}
                          required
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Date of birth *"
                            sx={{
                              '& .MuiInputAdornment-root': {
                                marginRight: 0.5,
                              },
                            }}
                            value={
                              values.birth_date
                                ? parseISO(values.birth_date)
                                : null
                            }
                            onChange={(date) => {
                              if (date && isValid(date)) {
                                const isoString = formatISO(date, {
                                  representation: 'date',
                                });
                                setFieldValue('birth_date', isoString);
                              } else {
                                setFieldValue('birth_date', '');
                              }
                            }}
                          />
                        </LocalizationProvider>
                        <Dropdown
                          name="gender"
                          label="Legal gender *"
                          value={values.gender}
                          onChange={handleChange}
                          options={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                          ]}
                        />
                        <Field
                          as={TextField}
                          name="preferred_name"
                          label="Preferred name"
                          value={values.preferred_name}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Stack>
                      <Stack direction="row" spacing={2} sx={{ pt: 4 }}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          fullWidth
                          size="large"
                          onClick={() => setStep(1)}
                          tabIndex={0}
                          aria-label="Go back to previous step"
                          sx={{
                            '&.Mui-focusVisible': {
                              outline: '2px solid #1976d2',
                              outlineOffset: 2,
                            },
                          }}
                        >
                          Back
                        </Button>
                        <LoadingButton
                          fullWidth
                          size="large"
                          type="submit"
                          loading={isSubmitting}
                          variant="contained"
                          tabIndex={0}
                          aria-label="Save and continue"
                          sx={{
                            '&.Mui-focusVisible': {
                              outline: '2px solid #1976d2',
                              outlineOffset: 2,
                            },
                          }}
                        >
                          Save
                        </LoadingButton>
                      </Stack>
                    </Box>
                  </Slide>
                )}
                {step === 3 && shouldCreateAuth0Account && (
                  <Slide
                    direction="right"
                    in={step === 3}
                    mountOnEnter
                    unmountOnExit
                    timeout={{
                      enter: 400,
                      exit: 400,
                    }}
                  >
                    <Box>
                      <Typography variant="h4" mb={0.5} textAlign="center">
                        Create your account
                      </Typography>
                      <Typography
                        variant="body1"
                        textAlign="center"
                        mt={1}
                        mb={4}
                      >
                        Choose an email and enter a password to log in with.
                      </Typography>
                      <Stack spacing={2}>
                        <Field
                          as={TextField}
                          name="login_email"
                          label="Login email address*"
                          value={values.login_email}
                          onChange={handleChange}
                          error={!!errors.login_email}
                          helperText={<ErrorMessage name="login_email" />}
                          fullWidth
                        />
                        <CreatePasswordFields<LoginStepValues> />
                        <LoadingButton
                          fullWidth
                          size="large"
                          type="submit"
                          loading={isSubmitting}
                          variant="contained"
                          tabIndex={0}
                          aria-label="Save and continue"
                          sx={{
                            '&.Mui-focusVisible': {
                              outline: '2px solid #1976d2',
                              outlineOffset: 2,
                            },
                          }}
                        >
                          Save
                        </LoadingButton>
                      </Stack>
                    </Box>
                  </Slide>
                )}

                {step === 4 && isSuccess && (
                  <Slide
                    direction="up"
                    in={step === 4}
                    mountOnEnter
                    unmountOnExit
                    timeout={{
                      enter: 400,
                      exit: 400,
                    }}
                  >
                    <Box mb={2}>
                      <SuccessAnimation text="Success!" />
                      <Typography variant="h5" textAlign="center" mt={1} mb={3}>
                        Your information has been submitted.
                      </Typography>
                      <Typography
                        variant="body1"
                        textAlign="center"
                        mt={1}
                        mb={3}
                      >
                        After review, your hiring contact will send you an email
                        with a link to complete the onboarding process.
                      </Typography>
                      <Typography variant="body2" textAlign="center" mt={2}>
                        Any questions or problems?{' '}
                        <Link href="mailto:hr@armhr.com">Contact us</Link>
                      </Typography>
                    </Box>
                  </Slide>
                )}
              </Card>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

const firstStepValidationSchema = Yup.object().shape({
  client_id: Yup.string().required('Client ID is required'),
  intake_employee_id: Yup.string().required('Intake ID is required'),
});

const secondStepValidationSchema = Yup.object().shape({
  personal_email: Yup.string().email('Invalid email').required('Required'),
  work_email: Yup.string().email('Invalid email').nullable(),
  home_phone: Yup.string()
    .nullable()
    .transform((value) => (value?.trim() === '' ? null : value))
    .matches(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      'Phone number must be in format (###) ###-####'
    )
    .notRequired(),
  ssn: Yup.string()
    .required('Required')
    .matches(/^[\d-]+$/, 'This field must consist of only numbers'),
  birth_date: Yup.string().required('Required'),
  gender: Yup.string().required('Required'),
  preferred_name: Yup.string().notRequired(),
});

const loginStepValidationSchema = Yup.object().shape({
  login_email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  ...passwordValidationSchema.fields,
});

export default StartPage;
