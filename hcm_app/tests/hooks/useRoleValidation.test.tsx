import { renderHook } from '@testing-library/react';
import { Formik } from 'formik';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { RoleValidationProvider } from '../../src/contexts/roleValidation.context';
import { useRoleValidation } from '../../src/hooks/useRoleValidation';
import { HR_ROLES, PAYROLL_ROLES, PRIMARY_ROLES } from '../../src/utils/roles';

// Helper function to render the hook with Formik context
const renderRoleValidationHook = (initialValues: any) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      <RoleValidationProvider>{children}</RoleValidationProvider>
    </Formik>
  );

  return renderHook(() => useRoleValidation(), { wrapper });
};

describe('useRoleValidation', () => {
  describe('Full Access Role', () => {
    const initialValues = {
      primary_user_role: PRIMARY_ROLES.FULL_ACCESS,
      pay_rate_access: true,
    };

    it('should allow all HR roles', () => {
      const { result } = renderRoleValidationHook(initialValues);
      const { isHrRoleAvailable } = result.current;

      Object.values(HR_ROLES).forEach((role) => {
        expect(isHrRoleAvailable(role)).toBe(true);
      });
    });

    it('should allow all payroll roles', () => {
      const { result } = renderRoleValidationHook(initialValues);
      const { isPayrollRoleAvailable } = result.current;

      Object.values(PAYROLL_ROLES).forEach((role) => {
        expect(isPayrollRoleAvailable(role)).toBe(true);
      });
    });
  });

  describe('Payroll Only Role', () => {
    const initialValues = {
      primary_user_role: PRIMARY_ROLES.PAYROLL_ONLY,
      pay_rate_access: true,
    };

    it('should only allow Employee Confidential Documents HR role', () => {
      const { result } = renderRoleValidationHook(initialValues);
      const { isHrRoleAvailable } = result.current;

      expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_CONFIDENTIAL_DOCS)).toBe(true);
      expect(isHrRoleAvailable(HR_ROLES.BENEFIT_ENROLLMENT_PROXY)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_DOCS)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.NEW_HIRE_ENTRY)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.PTO_ADMIN)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_MANAGER_PTO)).toBe(false);
    });

    it('should allow all payroll roles', () => {
      const { result } = renderRoleValidationHook(initialValues);
      const { isPayrollRoleAvailable } = result.current;

      expect(isPayrollRoleAvailable(PAYROLL_ROLES.PAYROLL_APPROVER)).toBe(true);
      expect(isPayrollRoleAvailable(PAYROLL_ROLES.PAYROLL_ADMINISTRATOR)).toBe(
        true
      );
      expect(isPayrollRoleAvailable(PAYROLL_ROLES.PAYROLL_VIEWER)).toBe(true);
    });
  });

  describe('Broker Access Role', () => {
    const initialValues = {
      primary_user_role: PRIMARY_ROLES.BROKER_ACCESS,
      pay_rate_access: false,
    };

    it('should only allow Benefit Enrollment Proxy HR role', () => {
      const { result } = renderRoleValidationHook(initialValues);
      const { isHrRoleAvailable } = result.current;

      expect(isHrRoleAvailable(HR_ROLES.BENEFIT_ENROLLMENT_PROXY)).toBe(true);
      expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_CONFIDENTIAL_DOCS)).toBe(
        false
      );
      expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_DOCS)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.NEW_HIRE_ENTRY)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.PTO_ADMIN)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_MANAGER_PTO)).toBe(false);
    });

    it('should not allow any payroll roles', () => {
      const { result } = renderRoleValidationHook(initialValues);
      const { isPayrollRoleAvailable } = result.current;

      Object.values(PAYROLL_ROLES).forEach((role) => {
        expect(isPayrollRoleAvailable(role)).toBe(false);
      });
    });
  });

  describe('HR Only Role', () => {
    describe('without Pay Rate Access', () => {
      const initialValues = {
        primary_user_role: PRIMARY_ROLES.HR_ONLY,
        pay_rate_access: false,
      };

      it('should not allow Employee Documents and New Hire Entry', () => {
        const { result } = renderRoleValidationHook(initialValues);
        const { isHrRoleAvailable } = result.current;

        expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_DOCS)).toBe(false);
        expect(isHrRoleAvailable(HR_ROLES.NEW_HIRE_ENTRY)).toBe(false);
        expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_CONFIDENTIAL_DOCS)).toBe(
          true
        );
        expect(isHrRoleAvailable(HR_ROLES.BENEFIT_ENROLLMENT_PROXY)).toBe(true);
        expect(isHrRoleAvailable(HR_ROLES.PTO_ADMIN)).toBe(true);
        expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_MANAGER_PTO)).toBe(true);
      });
    });

    describe('with Pay Rate Access', () => {
      const initialValues = {
        primary_user_role: PRIMARY_ROLES.HR_ONLY,
        pay_rate_access: true,
      };

      it('should allow all HR roles', () => {
        const { result } = renderRoleValidationHook(initialValues);
        const { isHrRoleAvailable } = result.current;

        Object.values(HR_ROLES).forEach((role) => {
          expect(isHrRoleAvailable(role)).toBe(true);
        });
      });
    });

    it('should not allow any payroll roles', () => {
      const { result } = renderRoleValidationHook({
        primary_user_role: PRIMARY_ROLES.HR_ONLY,
        pay_rate_access: false,
      });
      const { isPayrollRoleAvailable } = result.current;

      Object.values(PAYROLL_ROLES).forEach((role) => {
        expect(isPayrollRoleAvailable(role)).toBe(false);
      });
    });
  });

  describe('PTO Only Role', () => {
    const initialValues = {
      primary_user_role: PRIMARY_ROLES.PTO_ONLY,
      pay_rate_access: false,
    };

    it('should only allow PTO-related HR roles', () => {
      const { result } = renderRoleValidationHook(initialValues);
      const { isHrRoleAvailable } = result.current;

      expect(isHrRoleAvailable(HR_ROLES.PTO_ADMIN)).toBe(true);
      expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_MANAGER_PTO)).toBe(true);
      expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_CONFIDENTIAL_DOCS)).toBe(
        false
      );
      expect(isHrRoleAvailable(HR_ROLES.BENEFIT_ENROLLMENT_PROXY)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_DOCS)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.NEW_HIRE_ENTRY)).toBe(false);
    });

    it('should not allow any payroll roles', () => {
      const { result } = renderRoleValidationHook(initialValues);
      const { isPayrollRoleAvailable } = result.current;

      Object.values(PAYROLL_ROLES).forEach((role) => {
        expect(isPayrollRoleAvailable(role)).toBe(false);
      });
    });
  });

  describe('Financial Reports Only Role', () => {
    const initialValues = {
      primary_user_role: PRIMARY_ROLES.FINANCIAL_REPORTS_ONLY,
      pay_rate_access: true,
    };

    it('should only allow Employee Confidential Documents HR role', () => {
      const { result } = renderRoleValidationHook(initialValues);
      const { isHrRoleAvailable } = result.current;

      expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_CONFIDENTIAL_DOCS)).toBe(true);
      expect(isHrRoleAvailable(HR_ROLES.BENEFIT_ENROLLMENT_PROXY)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_DOCS)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.NEW_HIRE_ENTRY)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.PTO_ADMIN)).toBe(false);
      expect(isHrRoleAvailable(HR_ROLES.EMPLOYEE_MANAGER_PTO)).toBe(false);
    });

    it('should not allow any payroll roles', () => {
      const { result } = renderRoleValidationHook(initialValues);
      const { isPayrollRoleAvailable } = result.current;

      Object.values(PAYROLL_ROLES).forEach((role) => {
        expect(isPayrollRoleAvailable(role)).toBe(false);
      });
    });
  });
});
