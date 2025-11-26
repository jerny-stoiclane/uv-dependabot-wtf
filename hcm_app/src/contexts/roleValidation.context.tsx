import { useFormikContext } from 'formik';
import React, { createContext, useMemo } from 'react';

import { FormValues } from '../components/admin/userAccessFormValues';
import { HR_ROLES, PRIMARY_ROLES, type PrimaryRole } from '../utils/roles';

type RoleValidationContextType = {
  isHrRoleAvailable: (role: string) => boolean;
  isPayrollRoleAvailable: (role: string) => boolean;
  isPayRateAccessAvailable: () => boolean;
};

export const RoleValidationContext =
  createContext<RoleValidationContextType | null>(null);

export const RoleValidationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { values } = useFormikContext<FormValues>();
  const { primary_user_role, pay_rate_access } = values;

  const validationRules = useMemo(() => {
    const isHrRoleAvailable = (role: string): boolean => {
      const roleMap: Record<PrimaryRole, (role: string) => boolean> = {
        [PRIMARY_ROLES.FULL_ACCESS]: () => true,
        [PRIMARY_ROLES.PAYROLL_ONLY]: (role) =>
          role === HR_ROLES.EMPLOYEE_CONFIDENTIAL_DOCS,
        [PRIMARY_ROLES.BROKER_ACCESS]: (role) =>
          role === HR_ROLES.BENEFIT_ENROLLMENT_PROXY,
        [PRIMARY_ROLES.HR_ONLY]: (role) => {
          // If Pay Rate Access is disabled, Employee Documents and New Hire Entry are not available
          if (!pay_rate_access) {
            const restrictedRoles = [
              HR_ROLES.EMPLOYEE_DOCS,
              HR_ROLES.NEW_HIRE_ENTRY,
            ] as const;
            return !restrictedRoles.includes(
              role as (typeof restrictedRoles)[number]
            );
          }
          return true;
        },
        [PRIMARY_ROLES.PTO_ONLY]: (role) =>
          role === HR_ROLES.PTO_ADMIN || role === HR_ROLES.EMPLOYEE_MANAGER_PTO,
        [PRIMARY_ROLES.FINANCIAL_REPORTS_ONLY]: (role) =>
          role === HR_ROLES.EMPLOYEE_CONFIDENTIAL_DOCS,
      };

      return roleMap[primary_user_role as PrimaryRole]?.(role) ?? false;
    };

    const isPayrollRoleAvailable = (): boolean => {
      // Only Full Access and Payroll Only roles can access payroll features
      return (
        primary_user_role === PRIMARY_ROLES.FULL_ACCESS ||
        primary_user_role === PRIMARY_ROLES.PAYROLL_ONLY
      );
    };

    const isPayRateAccessAvailable = (): boolean => {
      // Full Access, Payroll Only, and Financial Reports Only roles always have pay rate access
      return (
        primary_user_role === PRIMARY_ROLES.FULL_ACCESS ||
        primary_user_role === PRIMARY_ROLES.PAYROLL_ONLY ||
        primary_user_role === PRIMARY_ROLES.FINANCIAL_REPORTS_ONLY
      );
    };

    return {
      isHrRoleAvailable,
      isPayrollRoleAvailable,
      isPayRateAccessAvailable,
    };
  }, [primary_user_role, pay_rate_access]);

  return (
    <RoleValidationContext.Provider value={validationRules}>
      {children}
    </RoleValidationContext.Provider>
  );
};
