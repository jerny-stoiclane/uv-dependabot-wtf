import { Section } from '@armhr/ui';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useFormikContext } from 'formik';
import React from 'react';

import { useRoleValidationRules } from '../../../hooks/useRoleValidation';
import { HR_ROLES } from '../../../utils/roles';
import { FormValues } from '../userAccessFormValues';

const HrAddOnsSection: React.FC = () => {
  const { values } = useFormikContext<FormValues>();
  const { isHrRoleAvailable, handleHrRoleChange } = useRoleValidationRules();

  const addons = [
    {
      value: HR_ROLES.EMPLOYEE_CONFIDENTIAL_DOCS,
      label: 'Employee Confidential Documents',
      tooltip:
        'User will have access to view and upload files to a confidential employee document file. Employees will NOT have access to their confidential documents.',
    },
    {
      value: HR_ROLES.BENEFIT_ENROLLMENT_PROXY,
      label: 'Benefit Enrollment Proxy',
      tooltip:
        'User will be able to proxy in as employee and complete benefit enrollment on their behalf.',
    },
    {
      value: HR_ROLES.EMPLOYEE_DOCS,
      label: 'Employee Documents',
      tooltip: 'User will have access to view and manage employee documents.',
    },
    {
      value: HR_ROLES.NEW_HIRE_ENTRY,
      label: 'New Hire Entry',
      tooltip:
        'User will be able to enter new hire information into the system.',
    },
    {
      value: HR_ROLES.PTO_ADMIN,
      label: 'PTO Administrator',
      helperText: 'Whole Company',
      tooltip:
        'User will receive all time off requests for their organization.',
    },
    {
      value: HR_ROLES.EMPLOYEE_MANAGER_PTO,
      label: 'Employee Manager PTO Request',
      helperText: 'Direct Reports Only',
      tooltip:
        'Manager user should receive time off requests for their direct reports only.',
    },
  ];

  return (
    <Section title="HR add-ons" vertical>
      <Typography mb={1} fontWeight="bold">
        Select as many as applicable:
      </Typography>
      <Grid container>
        {addons.map((addon) => {
          const isAvailable = isHrRoleAvailable(addon.value);
          return (
            <Grid item xs={12} sm={6} key={addon.value}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
              >
                <FormControlLabel
                  sx={{
                    alignItems: 'flex-start',
                    opacity: isAvailable ? 1 : 0.5,
                  }}
                  control={
                    <Checkbox
                      checked={values.hr_addons.includes(addon.value)}
                      onChange={(event) => {
                        const newRoles = event.target.checked
                          ? [...values.hr_addons, addon.value]
                          : values.hr_addons.filter(
                              (item) => item !== addon.value
                            );
                        handleHrRoleChange(newRoles);
                      }}
                      disabled={!isAvailable}
                    />
                  }
                  label={
                    <Box pt={0.9}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Typography variant="body1">{addon.label}</Typography>
                        <Tooltip
                          title={
                            <Typography variant="body1">
                              {addon.tooltip}
                            </Typography>
                          }
                          placement="top"
                          sx={{ ml: 'auto' }}
                          arrow
                        >
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      {addon.helperText && (
                        <Typography variant="caption">
                          {addon.helperText}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Section>
  );
};

export default HrAddOnsSection;
