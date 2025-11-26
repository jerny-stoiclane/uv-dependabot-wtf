export const ethnicities = [
  { value: 'I', label: 'American Indian or Alaska Native' },
  { value: 'A', label: 'Asian' },
  { value: 'B', label: 'Black or African American' },
  { value: 'X', label: 'Declined to State' },
  { value: 'H', label: 'Hispanic or Latino' },
  { value: 'P', label: 'Native Hawaiian or Other Pacific Islander' },
  { value: 'T', label: 'Two or More Races' },
  { value: 'W', label: 'White / Caucasian' },
];

export const languages = [
  { value: 'ENG', label: 'English' },
  { value: 'SPA', label: 'Spanish' },
];

export const compensationMethods = [
  { value: 'S', label: 'Salary' },
  { value: 'H', label: 'Hourly' },
  { value: 'C', label: 'Commission' },
  { value: 'D', label: 'Driver' },
];

export const payPeriods = [
  { value: 'W', label: 'Weekly' },
  { value: 'B', label: 'Bi-weekly' },
  { value: 'S', label: 'Semi-monthly' },
  { value: 'M', label: 'Monthly' },
  { value: 'A', label: 'Annual' },
  { value: 'H', label: 'Hourly' },
];

export const employeeTypes = [
  { value: 'F', label: 'Full-time' },
  { value: 'P', label: 'Part-time' },
  { value: 'PD', label: 'Per Diem' },
  { value: 'S', label: 'Seasonal' },
  { value: 'SP', label: 'Seasonal Part-time' },
  { value: 'TF', label: 'Temporary Full-time' },
  { value: 'TP', label: 'Temporary Part-time' },
  { value: '1099', label: 'Freelancer/contractor/self-employed' },
];

export const employmentStatuses = [
  { value: 'A', label: 'Active' },
  { value: 'L', label: 'On Leave' },
  { value: 'T', label: 'Terminated' },
];

export const genderIdentities = [
  { value: 'F', label: 'Female' },
  { value: 'GDS', label: 'Decline to select' },
  { value: 'GNL', label: 'Option not listed' },
  { value: 'M', label: 'Male' },
  { value: 'NB', label: 'Non-binary' },
  { value: 'T', label: 'Transgender' },
];

export const gender = [
  { value: 'F', label: 'Female' },
  { value: 'M', label: 'Male' },
  { value: 'X', label: 'Non-binary' },
  { value: 'D', label: 'Decline to state' },
];

export const fedWithholdingStatuses = [
  { value: 'S', label: 'Single' },
  { value: 'MJ', label: 'Married filing jointly' },
  { value: 'H', label: 'Head of household' },
];

export const maritalStatuses = [
  { value: 'D', label: 'Divorced' },
  { value: 'M', label: 'Married' },
  { value: 'S', label: 'Single' },
  { value: 'W', label: 'Widowed' },
  { value: 'C', label: 'Civil Union' },
  { value: 'O', label: 'Other' },
];

export const citizenshipStatuses = [
  { value: 'Z01', label: 'A citizen of the United States' },
  { value: 'Z02', label: 'A noncitizen national of the United States' },
  { value: 'Z03', label: 'A lawful permanent resident' },
  { value: 'Z04', label: 'An alien authorized to work' },
];

export const statesAndCodes = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

export const payMethods: {
  id: PayMethodCode;
  value: PayMethodLabelMap[PayMethodCode];
}[] = [
  { id: 'S', value: 'Salary' },
  { id: 'H', value: 'Hourly' },
  { id: 'C', value: 'Commission' },
  { id: 'D', value: 'Driver' },
];

export const payRates: {
  id: PayRateCode;
  value: PayRateLabelMap[PayRateCode];
}[] = [
  { id: 'H', value: 'Hourly' },
  { id: 'W', value: 'Weekly' },
  { id: 'B', value: 'Bi-weekly' },
  { id: 'M', value: 'Monthly' },
  { id: 'S', value: 'Semi-monthly' },
  { id: 'Y', value: 'Yearly' },
];

export const preferredPronouns = [
  { value: 'H', label: 'He / him / his' },
  { value: 'PDS', label: 'Decline to select' },
  { value: 'PNL', label: 'Option not listed' },
  { value: 'S', label: 'She / her / hers' },
  { value: 'TH', label: 'They / them / theirs' },
];

export const ptoStatusTypes = {
  A: 'Approved',
  C: 'Cancelled',
  N: 'Pending',
  P: 'Paid',
};

export const filingStatusTypes = {
  SS: 'Single or Married Filing Separately',
  M: 'Married',
  MJ: 'Married filing jointly',
  H: 'Head of household',
};

export const payrollVoucherTypes = [
  { value: 'R', label: 'Regular' },
  { value: 'V', label: 'Vacation' },
  { value: 'S', label: 'Supplemental' },
  { value: 'A', label: 'Arrears' },
  { value: 'J', label: 'Adjustment' },
];

export const ddAccountTypes = [
  { value: 'C', label: 'Checking' },
  { value: 'S', label: 'Savings' },
  { value: 'IP', label: 'Instant Pay' },
];

export const ddMethods = [
  { value: 'F', label: 'Fixed' },
  { value: 'P', label: 'Percent' },
  { value: 'FS', label: "Fixed, skip if can't take full amount" },
  { value: 'PN', label: 'Percentage of net after fixed' },
  { value: 'B', label: 'Balance' },
];

export enum ConfigFlags {
  SHOW_CALENDAR_BIRTHDAYS = 'show_calendar_birthdays',
  HIDE_ANNIVERSARIES = 'hide_anniversaries',
  USER_DEFINED_FIELDS_ENABLED = 'user_defined_fields_enabled',
  HIDE_COMPANY_DIRECTORY = 'hide_company_directory',
}

export enum BonusTaxWithholdingRequestStatuses {
  ASSIGNED = 'assigned',
  SIGNED = 'signed',
}

export const QUICKHIRE_COOKIE = 'streamlined_quickhire';

export const PRODUCT_UPDATES_READ_KEY = 'product_updates_read_oct_2025';

export const WIZARD_STEPS = [
  'Upload file',
  'Review & validate',
  'Submit',
] as const;
