import { FormikDatePicker, MoneyField } from '@armhr/ui';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Typography,
} from '@mui/material';
import { format, isValid } from 'date-fns';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { useMemo } from 'react';

import { useUser } from '../../hooks/useUser';

const BonusTaxWithholdingRequestSignatureForm: React.FC<{
  signatureValue: string;
  setSignatureValue: (value: string) => void;
}> = ({ signatureValue, setSignatureValue }) => {
  const { errors, touched } =
    useFormikContext<BonusTaxWithholdingRequestForm>();
  const { user } = useUser();

  const fullName = `${user!.first_name} ${user!.last_name}`;

  // visual feedback for signature input
  const characterStates = useMemo(() => {
    let isMatching = true;
    return fullName.split('').map((char, index) => {
      if (index >= signatureValue.length) {
        return 'default';
      }
      if (signatureValue[index] === char && isMatching) {
        return 'correct';
      }
      isMatching = false;
      return 'error';
    });
  }, [signatureValue, fullName]);

  const getStyledName = () => {
    if (signatureValue.length === 0) {
      return (
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'gray' }}>
          {fullName}
        </Typography>
      );
    }

    if (signatureValue === fullName) {
      return (
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'green' }}>
          {fullName}
        </Typography>
      );
    }

    return (
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {fullName.split('').map((char, index) => (
          <Box
            component="span"
            key={index}
            sx={{
              color:
                characterStates[index] === 'correct'
                  ? 'primary.main'
                  : characterStates[index] === 'error'
                  ? 'red'
                  : 'gray',
            }}
          >
            {char}
          </Box>
        ))}
      </Typography>
    );
  };

  const checkboxLanguage = `
    Check here to acknowledge your understanding that (1) Armhr will withhold federal and state deductions as outlined above (unless otherwise required by law), (2) you are
    responsible for all taxes associated with a supplemental wage payment regardless of any withholding
    amounts outlined above,
    and (3) you authorize Armhr to reduce the amount of additional tax withholding in the event that there is less 
    monies available after satisfying all other federal and state requirements.
  `;

  return (
    <Box>
      <FormControl error={!!errors.acknowledgement}>
        <FormGroup>
          <Field name="acknowledgement">
            {({ field, form }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(event) =>
                      form.setFieldValue(
                        'acknowledgement',
                        event.target.checked
                      )
                    }
                    color="primary"
                  />
                }
                label={checkboxLanguage}
              />
            )}
          </Field>
          <FormHelperText>
            <ErrorMessage name="acknowledgement" />
          </FormHelperText>
        </FormGroup>
      </FormControl>

      <Grid container mt={1} spacing={2}>
        <Grid container item xs={12} mb={3}>
          <Grid item xs={12} sm={4}>
            <Field name="bonus_pay_date">
              {({ field, form }: any) => (
                <>
                  <FormikDatePicker
                    name="bonus_pay_date"
                    label="Bonus Pay Date"
                    error={touched.bonus_pay_date && !!errors.bonus_pay_date}
                    sx={{ width: '100%' }}
                    onChange={(date: Date | null) => {
                      if (date && isValid(date)) {
                        form.setFieldValue(
                          field.name,
                          format(date, 'yyyy-MM-dd')
                        ); // match FormikDatePicker's expected format
                      } else {
                        form.setFieldValue(field.name, null);
                      }
                    }}
                  />
                  <FormHelperText sx={{ color: 'error.main' }}>
                    <ErrorMessage name="bonus_pay_date" />
                  </FormHelperText>
                </>
              )}
            </Field>
          </Grid>
        </Grid>

        <Grid container item xs={12} spacing={2} mb={3}>
          <Grid item xs={12} sm={4}>
            <Field
              name="additional_fed_tax"
              label="Additional Federal Tax"
              fullWidth
              as={MoneyField}
              error={touched.additional_fed_tax && !!errors.additional_fed_tax}
              helperText={<ErrorMessage name="additional_fed_tax" />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Field
              name="additional_state_tax"
              label="Additional State Tax"
              fullWidth
              as={MoneyField}
              error={
                touched.additional_state_tax && !!errors.additional_state_tax
              }
              helperText={<ErrorMessage name="additional_state_tax" />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Field
              name="additional_local_tax"
              label="Additional Local Tax"
              fullWidth
              as={MoneyField}
              error={
                touched.additional_local_tax && !!errors.additional_local_tax
              }
              helperText={<ErrorMessage name="additional_local_tax" />}
            />
          </Grid>
        </Grid>

        <Grid container item xs={12} mb={0}>
          <Grid item xs={12} sm={12}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Please type your name exactly as it appears below to add your
              signature to the request.
            </Typography>
          </Grid>
        </Grid>

        <Grid container item xs={12} mb={0}>
          <Grid item xs={12} sm={12}>
            {getStyledName()}
          </Grid>
        </Grid>

        <Grid container item xs={12} mb={3}>
          <Grid item xs={12} sm={4}>
            <Field
              name="signature"
              component={TextField}
              label="Signature"
              fullWidth
              value={signatureValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                // Limit the input to the length of fullName to prevent extra characters
                if (e.target.value.length <= fullName.length) {
                  setSignatureValue(e.target.value);
                }
              }}
              error={!!errors.signature}
              helperText={errors.signature}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BonusTaxWithholdingRequestSignatureForm;
