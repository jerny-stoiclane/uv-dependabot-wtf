import { startCase, toLower } from 'lodash';

export const humanizeTitle = (title?: string): string => {
  if (!title) return '';
  // prettier-ignore
  const acronyms = new Set([
    'CEO', 'CFO', 'COO', 'VP', 'SW', 'QA',
    'PR', 'NPI', 'LD', 'HR', 'CTO', 'CIO',
    'CPO', 'CMO', 'CSO', 'CCO', 'CDO', 'CRO',
    'CXO', 'AI', 'UX', 'UI', 'MD', 'GM',
    'R&D', 'IT', 'GIS', 'CAD', 'ERP', 'CRM', 'SEO',
    'SEM', 'PPC', 'KPI', 'ROI', 'B2B', 'B2C', 'SME',
    'CPA', 'CMA', 'CFA', 'JD', 'MBA', 'PHD', 'RN',
    'LPN', 'DDS', 'DVM', 'ESQ', 'LLC', 'INC', 'LLP',
    'LP', 'LTD', 'PLC', 'AG', 'SA', 'GMBH', 'PT', 'SLP',
    'OT', 'OBGYN', 'ENT', 'CPM', 'MBBS', 'FRCS', 'FRCR',
    'FRCP', 'MRCOG', 'MRCP', 'MRCS', 'FRCA', 'HRIS', 'HCM',
  ]);

  const lowerTitle = toLower(title);
  const words = lowerTitle.split(' ');

  const humanizedWords = words.map((word) => {
    const parts = word.split('-');
    const humanizedParts = parts.map((part) =>
      acronyms.has(part.toUpperCase())
        ? part.toUpperCase()
        : part.charAt(0).toUpperCase() + part.slice(1)
    );

    return humanizedParts.join('-');
  });

  return humanizedWords.join(' ');
};

export const humanizeDepartment = (department?: string) => {
  if (!department) return '';
  return startCase(toLower(department));
};

export const getDisplayName = (
  user: CommonNameFields,
  includeLastName: boolean = true
): string => {
  const { first_name = '', last_name = '', nickname = '' } = user || {};

  const namePart = nickname?.trim() || first_name.trim();
  const lastNamePart = last_name.trim();

  return includeLastName && lastNamePart
    ? `${namePart} ${lastNamePart}`.trim()
    : namePart;
};

export const getOrdinalSuffix = (i: number) => {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

export const triggerDownload = (url: string, filename: string): void => {
  const alink = document.createElement('a');
  alink.href = url;
  alink.download = filename;
  document.body.appendChild(alink);
  alink.click();
  document.body.removeChild(alink);
};
