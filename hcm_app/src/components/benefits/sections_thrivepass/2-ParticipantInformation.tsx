import { FormikDatePicker, PhoneNumberField, Section } from '@armhr/ui';
import { Grid, TextField } from '@mui/material';
import { Field, useFormikContext } from 'formik';

const ParticipantInformation: React.FC = () => {
  const { errors } = useFormikContext<ThrivePassCommuterEnrollmentForm>();

  return (
    <Section title="Participant information" vertical>
      <Grid container item spacing={3} sm={12}>
        <Grid item xs={12} sm={6}>
          <Field
            name="employee_name"
            as={TextField}
            label="Employee name"
            fullWidth
            error={!!errors.employee_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormikDatePicker
            name="birth_date"
            label="Date of birth"
            sx={{ width: '100%' }}
            error={!!errors.birth_date}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name="phone_number"
            as={PhoneNumberField}
            label="Mobile phone"
            type="tel"
            fullWidth
            error={!!errors.phone_number}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name="email"
            as={TextField}
            label="Email"
            type="email"
            fullWidth
            error={!!errors.email}
          />
        </Grid>
      </Grid>
    </Section>
  );
};

export default ParticipantInformation;
