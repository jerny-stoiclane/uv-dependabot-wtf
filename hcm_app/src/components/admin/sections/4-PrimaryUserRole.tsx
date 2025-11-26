import { Section } from '@armhr/ui';
import { Info } from '@mui/icons-material';
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { useFormikContext } from 'formik';
import React from 'react';

import { useRoleValidationRules } from '../../../hooks/useRoleValidation';
import { PRIMARY_ROLES, type PrimaryRole } from '../../../utils/roles';
import { FormValues } from '../userAccessFormValues';

const roles = [
  {
    value: PRIMARY_ROLES.FULL_ACCESS,
    label: 'Full Access',
    helperText: 'Always includes pay rates',
    tooltip:
      'User has ability to see all information in the system – Benefits, Reports, HR, PTO and Payroll and make changes.',
  },
  {
    value: PRIMARY_ROLES.PAYROLL_ONLY,
    label: 'Payroll Only',
    helperText: 'Always includes pay rates',
    tooltip:
      'User can view and edit any payroll-related processes and can access payroll reports.',
  },
  {
    value: PRIMARY_ROLES.PTO_ONLY,
    label: 'PTO Only',
    helperText: 'Direct Reports',
    tooltip:
      'User can view and approve Paid Time Off requests for employees that are listed as "Reporting To" them in the payroll system.',
  },
  {
    value: PRIMARY_ROLES.BROKER_ACCESS,
    label: 'Broker Access',
    tooltip:
      'User is a "Trusted Advisor" that fulfills the role of Benefit Broker for your organization. They will have access to employee information needed to assist with benefit enrollment, including enrollment proxy (if selected on HR role) and process benefits reports.',
  },
  {
    value: PRIMARY_ROLES.FINANCIAL_REPORTS_ONLY,
    label: 'Financial Reports',
    tooltip:
      'User is a "Trusted Advisor" with access to Financial and Payroll-related reports.',
  },
  {
    value: PRIMARY_ROLES.HR_ONLY,
    label: 'HR Only',
    tooltip:
      'User can view and edit any HR-related items including new hires, rehires, and terminations, and can access HR reports.',
  },
];

const PrimaryUserRole: React.FC = () => {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<FormValues>();
  const { handlePrimaryRoleChange } = useRoleValidationRules();

  return (
    <Section title="Primary User Role" vertical>
      <FormControl component="fieldset">
        <RadioGroup
          name="primary_user_role"
          value={values.primary_user_role}
          onChange={(event) => {
            const newValue = event.target.value as PrimaryRole;
            setFieldValue('primary_user_role', newValue);
            handlePrimaryRoleChange(newValue);
          }}
        >
          <Grid container spacing={2}>
            {roles.map((role) => (
              <Grid item xs={12} sm={6} key={role.value}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
                >
                  <FormControlLabel
                    value={role.value}
                    control={<Radio />}
                    label={
                      <Box pt={0.4}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography variant="body1" component="span">
                            {role.label}
                          </Typography>
                          <Tooltip
                            title={
                              <Typography variant="body1">
                                {role.tooltip}
                              </Typography>
                            }
                            placement="top"
                            arrow
                          >
                            <IconButton size="small">
                              <Info fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        {role.helperText && (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ display: 'block', marginTop: '2px' }}
                          >
                            {role.helperText}
                          </Typography>
                        )}
                      </Box>
                    }
                    sx={{
                      alignItems: 'flex-start',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
        {touched.primary_user_role && errors.primary_user_role && (
          <Typography color="error" variant="body2">
            {errors.primary_user_role}
          </Typography>
        )}
      </FormControl>
    </Section>
  );
};

export default PrimaryUserRole;
