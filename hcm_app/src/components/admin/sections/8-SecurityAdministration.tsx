import { PhoneNumberField, Section } from '@armhr/ui';
import { Grid, TextField, Typography } from '@mui/material';
import { Field, useFormikContext } from 'formik';
import React from 'react';

import { FormValues } from '../userAccessFormValues';

const SecurityAdministration: React.FC = () => {
  const { errors, touched } = useFormikContext<FormValues>();
  return (
    <Section title="Security administration" vertical>
      <Typography
        variant="body1"
        sx={{ p: 2, bgcolor: 'grey.100', marginBottom: 2, borderRadius: '4px' }}
      >
        By submitting this form, I attest that I am an authorized representative
        of the client and am aware of the sensitivity of the data for which I am
        providing the above-mentioned person access.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Field
            name="authorized_by"
            as={TextField}
            label="Authorized by"
            fullWidth
            error={touched.authorized_by && !!errors.authorized_by}
            helperText={touched.authorized_by && errors.authorized_by}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            name="authorized_phone"
            as={PhoneNumberField}
            label="Phone number"
            type="tel"
            fullWidth
            error={touched.authorized_phone && !!errors.authorized_phone}
            helperText={touched.authorized_phone && errors.authorized_phone}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            name="authorized_email"
            as={TextField}
            label="Email address"
            type="email"
            fullWidth
            error={touched.authorized_email && !!errors.authorized_email}
            helperText={touched.authorized_email && errors.authorized_email}
          />
        </Grid>
      </Grid>
    </Section>
  );
};

export default SecurityAdministration;
