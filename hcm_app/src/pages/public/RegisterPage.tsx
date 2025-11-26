import {
  Dropdown,
  Logo,
  PasswordStrengthChecker,
  SecureIdentifierField,
  SecureTextField,
} from '@armhr/ui';
import { useAuth0 } from '@auth0/auth0-react';
import { Info } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  Divider,
  InputAdornment,
  Link,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';

import { paths } from '../../utils/paths';
import { passwordValidationSchema } from '../../utils/schemas/passwordValidationSchemas';

const validationSchema = Yup.object().shape({
  last_name: Yup.string().required('Required'),
  identifier_type: Yup.string().required('Required'),
  work_email: Yup.string().email('Invalid email').required('Required'),
  identifier: Yup.string()
    .required('Required')
    .matches(/^[\d-]+$/, 'This field must consist of only numbers'),
  ...passwordValidationSchema.fields,
});

const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();
  const [error, setError] = useState<string | null>(null);

  const employeeId = searchParams.get('employee');
  const clientId = searchParams.get('client');
  const email = searchParams.get('email');

  if (!clientId) {
    navigate(paths.login);
    return null;
  }

  const handleSubmit = async (values: RegisterFormValues) => {
    const baseUrl = import.meta.env.VITE_APP_BACKEND_BASE_URL;
    try {
      await axios.post(`${baseUrl}/public/register`, {
        app_metadata: {},
        user_metadata: {},
        email: values.work_email,
        family_name: values.last_name,
        password: values.password,
        ssn: values.identifier,
        client_id: clientId,
        employee_id: employeeId,
      });

      loginWithRedirect({ login_hint: values.work_email });
    } catch (error: any) {
      if (error?.response.status === 422 || error?.response.status === 400) {
        setError(
          error?.response.data?.detail ||
            'There was a problem verifying your information. Check your personal details and try again.'
        );
      } else if (error?.response.status === 409) {
        setError(
          'An account with this email already exists. Please login or reset your password.'
        );
      } else {
        setError('Sorry, something went wrong. Please try again.');
      }
    }
  };

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
        <title>Register | Armhr</title>
        <meta
          name="description"
          content="Register for your Armhr account to access payroll, benefits, and HR management tools."
        />
      </Helmet>
      <Formik
        initialValues={
          {
            last_name: '',
            identifier_type: 'SSN',
            identifier: '',
            work_email: email || '',
            password: '',
            confirm_password: '',
          } as RegisterFormValues
        }
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          setFieldValue,
          handleChange,
          isSubmitting,
          errors,
          touched,
        }) => (
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              minHeight: '100vh',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 8,
            }}
          >
            <Box
              sx={{
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Logo width={150} height={80} />
            </Box>
            <Card sx={{ width: '100%', p: 3, maxWidth: 420, zIndex: 1 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" mb={0.5}>
                  New user registration
                </Typography>
                <Typography variant="body2" color="grey.500">
                  Please enter your information below
                </Typography>
              </Box>
              <Form noValidate>
                {error && (
                  <Alert sx={{ py: 1, mb: 3 }} severity="error">
                    <AlertTitle color="error" sx={{ fontWeight: 'bold' }}>
                      Registration failed
                    </AlertTitle>
                    <Typography>{error}</Typography>
                  </Alert>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Field
                    as={TextField}
                    name="last_name"
                    label="Last name"
                    error={touched.last_name && !!errors.last_name}
                    value={values.last_name}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="last_name" />}
                    fullWidth
                    required
                  />
                  <Box sx={{ display: 'flex', gap: 2, mb: 0.5 }}>
                    <Dropdown
                      label="Identifier type"
                      name="identifier_type"
                      options={['SSN', 'EIN'].map((option) => ({
                        label: option,
                        value: option,
                      }))}
                      value={values.identifier_type}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue('identifier', '');
                      }}
                      required
                      sx={{ minWidth: 115 }}
                    />
                    <Field
                      as={SecureIdentifierField}
                      name="identifier"
                      label="Identifier"
                      onChange={handleChange}
                      value={values.identifier}
                      identifierType={values.identifier_type}
                      style={{ flexGrow: 1 }}
                      required
                    />
                  </Box>
                  <Field
                    as={TextField}
                    name="work_email"
                    label="Login email"
                    value={values.work_email}
                    onChange={handleChange}
                    error={touched.work_email && !!errors.work_email}
                    helperText={<ErrorMessage name="work_email" />}
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: email ? (
                        <InputAdornment position="end">
                          <Tooltip
                            title="If this is incorrect, please contact your HR department."
                            placement="right"
                            arrow={true}
                          >
                            <Info color="disabled" />
                          </Tooltip>
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Field
                      as={SecureTextField}
                      name="password"
                      label="Password"
                      error={touched.password && !!errors.password}
                      helperText={<ErrorMessage name="password" />}
                      onChange={handleChange}
                      value={values.password}
                      fullWidth
                      required
                    />
                    {errors.password && (
                      <PasswordStrengthChecker password={values.password} />
                    )}
                  </Box>
                  <Field
                    as={SecureTextField}
                    name="confirm_password"
                    label="Confirm password"
                    error={
                      touched.confirm_password && !!errors.confirm_password
                    }
                    helperText={<ErrorMessage name="confirm_password" />}
                    fullWidth
                    required
                  />
                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    loading={isSubmitting}
                    variant="contained"
                  >
                    Register
                  </LoadingButton>
                </Box>
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
                    Already have an account?
                  </Typography>
                  <Typography variant="body2">
                    <Link href="/login">Login</Link>
                  </Typography>
                </Box>
              </Form>
            </Card>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default RegisterPage;
