import { useFormikContext } from 'formik';
import { useCallback, useContext } from 'react';

import { FormValues } from '../components/admin/userAccessFormValues';
import { RoleValidationContext } from '../contexts/roleValidation.context';
import {
  PAY_RATE_ACCESSIBLE_ROLES,
  type PayRateAccessibleRole,
  type PrimaryRole,
} from '../utils/roles';

export const useRoleValidationRules = () => {
  const { values, setFieldValue } = useFormikContext<FormValues>();
  const {
    isHrRoleAvailable,
    isPayrollRoleAvailable,
    isPayRateAccessAvailable,
  } = useRoleValidation();

  const handlePrimaryRoleChange = useCallback(
    (newRole: PrimaryRole) => {
      // Clear HR addons first to ensure we don't have any invalid combinations
      setFieldValue('hr_addons', []);

      // Handle Pay Rate Access for roles that have it by default
      if (
        PAY_RATE_ACCESSIBLE_ROLES.includes(newRole as PayRateAccessibleRole)
      ) {
        setFieldValue('pay_rate_access', true);
      } else if (
        values.primary_user_role &&
        PAY_RATE_ACCESSIBLE_ROLES.includes(
          values.primary_user_role as PayRateAccessibleRole
        ) &&
        !PAY_RATE_ACCESSIBLE_ROLES.includes(newRole as PayRateAccessibleRole)
      ) {
        // Clear Pay Rate Access when changing from a role that has it to one that doesn't
        setFieldValue('pay_rate_access', false);
      }

      // Clear incompatible HR and payroll roles
      setFieldValue('hr_addons', []);
      setFieldValue('payroll_roles', []);
    },
    [setFieldValue, values.primary_user_role]
  );

  const handleHrRoleChange = (newRoles: string[]) => {
    const validRoles = newRoles.filter(isHrRoleAvailable);
    setFieldValue('hr_addons', validRoles);
  };

  return {
    isHrRoleAvailable,
    isPayrollRoleAvailable,
    isPayRateAccessAvailable,
    handlePrimaryRoleChange,
    handleHrRoleChange,
  };
};

export const useRoleValidation = () => {
  const context = useContext(RoleValidationContext);
  if (!context) {
    throw new Error(
      'useRoleValidation must be used within a RoleValidationProvider'
    );
  }
  return context;
};
