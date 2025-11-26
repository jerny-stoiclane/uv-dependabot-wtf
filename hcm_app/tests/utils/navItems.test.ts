import { describe, expect, it } from 'vitest';

import { generateNavItems } from '../../src/utils/navItems';
import { genCompany, genUser } from '../fixtures';

describe('generateNavItems', () => {
  describe('basic user (no tax forms)', () => {
    const clientId = '123';
    const user = genUser({
      is_admin: false,
      is_manager: false,
      client_id: clientId,
      tax_form_visibility: { bonus_tax_forms: false }, // basic user nas no forms, visibility should be false
      is_armhr_pto_enabled: true, // Set this based on company config
    });
    const company = genCompany({
      id: clientId,
      config: [
        {
          flag: 'show_bonus_tax_withholding', // company has bonus tax forms enabled
          value: true,
        },
        {
          flag: 'armhr_pto_enabled', // client uses armhr for pto
          value: true,
        },
        {
          flag: 'fsa_commuter_enrollment_enabled', // client offers fsa commuter enrollment
          value: true,
        },
      ],
    });
    const api = {} as any;

    it('does see timeoff (pto) nav item when company flag is true', () => {
      const navItems = generateNavItems(user, company, api);
      const selfItems = navItems.items[0];
      const pto = selfItems.children.find((item) => item.id === 'timeoff');
      expect(pto.isVisible).toBe(true);
    });

    it('does see commuter enrollment (thrivepass form) nav item when company flag is true', () => {
      const navItems = generateNavItems(user, company, api);
      const selfItems = navItems.items[0];
      const benefitItems = selfItems.children.find(
        (item) => item.id === 'benefits'
      );
      const commuter = benefitItems?.children.find(
        (item) => item.id === 'thrivepass-form'
      );
      expect(commuter.isVisible).toBe(true);
    });

    it('does not see Bonus tax withholding nav item when user has no forms and is flag enabled', () => {
      const navItems = generateNavItems(user, company, api);
      const selfItems = navItems.items[0];
      const taxChildren = selfItems.children.find(
        (item) => item.id === 'tax-information'
      );
      const bonusTax = taxChildren?.children.find(
        (item) => item.id === 'bonus-tax-withholding'
      );
      expect(bonusTax.isVisible).toBe(false);
    });

    it('does not see admin nav items', () => {
      const navItems = generateNavItems(user, company, api);
      const adminItems = navItems.items[3];
      expect(adminItems.id).toBe('admin');
      expect(adminItems.isVisible).toBe(false); // whyyy TS?
    });

    it('does not see manager nav items', () => {
      const navItems = generateNavItems(user, company, api);
      const managerItems = navItems.items[2];
      expect(managerItems.id).toBe('manager');
      expect(managerItems.isVisible).toBe(false); // whyyy TS?
    });

    it('only see the Enrolled Benefits tab once enrolled', () => {
      const usr = { ...user, active_benefits: { insurance_plans: true } };
      const navItems = generateNavItems(usr, company, api);
      const selfItems = navItems.items[0];
      const benefits = selfItems.children.find(
        (item) => item.id === 'benefits'
      );
      const enrolledBenefits = benefits?.children.find(
        (item) => item.id === 'enrolled-benefits'
      );
      expect(enrolledBenefits.isVisible).toBe(true);
    });

    it('does not see the Enrolled Benefits if they have no insurance plans', () => {
      const usr = { ...user, active_benefits: { insurance_plans: false } };
      const navItems = generateNavItems(usr, company, api);
      const selfItems = navItems.items[0];
      const benefits = selfItems.children.find(
        (item) => item.id === 'benefits'
      );
      const enrolledBenefits = benefits?.children.find(
        (item) => item.id === 'enrolled-benefits'
      );
      expect(enrolledBenefits.isVisible).toBe(false);
    });

    it('does see Benefits Enrollment if enrollment is in progress', () => {
      const usr = {
        ...user,
        enrollment_status: {
          is_enrollment_in_progress: { enrollmentInProgress: true },
        },
      };
      const navItems = generateNavItems(usr, company, api);
      const selfItems = navItems.items[0];
      const benefits = selfItems.children.find(
        (item) => item.id === 'benefits'
      );
      const openEnrollment = benefits?.children.find(
        (item) => item.id === 'open-enrollment'
      );
      expect(openEnrollment.isVisible).toBe(true);
    });

    it('does not see Benefits Enrollment if enrollment is not in progress', () => {
      const usr = {
        ...user,
        enrollment_status: {
          is_enrollment_in_progress: { enrollmentInProgress: false },
        },
      };
      const navItems = generateNavItems(usr, company, api);
      const selfItems = navItems.items[0];
      const benefits = selfItems.children.find(
        (item) => item.id === 'benefits'
      );
      const openEnrollment = benefits?.children.find(
        (item) => item.id === 'open-enrollment'
      );
      expect(openEnrollment.isVisible).toBe(false);
    });
  });
  describe('admin user', () => {
    const clientId = '123';
    const user = genUser({
      is_admin: true,
      is_manager: false,
      client_id: clientId,
      tax_form_visibility: { bonus_tax_forms: true }, // admins always have bonus_tax_forms visible
      is_armhr_pto_enabled: true, // Set this based on company config
    });
    const company = genCompany({
      id: clientId,
      config: [
        {
          flag: 'show_bonus_tax_withholding', // tax form company flag is on
          value: true,
        },
      ],
    });
    const api = {} as any;

    it('does see admin nav items', () => {
      const navItems = generateNavItems(user, company, api);
      const adminItems = navItems.items[3];
      expect(adminItems.id).toBe('admin');
      expect(adminItems.isVisible).toBe(true); // whyyy TS?
    });
    it('does see Bonus tax withholding nav item', () => {
      const navItems = generateNavItems(user, company, api);
      const selfItems = navItems.items[0];
      const taxChildren = selfItems.children.find(
        (item) => item.id === 'tax-information'
      );
      const bonusTax = taxChildren?.children.find(
        (item) => item.id === 'bonus-tax-withholding'
      );
      expect(bonusTax.isVisible).toBe(true);
    });
  });
  describe('basic user (has tax forms)', () => {
    const clientId = '123';
    const user = genUser({
      is_admin: false,
      is_manager: false,
      client_id: clientId,
      tax_form_visibility: { bonus_tax_forms: true }, // basic user nas no forms, visibility should be false
      is_armhr_pto_enabled: false, // Set this based on company config
    });
    const company = genCompany({
      id: clientId,
      config: [
        {
          flag: 'show_bonus_tax_withholding', // company has bonus tax forms enabled
          value: true,
        },
        {
          flag: 'armhr_pto_enabled', // client does not use armhr for pto
          value: false,
        },
        {
          flag: 'fsa_commuter_enrollment_enabled', // client does not offer fsa commuter enrollment
          value: false,
        },
      ],
    });
    const api = {} as any;

    it('does not see timeoff (pto) nav item when company flag is false', () => {
      const navItems = generateNavItems(user, company, api);
      const selfItems = navItems.items[0];
      const pto = selfItems.children.find((item) => item.id === 'timeoff');
      expect(pto.isVisible).toBe(false);
    });

    it('does not see commuter enrollment (thrivepass form) nav item when company flag is false', () => {
      const navItems = generateNavItems(user, company, api);
      const selfItems = navItems.items[0];
      const benefitItems = selfItems.children.find(
        (item) => item.id === 'benefits'
      );
      const commuter = benefitItems?.children.find(
        (item) => item.id === 'thrivepass-form'
      );
      expect(commuter.isVisible).toBe(false);
    });

    it('does see Bonus tax withholding nav item when user has forms', () => {
      const navItems = generateNavItems(user, company, api);
      const selfItems = navItems.items[0];
      const taxChildren = selfItems.children.find(
        (item) => item.id === 'tax-information'
      );
      const bonusTax = taxChildren?.children.find(
        (item) => item.id === 'bonus-tax-withholding'
      );
      expect(bonusTax.isVisible).toBe(true);
    });

    it('does not see admin nav items', () => {
      const navItems = generateNavItems(user, company, api);
      const adminItems = navItems.items[3];
      expect(adminItems.id).toBe('admin');
      expect(adminItems.isVisible).toBe(false); // whyyy TS?
    });

    it('does not see manager nav items', () => {
      const navItems = generateNavItems(user, company, api);
      const managerItems = navItems.items[2];
      expect(managerItems.id).toBe('manager');
      expect(managerItems.isVisible).toBe(false); // whyyy TS?
    });
  });
});
