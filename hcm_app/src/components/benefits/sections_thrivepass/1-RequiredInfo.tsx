import { FormikDatePicker, Section } from '@armhr/ui';
import { Info } from '@mui/icons-material';
import {
  Box,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Field, useFormikContext } from 'formik';

const RequiredFormInfo: React.FC = () => {
  const { errors, values, setFieldValue } =
    useFormikContext<ThrivePassCommuterEnrollmentForm>();
  return (
    <Section title="Form requirements" vertical>
      <Grid container item xs={12}>
        <Grid item xs={12}>
          <Typography my={1} fontWeight="bold">
            What would you like to do with your ThrivePass Commuter elections?
            (Select one):
          </Typography>
          <RadioGroup
            name="form_action"
            value={values.form_action}
            onChange={(event) => {
              setFieldValue('form_action', event.target.value);
            }}
          >
            <Grid
              container
              item
              direction="row"
              sx={{ mb: 2, justifyContent: 'center' }}
            >
              <Grid item xs={12} sm={4} sx={{ alignContent: 'center' }}>
                <FormControlLabel
                  value="new"
                  control={<Radio />}
                  label="Enroll"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  value="change"
                  control={<Radio />}
                  label="Change"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  value="terminate"
                  control={<Radio />}
                  label="Terminate"
                />
              </Grid>
            </Grid>
          </RadioGroup>
        </Grid>
        <Grid container item spacing={3} xs={12}>
          <Grid item xs={12} sm={6}>
            <Field
              name="employer_name"
              as={TextField}
              label="Employer name"
              fullWidth
              error={!!errors.employer_name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <FormikDatePicker
                name="effective_date"
                label="Effective date"
                sx={{ width: '100%' }}
                error={!!errors.effective_date}
              />
              <Tooltip
                title={
                  <Typography variant="body1">
                    Your contribution change will take effect on your selected
                    date if submitted at least 7 business days in advance.
                    Otherwise, it will apply in the next payroll cycle.
                  </Typography>
                }
                placement="top"
                arrow
                sx={{ ml: 1 }}
              >
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Section>
  );
};

export default RequiredFormInfo;
