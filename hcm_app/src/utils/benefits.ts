import { sortBy } from 'lodash';

import aflacLogo from '../assets/aflac-logo.png';
import anthemLogo from '../assets/anthem-logo.svg';
import cignaLogo from '../assets/cigna-logo.svg';
import empireLogo from '../assets/empire-logo.png';
import equitableLogo from '../assets/equitable-logo.png';
import excellusLogo from '../assets/excellus-logo.png';
import guardianLogo from '../assets/guardian-logo.png';
import lifelockLogo from '../assets/lifelock-logo.png';
import armhrLogo from '../assets/logo.png';
import metlifeLogo from '../assets/metlife-logo.png';
import oelsLogo from '../assets/oels-logo.png';
import petLogo from '../assets/pbs-logo.png';

type CompanyLogos = {
  [key: string]: string;
};

const companyLogos: CompanyLogos = {
  armhr: armhrLogo,
  anthem: anthemLogo,
  cigna: cignaLogo,
  metlife: metlifeLogo,
  empire: empireLogo,
  excellus: excellusLogo,
  oels: oelsLogo,
  guardian: guardianLogo,
  equitable: equitableLogo,
  lifelock: lifelockLogo,
  aflac: aflacLogo,
  demo: armhrLogo,
  historical: armhrLogo,
  affordable: armhrLogo,
  telehealth: armhrLogo,
  combined: armhrLogo,
  pet: petLogo,
};

export const getBenefitsProviderName = (name: string): string | undefined => {
  const companyName = name.toLowerCase();
  const matchingKey = Object.keys(companyLogos).find((key) =>
    companyName.includes(key)
  );
  return matchingKey;
};

// We'll send this back from the BE eventually
export const getBenefitsProviderLogo = (name: string): string => {
  const companyName = name.toLowerCase();
  const matchingKey = Object.keys(companyLogos).find((key) =>
    companyName.includes(key)
  );
  return matchingKey ? companyLogos[matchingKey] : '';
};

export const normalizeStringValues = (str: string): string => {
  const strMap = {
    'w/o': 'without ',
    'w/': 'with ',
    Epo: 'EPO',
    Hmo: 'HMO',
    Ltd: 'LTD',
    Dhmo: 'DHMO',
    Hsa: 'HSA',
    Fsa: 'FSA',
    Ppo: 'PPO',
    Ba: 'BA',
    Ppo1: 'PPO1',
    Ppo2: 'PPO2',
    Ppo3: 'PPO3',
    Ppo4: 'PPO4',
    Ppo5: 'PPO5',
    Ppo6: 'PPO6',
    Ppo7: 'PPO7',
    Epo1: 'EPO1',
    Epo2: 'EPO2',
    Epo3: 'EPO3',
    Epo4: 'EPO4',
    Epo5: 'EPO5',
    Epo6: 'EPO6',
    Sdi: 'SDI',
    Std: 'STD',
    Ucr: 'UCR',
    Den: 'DEN',
    Pbs: 'PBS',
    Vis: 'VIS',
    Med: 'MED',
    'D&d': 'D&D',
    Oels: 'OELS',
    'Ad&D': 'AD&D',
    Hd: 'HD',
    Hd1: 'HD1',
    Hd2: 'HD2',
    Hd3: 'HD3',
    Hd4: 'HD4',
    Er: 'ER',
    vision: 'Vision',
  };

  for (const [key, value] of Object.entries(strMap)) {
    const re = new RegExp(`\\b${key}\\b`, 'gi');
    str = str.replace(re, value);
  }

  return str;
};

