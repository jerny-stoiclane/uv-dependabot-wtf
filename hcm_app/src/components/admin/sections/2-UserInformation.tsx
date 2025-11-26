import { FormikDatePicker, PhoneNumberField, Section } from '@armhr/ui';
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Field, useFormikContext } from 'formik';
import React from 'react';

import { FormValues } from '../userAccessFormValues';

const UserInformation: React.FC = () => {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<FormValues>();

  const handleAccessTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFieldValue('access_type', event.target.value);
    setFieldValue('date_of_birth', '');
    setFieldValue('zip_code', '');
  };

  return (
    <Section title="User information" vertical>
      <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
        <RadioGroup
          name="access_type"
          value={values.access_type}
          onChange={handleAccessTypeChange}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                value="Manager Access"
                control={<Radio />}
                label="Manager Access (On Client Payroll)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                value="Trusted Advisor"
                control={<Radio />}
                sx={{ width: '100%' }}
                label="Trusted Advisor / Outside Consultant / Broker"
              />
            </Grid>
          </Grid>
        </RadioGroup>
      </FormControl>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Field
            name="first_name"
            as={TextField}
            label="First name"
            fullWidth
            error={touched.first_name && !!errors.first_name}
            helperText={touched.first_name && errors.first_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name="last_name"
            as={TextField}
            label="Last name"
            fullWidth
            error={touched.last_name && !!errors.last_name}
            helperText={touched.last_name && errors.last_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name="mobile_phone"
            as={PhoneNumberField}
            label="Mobile phone"
            type="tel"
            fullWidth
            error={touched.mobile_phone && !!errors.mobile_phone}
            helperText={touched.mobile_phone && errors.mobile_phone}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name="email"
            as={TextField}
            label="Email"
            type="email"
            fullWidth
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
          />
        </Grid>
      </Grid>
      {values.access_type === 'Trusted Advisor' && (
        <Box>
          <Typography mt={2} variant="body2" color="textSecondary">
            This information is required for password reset
          </Typography>
          <Grid container mt={0} spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormikDatePicker
                name="date_of_birth"
                label="Date of Birth"
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                name="zip_code"
                as={TextField}
                label="Zip Code"
                fullWidth
                error={touched.zip_code && !!errors.zip_code}
                helperText={touched.zip_code && errors.zip_code}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Section>
  );
};

export default UserInformation;
