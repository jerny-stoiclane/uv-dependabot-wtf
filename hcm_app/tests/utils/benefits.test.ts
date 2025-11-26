import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getBenefitsProviderLogo,
  getBenefitsProviderName,
  getCurrentBenefits,
  getUpcomingBenefits,
  humanize,
  sortBenefits,
} from '../../src/utils/benefits';

describe('getBenefitsProviderName', () => {
  it('should return correct provider name', () => {
    expect(getBenefitsProviderName('Cigna Health')).toBe('cigna');
    expect(getBenefitsProviderName('Unknown Provider')).toBeUndefined();
  });
});

describe('getBenefitsProviderLogo', () => {
  it('should return the correct logo URL', () => {
    expect(getBenefitsProviderLogo('Cigna Health')).toBe(
      '/src/assets/cigna-logo.svg'
    );
    expect(getBenefitsProviderLogo('Unknown Provider')).toBe('');
  });
});

describe('humanize', () => {
  it('should return humanized string', () => {
    expect(humanize('DEMO EPO 1000 HD')).toBe('Demo EPO 1000 HD');
    expect(humanize('EMPIRE PPO COPAY UCR 80% W/VISION')).toBe(
      'Empire PPO Copay UCR 80% with Vision'
    );
  });
});

describe('sortBenefits', () => {
  it('should sort benefits correctly', () => {
    const benefits = [
      { type: 'dental', offer_type_code: 'DEN' },
      { type: 'medical', offer_type_code: 'MED' },
      { type: 'vision', offer_type_code: 'VIS' },
    ];
    const sorted = sortBenefits(benefits);
    expect(sorted[0].type).toBe('medical');
    expect(sorted[1].type).toBe('dental');
    expect(sorted[2].type).toBe('vision');
  });
});