export const humanize = (constant: string): string => {
  return normalizeStringValues(
    constant
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
};

export interface TypeInfo {
  label: string;
  color: string;
}

// Mapping from offer_type_code to descriptive names (matching BenefitOfferTypeCode from backend)
export const offerTypeNameMap: Record<string, string> = {
  MED: 'Medical',
  ADD: 'Accidental Death and Dismemberment',
  ACC: 'Accident Benefits',
  LIF: 'Life Insurance - Basic',
  GAP: 'Gap Insurance',
  HOS: 'Voluntary Hospitalization',
  ANC: 'Ancillary',
  SDA: 'Additional STD',
  LGL: 'Legal',
  DEN: 'Dental',
  IDT: 'Identity Theft',
  TEL: 'Telehealth',
  LTD: 'Long Term Disability',
  CAN: 'Cancer Benefits',
  VOL: 'Voluntary Benefits',
  CRI: 'Critical Illness',
  PET: 'Pet Benefits',
  VIS: 'Vision',
  BLX: 'Basic Life Extra',
  STD: 'Short Term Disability',
  WLI: 'Whole Life',
  GTL: 'Group Term Life',
  LDA: 'Additional LTD',
  FSA: 'Flexible Spending Acct',
  HSA: 'Health Savings Acct',
  LIS: 'Life Insurance - Basic - Spouse Only',
  LIC: 'Life Insurance - Basic - Child Only',
  COM: 'Commuter',
  MDP: 'Domestic Partner Medical',
  DDP: 'Domestic Partner Dental',
  VDP: 'Domestic Partner Vision',
  CRL: 'Critical Illness as Life',
  DEPFSA: 'Dependent Care FSA',
  BOND: 'Bond',
};

export const offerTypeColorMap: Record<string, string> = {
  MED: 'hsl(210, 70%, 50%)',
  DEN: 'hsl(180, 60%, 45%)',
  VIS: 'hsl(200, 65%, 55%)',
  LIF: 'hsl(120, 60%, 45%)',
  GTL: 'hsl(140, 55%, 50%)',
  BLX: 'hsl(130, 65%, 55%)',
  WLI: 'hsl(150, 50%, 45%)',
  LIS: 'hsl(125, 60%, 50%)',
  LIC: 'hsl(135, 55%, 55%)',
  STD: 'hsl(25, 70%, 55%)',
  LTD: 'hsl(20, 65%, 50%)',
  SDA: 'hsl(30, 60%, 60%)',
  LDA: 'hsl(15, 70%, 50%)',
  ADD: 'hsl(0, 70%, 55%)',
  ACC: 'hsl(10, 65%, 60%)',
  CRI: 'hsl(350, 65%, 55%)',
  CRL: 'hsl(340, 60%, 50%)',
  CAN: 'hsl(280, 60%, 55%)',
  TEL: 'hsl(260, 55%, 60%)',
  HOS: 'hsl(270, 50%, 65%)',
  FSA: 'hsl(190, 65%, 50%)',
  HSA: 'hsl(200, 60%, 55%)',
  DEPFSA: 'hsl(185, 70%, 45%)',
  VOL: 'hsl(45, 70%, 55%)',
  GAP: 'hsl(40, 65%, 60%)',
  ANC: 'hsl(50, 60%, 65%)',
  LGL: 'hsl(35, 55%, 50%)',
  IDT: 'hsl(30, 60%, 55%)',
  PET: 'hsl(25, 65%, 60%)',
  COM: 'hsl(220, 15%, 60%)',
  MDP: 'hsl(210, 50%, 65%)',
  DDP: 'hsl(180, 50%, 65%)',
  VDP: 'hsl(200, 50%, 70%)',
  BOND: 'hsl(220, 10%, 45%)',
};

// Default colors for types without a matching offer_type_code
const defaultTypeColors: Record<string, string> = {
  medical: 'hsl(224, 50%, 60%)',
  dental: 'hsl(210, 50%, 60%)',
  vision: 'hsl(134, 50%, 60%)',
  life: 'hsl(90, 60%, 60%)',
  short_term_disability: 'hsl(14, 50%, 60%)',
  long_term_disability: 'hsl(5, 50%, 60%)',
  accident: 'hsl(40, 50%, 60%)',
  critical_illness: 'hsl(330, 50%, 60%)',
};

// Get the descriptive name for an offer_type_code
export const getOfferTypeName = (offerTypeCode?: string): string | null => {
  if (!offerTypeCode) return null;
  return offerTypeNameMap[offerTypeCode] || null;
};

export const getTypeInfo = (
  type: string,
  offerTypeCode?: string
): TypeInfo | null => {
  if (!type) return null;

  // If we have an offer_type_code, use its mapped name as the label
  if (offerTypeCode && offerTypeNameMap[offerTypeCode]) {
    const label = offerTypeNameMap[offerTypeCode];
    const color = offerTypeColorMap[offerTypeCode] || 'hsl(210, 30%, 60%)';
    return {
      label,
      color,
    };
  }

  // Fallback to the original type if no offer_type_code mapping
  const label = humanize(type);

  if (offerTypeCode && offerTypeColorMap[offerTypeCode]) {
    return {
      label,
      color: offerTypeColorMap[offerTypeCode],
    };
  }

  const typeKey = type.toLowerCase();
  if (defaultTypeColors[typeKey]) {
    return {
      label,
      color: defaultTypeColors[typeKey],
    };
  }

  // Fallback for types we don't have a specific color for
  // Try to detect common keywords in the type
  if (typeKey.includes('life')) {
    return { label, color: defaultTypeColors['life'] };
  } else if (typeKey.includes('std') || typeKey.includes('short term')) {
    return { label, color: defaultTypeColors['short_term_disability'] };
  } else if (typeKey.includes('ltd') || typeKey.includes('long term')) {
    return { label, color: defaultTypeColors['long_term_disability'] };
  } else if (typeKey.includes('critical') || typeKey.includes('illness')) {
    return { label, color: defaultTypeColors['critical_illness'] };
  } else if (typeKey.includes('accident')) {
    return { label, color: defaultTypeColors['accident'] };
  }

  return {
    label,
    color: 'hsl(210, 30%, 60%)',
  };
};

export const sortBenefits = (benefits: InsurancePlan[]): InsurancePlan[] => {
  const offerTypeOrder = [
    'MED',
    'DEN',
    'VIS',
    'LIF',
    'GTL',
    'BLX',
    'LIS',
    'LIC',
    'STD',
    'SDA',
    'LTD',
    'LDA',
    'ACC',
    'ADD',
    'CRI',
    'CRL',
    'HOS',
    'CAN',
    'WLI',
    'PET',
    'IDT',
    'LGL',
    'TEL',
    'ANC',
    'FSA',
    'HSA',
    'DEPFSA',
    'COM',
    'VOL',
    'GAP',
    'BOND',
    'MDP',
    'DDP',
    'VDP',
  ];

  return sortBy(benefits, (benefit) => {
    const index = offerTypeOrder.indexOf(benefit.offer_type_code);
    if (index !== -1) {
      return index;
    }
  });
};

export const safeParseFloat = (value: string | number): number => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const parsed = parseFloat(value.toString());
  return isNaN(parsed) ? 0 : parsed;
};

