import { Dropdown, MoneyField, Section } from '@armhr/ui';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';

import { payMethods, payRates } from '../../utils/constants';
import useOptionalFieldsToggle from './useOptionalFieldsToggle';

const PayFields = ({
  requiredFields,
  showOptional,
  newHireRequest,
  codes,
}: {
  requiredFields: string[];
  showOptional: boolean;
  newHireRequest?: NewHireRequest;
  codes?: CompanyCode;
}) => {
  const formik = useFormikContext<NewHireRequestFormValues>();

  const payFields = [
    'pay_group',
    'pay_rate',
    'pay_method',
    'pay_period',
    'standard_hours',
    'auto_time_sheet',
    'default_time_sheet_hours',
    'first_pay_period_hours',
  ];

  const { showOptionalFields, getToggleLink, shouldRenderField } =
    useOptionalFieldsToggle(showOptional, requiredFields, payFields);

  return (
    <Section
      title="Pay details"
      description={<Box>{getToggleLink()}</Box>}
      vertical={!!newHireRequest}
    >
      {!showOptionalFields &&
        payFields.every((field) => !requiredFields.includes(field)) && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="gray">
              No fields are required.
            </Typography>
          </Box>
        )}
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {shouldRenderField('pay_group') && (
            <Dropdown
              name="pay_group"
              label="Pay group"
              fullWidth
              required={requiredFields.includes('pay_group')}
              value={formik.values.pay_group}
              options={
                codes?.pay_group_codes?.map((payGroup) => ({
                  value: payGroup.id,
                  label: payGroup.value,
                })) || []
              }
              onChange={formik.handleChange}
              formControlProps={{
                error: !!formik.errors.pay_group,
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {shouldRenderField('pay_method') && (
            <Dropdown
              name="pay_method"
              label="Pay method"
              required={requiredFields.includes('pay_method')}
              fullWidth
              value={formik.values.pay_method}
              options={
                payMethods.map((payMethod) => ({
                  value: payMethod.id,
                  label: payMethod.value,
                })) || []
              }
              onChange={formik.handleChange}
              formControlProps={{
                error: !!formik.errors.pay_method,
              }}
            />
          )}
          {shouldRenderField('pay_rate') && (
            <Field
              name="pay_rate"
              label="Pay rate"
              fullWidth
              required={requiredFields.includes('pay_rate')}
              value={formik.values.pay_rate}
              onChange={formik.handleChange}
              as={MoneyField}
              error={!!formik.errors.pay_rate}
              helperText={formik.errors.pay_rate}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {shouldRenderField('pay_period') && (
            <Dropdown
              name="pay_period"
              label="Pay rate basis"
              fullWidth
              required={requiredFields.includes('pay_period')}
              value={formik.values.pay_period}
              options={
                payRates.map((payRate) => ({
                  value: payRate.id,
                  label: payRate.value,
                })) || []
              }
              onChange={formik.handleChange}
              formControlProps={{
                error: !!formik.errors.pay_period,
              }}
            />
          )}
          {shouldRenderField('standard_hours') && (
            <Field
              name="standard_hours"
              label="Standard hours"
              fullWidth
              required={requiredFields.includes('standard_hours')}
              value={formik.values.standard_hours}
              onChange={formik.handleChange}
              component={TextField}
              error={!!formik.errors.standard_hours}
              helperText={formik.errors.standard_hours}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {shouldRenderField('default_time_sheet_hours') && (
            <Field
              name="default_time_sheet_hours"
              label="Default Time Sheet Hours"
              fullWidth
              required={requiredFields.includes('default_time_sheet_hours')}
              value={formik.values.default_time_sheet_hours}
              onChange={formik.handleChange}
              component={TextField}
              error={!!formik.errors.default_time_sheet_hours}
              helperText={formik.errors.default_time_sheet_hours}
            />
          )}
          {shouldRenderField('first_pay_period_hours') && (
            <Field
              name="first_pay_period_hours"
              label="First Pay Period Hours"
              fullWidth
              required={requiredFields.includes('first_pay_period_hours')}
              value={formik.values.first_pay_period_hours}
              onChange={formik.handleChange}
              component={TextField}
              error={!!formik.errors.first_pay_period_hours}
              helperText={formik.errors.first_pay_period_hours}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {shouldRenderField('auto_time_sheet') && (
            <FormControlLabel
              name="auto_time_sheet"
              label="Auto Time Sheet"
              labelPlacement="end"
              required={requiredFields.includes('auto_time_sheet')}
              control={
                <Checkbox
                  checked={formik.values.auto_time_sheet === 'Y'}
                  onChange={(_) =>
                    formik.setFieldValue(
                      'auto_time_sheet',
                      formik.values.auto_time_sheet === 'Y' ? 'N' : 'Y'
                    )
                  }
                />
              }
            />
          )}
        </Box>
      </Stack>
    </Section>
  );
};

export default PayFields;
