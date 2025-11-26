import { Section } from '@armhr/ui';
import { Grid, TextField } from '@mui/material';
import { Field, useFormikContext } from 'formik';

const PhysicalAddress: React.FC = () => {
  const { errors } = useFormikContext<ThrivePassCommuterEnrollmentForm>();

  return (
    <Section title="Physical address" vertical>
      <Grid container item spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <Field
            name="physical_address.address_line_1"
            as={TextField}
            label="Street address"
            fullWidth
            error={!!errors.physical_address?.address_line_1}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name="physical_address.address_line_2"
            as={TextField}
            label="Apartment, suite, unit, etc."
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name="physical_address.city"
            as={TextField}
            label="City"
            fullWidth
            error={errors.physical_address?.city}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Field
            name="physical_address.state"
            as={TextField}
            label="State"
            fullWidth
            error={!!errors.physical_address?.state}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Field
            name="physical_address.zipcode"
            as={TextField}
            label="Zipcode"
            fullWidth
            error={!!errors.physical_address?.zipcode}
          />
        </Grid>
      </Grid>
    </Section>
  );
};

export default PhysicalAddress;
