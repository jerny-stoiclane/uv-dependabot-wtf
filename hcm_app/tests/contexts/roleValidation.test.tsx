import { act, renderHook } from '@testing-library/react';
import { Formik } from 'formik';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RoleValidationProvider } from '../../src/contexts/roleValidation.context';
import { useRoleValidationRules } from '../../src/hooks/useRoleValidation';
import { HR_ROLES, PRIMARY_ROLES } from '../../src/utils/roles';

const mockSetFieldValue = vi.fn();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Formik
    initialValues={{
      primary_user_role: '',
      pay_rate_access: false,
      hr_addons: [],
      payroll_role: '',
    }}
    onSubmit={() => {}}
  >
    <RoleValidationProvider>{children}</RoleValidationProvider>
  </Formik>
);

describe('useRoleValidationRules', () => {
  beforeEach(() => {
    mockSetFieldValue.mockClear();
    vi.spyOn(require('formik'), 'useFormikContext').mockReturnValue({
      setFieldValue: mockSetFieldValue,
      values: {
        primary_user_role: '',
        pay_rate_access: false,
      },
    });
  });

  it('should set pay rate access to true when selecting Financial Reports Only role', async () => {
    const { result } = renderHook(() => useRoleValidationRules(), {
      wrapper,
    });

    await act(async () => {
      await result.current.handlePrimaryRoleChange(
        PRIMARY_ROLES.FINANCIAL_REPORTS_ONLY
      );
    });

    expect(mockSetFieldValue).toHaveBeenCalledWith('pay_rate_access', true);
  });

  it('should set pay rate access to true when selecting Full Access role', async () => {
    const { result } = renderHook(() => useRoleValidationRules(), {
      wrapper,
    });

    await act(async () => {
      await result.current.handlePrimaryRoleChange(PRIMARY_ROLES.FULL_ACCESS);
    });

    expect(mockSetFieldValue).toHaveBeenCalledWith('pay_rate_access', true);
  });

  it('should set pay rate access to true when selecting Payroll Only role', async () => {
    const { result } = renderHook(() => useRoleValidationRules(), {
      wrapper,
    });

    await act(async () => {
      await result.current.handlePrimaryRoleChange(PRIMARY_ROLES.PAYROLL_ONLY);
    });

    expect(mockSetFieldValue).toHaveBeenCalledWith('pay_rate_access', true);
  });

  it('should clear pay rate access when changing from a role with pay rate access to one without it', async () => {
    vi.spyOn(require('formik'), 'useFormikContext').mockReturnValue({
      setFieldValue: mockSetFieldValue,
      values: {
        primary_user_role: PRIMARY_ROLES.FINANCIAL_REPORTS_ONLY,
        pay_rate_access: true,
      },
    });

    const { result } = renderHook(() => useRoleValidationRules(), {
      wrapper,
    });

    await act(async () => {
      await result.current.handlePrimaryRoleChange(PRIMARY_ROLES.PTO_ONLY);
    });

    expect(mockSetFieldValue).toHaveBeenCalledWith('pay_rate_access', false);
  });

  it('should not clear pay rate access when changing between roles that have it by default', async () => {
    vi.spyOn(require('formik'), 'useFormikContext').mockReturnValue({
      setFieldValue: mockSetFieldValue,
      values: {
        primary_user_role: PRIMARY_ROLES.FINANCIAL_REPORTS_ONLY,
        pay_rate_access: true,
      },
    });

    const { result } = renderHook(() => useRoleValidationRules(), {
      wrapper,
    });

    await act(async () => {
      await result.current.handlePrimaryRoleChange(PRIMARY_ROLES.FULL_ACCESS);
    });

    expect(mockSetFieldValue).not.toHaveBeenCalledWith(
      'pay_rate_access',
      false
    );
  });

  describe('HR Only role validation', () => {
    it('should allow all HR roles when Pay Rate Access is enabled', () => {
      vi.spyOn(require('formik'), 'useFormikContext').mockReturnValue({
        values: {
          primary_user_role: PRIMARY_ROLES.HR_ONLY,
          pay_rate_access: true,
        },
      });

      const { result } = renderHook(() => useRoleValidationRules(), {
        wrapper,
      });

      expect(result.current.isHrRoleAvailable(HR_ROLES.EMPLOYEE_DOCS)).toBe(
        true
      );
      expect(result.current.isHrRoleAvailable(HR_ROLES.NEW_HIRE_ENTRY)).toBe(
        true
      );
      expect(
        result.current.isHrRoleAvailable(HR_ROLES.EMPLOYEE_CONFIDENTIAL_DOCS)
      ).toBe(true);
    });

    it('should not allow Employee Documents and New Hire Entry when Pay Rate Access is disabled', () => {
      vi.spyOn(require('formik'), 'useFormikContext').mockReturnValue({
        values: {
          primary_user_role: PRIMARY_ROLES.HR_ONLY,
          pay_rate_access: false,
        },
      });

      const { result } = renderHook(() => useRoleValidationRules(), {
        wrapper,
      });

      expect(result.current.isHrRoleAvailable(HR_ROLES.EMPLOYEE_DOCS)).toBe(
        false
      );
      expect(result.current.isHrRoleAvailable(HR_ROLES.NEW_HIRE_ENTRY)).toBe(
        false
      );
      expect(
        result.current.isHrRoleAvailable(HR_ROLES.EMPLOYEE_CONFIDENTIAL_DOCS)
      ).toBe(true);
    });
  });
});