// Function to normalize Quill HTML output for proper list rendering
export const normalizeQuillHtml = (html: string): string => {
  if (!html) return '';

  // Create a DOM parser to work with the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Convert Quill's bullet lists (ol with data-list="bullet") to ul
  const bulletListItems = doc.querySelectorAll('li[data-list="bullet"]');
  bulletListItems.forEach((li) => {
    // Find the parent ol
    const parentOl = li.closest('ol');
    if (parentOl) {
      // Create a new ul element
      const ul = doc.createElement('ul');
      // Get all bullet list items in this ol
      const siblingBullets = parentOl.querySelectorAll(
        'li[data-list="bullet"]'
      );

      // Move them to the new ul
      siblingBullets.forEach((bullet) => {
        // Remove the data-list attribute
        bullet.removeAttribute('data-list');
        // Remove any Quill UI spans
        const uiSpans = bullet.querySelectorAll('span.ql-ui');
        uiSpans.forEach((span) => span.remove());
        ul.appendChild(bullet);
      });

      // Replace the ol with the ul
      parentOl.parentNode?.replaceChild(ul, parentOl);
    }
  });

  // Clean up ordered lists too - remove data-list and ql-ui spans
  const orderedListItems = doc.querySelectorAll('li[data-list="ordered"]');
  orderedListItems.forEach((li) => {
    li.removeAttribute('data-list');
    const uiSpans = li.querySelectorAll('span.ql-ui');
    uiSpans.forEach((span) => span.remove());
  });

  return doc.body.innerHTML;
};

export const getCurrentBenefits = (
  benefits: InsurancePlan[]
): InsurancePlan[] => {
  if (!benefits) return [];

  const now = new Date();
  const filteredBenefits = benefits.filter((benefit) => {
    const startDate = new Date(benefit.coverage_start);
    const endDate = benefit.coverage_end
      ? new Date(benefit.coverage_end)
      : null;
    return startDate <= now && (!endDate || endDate > now);
  });

  // Deduplicate benefits by id, keeping the one with the most recent effective date
  const benefitMap = new Map<string, InsurancePlan>();

  filteredBenefits.forEach((benefit) => {
    const existingBenefit = benefitMap.get(benefit.id);
    if (!existingBenefit) {
      benefitMap.set(benefit.id, benefit);
    } else if (benefit.effective_date && existingBenefit.effective_date) {
      // Both have effective dates, compare them
      const benefitDate = new Date(benefit.effective_date);
      const existingDate = new Date(existingBenefit.effective_date);
      if (benefitDate > existingDate) {
        benefitMap.set(benefit.id, benefit);
      }
    } else if (benefit.effective_date && !existingBenefit.effective_date) {
      // New benefit has effective_date, existing doesn't - prefer the new one
      benefitMap.set(benefit.id, benefit);
    }
    // If existing has effective_date but new doesn't, keep existing
  });

  return Array.from(benefitMap.values());
};

export const getUpcomingBenefits = (
  benefits: InsurancePlan[]
): InsurancePlan[] => {
  if (!benefits) return [];

  const now = new Date();
  const filteredBenefits = benefits.filter((benefit) => {
    const startDate = new Date(benefit.coverage_start);
    return startDate > now;
  });

  // Deduplicate benefits by id, keeping the one with the most recent effective date
  const benefitMap = new Map<string, InsurancePlan>();

  filteredBenefits.forEach((benefit) => {
    const existingBenefit = benefitMap.get(benefit.id);
    if (!existingBenefit) {
      benefitMap.set(benefit.id, benefit);
    } else if (benefit.effective_date && existingBenefit.effective_date) {
      // Both have effective dates, compare them
      const benefitDate = new Date(benefit.effective_date);
      const existingDate = new Date(existingBenefit.effective_date);
      if (benefitDate > existingDate) {
        benefitMap.set(benefit.id, benefit);
      }
    } else if (benefit.effective_date && !existingBenefit.effective_date) {
      // New benefit has effective_date, existing doesn't - prefer the new one
      benefitMap.set(benefit.id, benefit);
    }
    // If existing has effective_date but new doesn't, keep existing
  });

  return Array.from(benefitMap.values());
};
