import { FormikDatePicker } from '@armhr/ui';
import { Divider, Grid, TextField } from '@mui/material';
import { Field, useFormikContext } from 'formik';

const SignatureSection: React.FC = () => {
  const { errors } = useFormikContext<ThrivePassCommuterEnrollmentForm>();

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12} sm={9}>
        <Field
          name="signature"
          label="Employee signature"
          fullWidth
          as={TextField}
          error={!!errors.signature}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormikDatePicker
          name="date_signed"
          label="Date signed"
          sx={{ width: '100%' }}
          error={!!errors.date_signed}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
};

export default SignatureSection;
