import { Section } from '@armhr/ui';
import { Info } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useFormikContext } from 'formik';
import React from 'react';

import { useRoleValidationRules } from '../../../hooks/useRoleValidation';
import { PAYROLL_ROLES } from '../../../utils/roles';
import { FormValues } from '../userAccessFormValues';

const PayrollSection: React.FC = () => {
  const { values, touched, errors, setFieldValue } =
    useFormikContext<FormValues>();
  const { isPayrollRoleAvailable } = useRoleValidationRules();

  const payrollOptions = [
    {
      value: PAYROLL_ROLES.PAYROLL_APPROVER,
      label: 'Payroll Approver',
      tooltip:
        'User will be able to view and approve the payroll for finalization',
    },
    {
      value: PAYROLL_ROLES.PAYROLL_ADMINISTRATOR,
      label: 'Self Service Payroll',
      tooltip:
        'User can calculate payroll without Armhr intervention before approval / finalization.',
    },
    {
      value: PAYROLL_ROLES.PAYROLL_VIEWER,
      label: 'Time Sheet Entry',
      tooltip: 'User can enter payroll.',
    },
  ];

  const handleCheckboxChange = (value: string) => {
    const currentRoles = values.payroll_roles || [];
    const newRoles = currentRoles.includes(value)
      ? currentRoles.filter((role) => role !== value)
      : [...currentRoles, value];

    setFieldValue('payroll_roles', newRoles);
  };

  return (
    <Section title="Payroll" vertical>
      <FormControl component="fieldset">
        <Typography my={1} fontWeight="bold">
          Select all that apply:
        </Typography>

        <FormGroup>
          {payrollOptions.map((option) => {
            const isAvailable = isPayrollRoleAvailable(option.value);
            return (
              <Box
                key={option.value}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  opacity: isAvailable ? 1 : 0.5,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        values.payroll_roles?.includes(option.value) || false
                      }
                      onChange={() => handleCheckboxChange(option.value)}
                      disabled={!isAvailable}
                    />
                  }
                  label={option.label}
                />
                <Tooltip
                  title={
                    <Typography variant="body1">{option.tooltip}</Typography>
                  }
                  placement="top"
                  arrow
                >
                  <IconButton size="small" sx={{ ml: 'auto' }}>
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            );
          })}
        </FormGroup>

        {touched.payroll_roles && errors.payroll_roles && (
          <Typography color="error" variant="body2">
            {errors.payroll_roles}
          </Typography>
        )}
      </FormControl>
    </Section>
  );
};

export default PayrollSection;