describe('getCurrentBenefits', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return empty array for null/undefined input', () => {
    expect(getCurrentBenefits(null as any)).toEqual([]);
    expect(getCurrentBenefits(undefined as any)).toEqual([]);
  });

  it('should filter benefits based on coverage dates', () => {
    vi.setSystemTime(new Date('2024-06-01'));

    const benefits = [
      {
        id: 'MED1',
        name: 'Medical Plan 1',
        coverage_start: '2024-05-01',
        coverage_end: null,
        effective_date: '2024-05-01',
        employee_contribution: '100.00',
        type: 'Medical',
        offer_type_code: 'MED',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
      {
        id: 'MED2',
        name: 'Medical Plan 2',
        coverage_start: '2024-07-01',
        coverage_end: null,
        effective_date: '2024-07-01',
        employee_contribution: '150.00',
        type: 'Medical',
        offer_type_code: 'MED',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
      {
        id: 'MED3',
        name: 'Medical Plan 3',
        coverage_start: '2024-03-01',
        coverage_end: '2024-05-31',
        effective_date: '2024-03-01',
        employee_contribution: '80.00',
        type: 'Medical',
        offer_type_code: 'MED',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
    ];

    const currentBenefits = getCurrentBenefits(benefits);
    expect(currentBenefits).toHaveLength(1);
    expect(currentBenefits[0].id).toBe('MED1');
  });

  it('should deduplicate benefits by id, keeping the most recent effective date', () => {
    vi.setSystemTime(new Date('2024-06-01'));

    const benefits = [
      {
        id: 'OOMCPPCO',
        name: 'CIGNA PPO1',
        coverage_start: '2024-05-01',
        coverage_end: null,
        effective_date: '2024-05-01',
        employee_contribution: '267.80',
        type: 'Medical',
        offer_type_code: 'MED',
        plan_type: 'FAM',
        carrier_url: 'https://my.cigna.com',
        plan_desc_url:
          'https://assets.armhr.com/plan-assets/cigna/Cigna%20PPO%201.pdf',
      },
      {
        id: 'OOMCPPCO',
        name: 'CIGNA PPO1',
        coverage_start: '2024-05-01',
        coverage_end: null,
        effective_date: '2024-05-15',
        employee_contribution: '247.71',
        type: 'Medical',
        offer_type_code: 'MED',
        plan_type: 'FAM',
        carrier_url: 'https://my.cigna.com',
        plan_desc_url:
          'https://assets.armhr.com/plan-assets/cigna/Cigna%20PPO%201.pdf',
      },
      {
        id: 'OOMCPPCO',
        name: 'CIGNA PPO1',
        coverage_start: '2024-05-01',
        coverage_end: null,
        effective_date: '2024-05-20',
        employee_contribution: '286.56',
        type: 'Medical',
        offer_type_code: 'MED',
        plan_type: 'FAM',
        carrier_url: 'https://my.cigna.com',
        plan_desc_url:
          'https://assets.armhr.com/plan-assets/cigna/Cigna%20PPO%201.pdf',
      },
    ];

    const currentBenefits = getCurrentBenefits(benefits);
    expect(currentBenefits).toHaveLength(1);
    expect(currentBenefits[0].effective_date).toBe('2024-05-20');
    expect(currentBenefits[0].employee_contribution).toBe('286.56');
  });

  it('should handle benefits without effective_date by keeping the first occurrence', () => {
    vi.setSystemTime(new Date('2024-06-01'));

    const benefits = [
      {
        id: 'DEN1',
        name: 'Dental Plan 1',
        coverage_start: '2024-05-01',
        coverage_end: null,
        effective_date: null,
        employee_contribution: '50.00',
        type: 'Dental',
        offer_type_code: 'DEN',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
      {
        id: 'DEN1',
        name: 'Dental Plan 1',
        coverage_start: '2024-05-01',
        coverage_end: null,
        effective_date: null,
        employee_contribution: '60.00',
        type: 'Dental',
        offer_type_code: 'DEN',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
    ];

    const currentBenefits = getCurrentBenefits(benefits);
    expect(currentBenefits).toHaveLength(1);
    expect(currentBenefits[0].employee_contribution).toBe('50.00');
  });

  it('should handle mixed benefits with and without effective_date', () => {
    vi.setSystemTime(new Date('2024-06-01'));

    const benefits = [
      {
        id: 'VIS1',
        name: 'Vision Plan 1',
        coverage_start: '2024-05-01',
        coverage_end: null,
        effective_date: null,
        employee_contribution: '20.00',
        type: 'Vision',
        offer_type_code: 'VIS',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
      {
        id: 'VIS1',
        name: 'Vision Plan 1',
        coverage_start: '2024-05-01',
        coverage_end: null,
        effective_date: '2024-05-10',
        employee_contribution: '25.00',
        type: 'Vision',
        offer_type_code: 'VIS',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
    ];

    const currentBenefits = getCurrentBenefits(benefits);
    expect(currentBenefits).toHaveLength(1);
    // When one benefit has effective_date and another doesn't, prefer the one with effective_date
    expect(currentBenefits[0].effective_date).toBe('2024-05-10');
    expect(currentBenefits[0].employee_contribution).toBe('25.00');
  });
});

describe('getUpcomingBenefits', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return empty array for null/undefined input', () => {
    expect(getUpcomingBenefits(null as any)).toEqual([]);
    expect(getUpcomingBenefits(undefined as any)).toEqual([]);
  });

  it('should filter benefits with future coverage start dates', () => {
    vi.setSystemTime(new Date('2024-06-01'));

    const benefits = [
      {
        id: 'MED1',
        name: 'Medical Plan 1',
        coverage_start: '2024-05-01',
        coverage_end: null,
        effective_date: '2024-05-01',
        employee_contribution: '100.00',
        type: 'Medical',
        offer_type_code: 'MED',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
      {
        id: 'MED2',
        name: 'Medical Plan 2',
        coverage_start: '2024-07-01',
        coverage_end: null,
        effective_date: '2024-07-01',
        employee_contribution: '150.00',
        type: 'Medical',
        offer_type_code: 'MED',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
      {
        id: 'MED3',
        name: 'Medical Plan 3',
        coverage_start: '2024-08-01',
        coverage_end: null,
        effective_date: '2024-08-01',
        employee_contribution: '200.00',
        type: 'Medical',
        offer_type_code: 'MED',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
    ];

    const upcomingBenefits = getUpcomingBenefits(benefits);
    expect(upcomingBenefits).toHaveLength(2);
    expect(upcomingBenefits.map((b) => b.id)).toEqual(['MED2', 'MED3']);
  });

  it('should deduplicate upcoming benefits by id, keeping the most recent effective date', () => {
    vi.setSystemTime(new Date('2024-06-01'));

    const benefits = [
      {
        id: 'DEN1',
        name: 'Dental Plan 1',
        coverage_start: '2024-07-01',
        coverage_end: null,
        effective_date: '2024-07-01',
        employee_contribution: '50.00',
        type: 'Dental',
        offer_type_code: 'DEN',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
      {
        id: 'DEN1',
        name: 'Dental Plan 1',
        coverage_start: '2024-07-01',
        coverage_end: null,
        effective_date: '2024-07-15',
        employee_contribution: '55.00',
        type: 'Dental',
        offer_type_code: 'DEN',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
      {
        id: 'DEN1',
        name: 'Dental Plan 1',
        coverage_start: '2024-07-01',
        coverage_end: null,
        effective_date: '2024-07-20',
        employee_contribution: '60.00',
        type: 'Dental',
        offer_type_code: 'DEN',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
    ];

    const upcomingBenefits = getUpcomingBenefits(benefits);
    expect(upcomingBenefits).toHaveLength(1);
    expect(upcomingBenefits[0].effective_date).toBe('2024-07-20');
    expect(upcomingBenefits[0].employee_contribution).toBe('60.00');
  });

  it('should return empty array when no upcoming benefits exist', () => {
    vi.setSystemTime(new Date('2024-06-01'));

    const benefits = [
      {
        id: 'MED1',
        name: 'Medical Plan 1',
        coverage_start: '2024-05-01',
        coverage_end: null,
        effective_date: '2024-05-01',
        employee_contribution: '100.00',
        type: 'Medical',
        offer_type_code: 'MED',
        plan_type: 'FAM',
        carrier_url: null,
        plan_desc_url: null,
      },
    ];

    const upcomingBenefits = getUpcomingBenefits(benefits);
    expect(upcomingBenefits).toHaveLength(0);
  });
});
