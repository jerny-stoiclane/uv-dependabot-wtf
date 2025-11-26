import { Section } from '@armhr/ui';
import { Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import React from 'react';

import { FormValues } from '../userAccessFormValues';

const SecurityAccess: React.FC = () => {
  const { setFieldValue, values, errors, touched } =
    useFormikContext<FormValues>();

  return (
    <Section title="Security access" vertical={true}>
      <FormControlLabel
        control={
          <Checkbox
            checked={values.pay_rate_access}
            onChange={(event) =>
              setFieldValue('pay_rate_access', event.target.checked)
            }
          />
        }
        label="Grant Pay Rate Access"
        sx={{ mb: 1 }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="divisions"
            label="Divisions"
            value={values.divisions[0]?.value || ''}
            onChange={(e) =>
              setFieldValue('divisions', [
                {
                  id: values.divisions[0]?.id ?? `custom_${Date.now()}`,
                  value: e.target.value,
                },
              ])
            }
            error={touched.divisions && Boolean(errors.divisions)}
            helperText={touched.divisions && String(errors.divisions)}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="departments"
            label="Departments"
            value={values.departments[0]?.value || ''}
            onChange={(e) =>
              setFieldValue('departments', [
                {
                  id: values.departments[0]?.id ?? `custom_${Date.now()}`,
                  value: e.target.value,
                },
              ])
            }
            error={touched.departments && Boolean(errors.departments)}
            helperText={touched.departments && String(errors.departments)}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="shifts"
            label="Shifts"
            value={values.shifts[0]?.value || ''}
            onChange={(e) =>
              setFieldValue('shifts', [
                {
                  id: values.shifts[0]?.id ?? `custom_${Date.now()}`,
                  value: e.target.value,
                },
              ])
            }
            error={touched.shifts && Boolean(errors.shifts)}
            helperText={touched.shifts && String(errors.shifts)}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="work_groups"
            label="Work Groups"
            value={values.work_groups[0]?.value || ''}
            onChange={(e) =>
              setFieldValue('work_groups', [
                {
                  id: values.work_groups[0]?.id ?? `custom_${Date.now()}`,
                  value: e.target.value,
                },
              ])
            }
            error={touched.work_groups && Boolean(errors.work_groups)}
            helperText={touched.work_groups && String(errors.work_groups)}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Section>
  );
};

export default SecurityAccess;
