export enum PrismUserRole {
  WSMPTORT = 'WSMPTORT', // worksite manager with pto and pay rate
  WSMPTO = 'WSMPTO', // worksite manager with pto
  PRISMTALENTMGT = 'PRISMTALENTMGT',
}

// Report Center access roles
export const REPORT_CENTER_ROLES = new Set([
  // Administrative roles
  'ACCTADMIN',
  'ACCTMGR',
  'HRADMIN',
  'HRMGR',
  'HRTECH',
  'PRMGR',
  'PRMGRACCADM',
  'SUPERUSER',
  // Business unit roles
  'BENADMIN',
  'BENMGR',
  'BENEFITSONLY',
  'SRPAYMGR',
  'WSMGRREPORTS',
  'WSMMGRHR',
  'WSMMGRPAYROLL',
  // Worksite manager roles
  'WSMAL401KDedReg',
  'WSMALLPROSPR',
  'WSMALLwW2',
  'WSMFULLAC',
  'WSMFULLAC401KC',
  'WSMFULLACNOPTO',
  'WSMINQUIRY',
  'WSMINT_REPORTS',
  'WSMNO401K',
  'WSMNOPAYACCESS',
  // Special access roles
  'AccessReportsOn',
  'BrokerAccessWTA',
  'CLDIRECTOR',
  'Consultants',
  'Financereporton',
  'IMPLEMMANAGER',
  'KWManager',
  'RETIERADMIN',
  'Reportctrnew',
  'RptInqSerProvd',
  'SALESMGR',
  'Stoiclane',
  'StoiclaneLimit',
  'Tax&Treasury',
  'ffc',
]);

export const USER_ROLE_DESCRIPTIONS: Record<
  string,
  { desc: string; type: string }
> = {
  AccessReportsOn: {
    desc: 'Access to Reports Only',
    type: 'ROLE.AccessReportsOn',
  },
  BrokerAccessWTA: {
    desc: 'Broker Access (Worksite Trusted Advisor)',
    type: 'ROLE.BrokerAccessWTA',
  },
  CONFIDENTIAL: {
    desc: 'ACCESS TO EMPLOYEE CONFIDENTIAL DOCS',
    type: 'ROLE.CONFIDENTIAL',
  },
  CSS: { desc: 'Self Service Payroll', type: 'ROLE.CSS' },
  EVERIFY: { desc: 'E-VERIFY', type: 'ROLE.EVERIFY' },
  EmployeesNoRate: {
    desc: 'Employees Information but no Rates',
    type: 'ROLE.EmployeesNoRate',
  },
  Financereporton: {
    desc: 'Financial reports only',
    type: 'ROLE.Financereporton',
  },
  Informer: { desc: 'Informer', type: 'ROLE.Informer' },
  KWManager: { desc: 'KW Manager', type: 'ROLE.KWManager' },
  PRISMTALENTMGT: {
    desc: 'Prism Talent Management Manager',
    type: 'ROLE.PRISMTALENTMGT',
  },
  PTOAPP: { desc: 'PTO Approval Only', type: 'ROLE.PTOAPP' },
  Reportctrnew: { desc: 'Report Center New', type: 'ROLE.Reportctrnew' },
  TIMECO: { desc: 'TIMECO', type: 'ROLE.TIMECO' },
  'Time and Labor': {
    desc: 'Time and Labor Manager',
    type: 'ROLE.Time and Labor',
  },
  TimeEntryNoPay: {
    desc: 'Timesheet Entry with no pay rates',
    type: 'ROLE.TimeEntryNoPay',
  },
  W2: { desc: 'W2 Access', type: 'ROLE.W2' },
  WKSiteNPwithTS: {
    desc: 'Worksite With No Pay with TimeSheet',
    type: 'ROLE.WKSiteNPwithTS',
  },
  WKsiteNPNoTS: {
    desc: 'Worksite With No Pay rate and No Time sheet',
    type: 'ROLE.WKsiteNPNoTS',
  },
  WKtrustedAdvLm: {
    desc: 'WorkSite Trusted Advisor Limited Access',
    type: 'ROLE.WKtrustedAdvLm',
  },
  WSBENEITONLY: {
    desc: 'Worksite Benefit Access only',
    type: 'ROLE.WSBENEITONLY',
  },
  WSMADDPTO: {
    desc: 'Worksite Manager EE Address & PTO Approval Only',
    type: 'ROLE.WSMADDPTO',
  },
  WSMAL401KDedReg: {
    desc: 'Worksite with 401K enrollment and Deduction Regist',
    type: 'ROLE.WSMAL401KDedReg',
  },
  WSMALL: { desc: 'Worksite Manager All Functions', type: 'ROLE.WSMALL' },
  WSMALL401Kadd: {
    desc: 'WS Manager with 401K access',
    type: 'ROLE.WSMALL401Kadd',
  },
  WSMALLCASH: { desc: 'WSMALLCASH', type: 'ROLE.WSMALLCASH' },
  WSMALLPROSPR: {
    desc: 'WSM all with Process payroll',
    type: 'ROLE.WSMALLPROSPR',
  },
  WSMALLW2401K: {
    desc: 'WORKSITE MANGER WITH W2 AND RETIREMENT',
    type: 'ROLE.WSMALLW2401K',
  },
  WSMALLproxy: { desc: 'WSMALLproxy', type: 'ROLE.WSMALLproxy' },
  WSMALLwW2: {
    desc: 'Worksite Manager with W2 access',
    type: 'ROLE.WSMALLwW2',
  },
  WSMALLwithPJacc: {
    desc: 'WSMALL with PJ access',
    type: 'ROLE.WSMALLwithPJacc',
  },
  WSMALLwithSchPa: {
    desc: 'Manager with Schedule Payment access for RBT',
    type: 'ROLE.WSMALLwithSchPa',
  },
  WSMATS: { desc: 'WSM ATS Hiring Thing', type: 'ROLE.WSMATS' },
  WSMDATARETRIV: {
    desc: 'Worksite Manager Data Retriever',
    type: 'ROLE.WSMDATARETRIV',
  },
  WSMDOCU: { desc: 'Worksite Manager Document', type: 'ROLE.WSMDOCU' },
  WSMFULLAC: {
    desc: 'Worksite Manager Full Access 401K Inquire',
    type: 'ROLE.WSMFULLAC',
  },
  WSMFULLAC401KC: {
    desc: 'Worksite Manager Full Access with Client 401K',
    type: 'ROLE.WSMFULLAC401KC',
  },
  WSMFULLACNOPTO: {
    desc: 'Worksite Manager Full Access 401K Inquire NO PTO',
    type: 'ROLE.WSMFULLACNOPTO',
  },
  WSMGRREPORTS: {
    desc: 'Work Site Manager Reports Only',
    type: 'ROLE.WSMGRREPORTS',
  },
  WSMHRNOPRT: {
    desc: 'Worksite Manager No Payrate and Time sheet',
    type: 'ROLE.WSMHRNOPRT',
  },
  WSMI9: { desc: 'WorksiteManager I9 only', type: 'ROLE.WSMI9' },
  WSMINQUIRY: {
    desc: 'Worksite Manager Inquiry Only',
    type: 'ROLE.WSMINQUIRY',
  },
  'WSMINQUIRY+PTO': {
    desc: 'Worksite Manager Limited Inquiry & PTO App. Only',
    type: 'ROLE.WSMINQUIRY+PTO',
  },
  WSMINT_REPORTS: { desc: 'Interactive Reports', type: 'ROLE.WSMINT_REPORTS' },
  WSMINVOICE: { desc: 'INVOICE VIEW', type: 'ROLE.WSMINVOICE' },
  WSMLIMITED: { desc: 'Work site MGR with limits', type: 'ROLE.WSMLIMITED' },
  WSMMGRHR: { desc: 'Worksite Manager with HR', type: 'ROLE.WSMMGRHR' },
  WSMMGRHRATEINQ: {
    desc: 'Worksite Manager Pay Rate Inquiry Only',
    type: 'ROLE.WSMMGRHRATEINQ',
  },
  WSMMGRPAYROLL: {
    desc: 'Worksite Manager Payroll Only',
    type: 'ROLE.WSMMGRPAYROLL',
  },
  WSMNO401K: {
    desc: 'Worksite Manager with NO 401K Access',
    type: 'ROLE.WSMNO401K',
  },
  WSMNODD: { desc: 'WSM With No DD and', type: 'ROLE.WSMNODD' },
  WSMNOPAYACCESS: {
    desc: 'Worksite Manager with No Time Sheet Access.',
    type: 'ROLE.WSMNOPAYACCESS',
  },
  WSMNOPAYRATE: {
    desc: 'WMS With No Payrate by Department',
    type: 'ROLE.WSMNOPAYRATE',
  },
  WSMNOTSPYDD: {
    desc: 'Worksite Manager no Payroll information',
    type: 'ROLE.WSMNOTSPYDD',
  },
  WSMOB: { desc: 'Worksite Manager Onboarding', type: 'ROLE.WSMOB' },
  WSMPASS: { desc: 'Worksite Manager Change Passwords', type: 'ROLE.WSMPASS' },
  WSMPAYRPTS: {
    desc: 'Work Site Manager Payroll Reports Only no SSN',
    type: 'ROLE.WSMPAYRPTS',
  },
  WSMPROCESSPR: {
    desc: 'Worksite Manager Process Payroll',
    type: 'ROLE.WSMPROCESSPR',
  },
  WSMPRPTO: { desc: 'Payroll & PTO only', type: 'ROLE.WSMPRPTO' },
  WSMPTO: { desc: 'Just PTO', type: 'ROLE.WSMPTO' },
  WSMPTOABSENCE: {
    desc: 'WorkSite Manager with PTO Emp Absence',
    type: 'ROLE.WSMPTOABSENCE',
  },
  WSMPTOADJ: {
    desc: 'Worksite Manager PTO Adjustment Option',
    type: 'ROLE.WSMPTOADJ',
  },
  WSMPTOAPP: {
    desc: 'Worksite manager PTO Approval only',
    type: 'ROLE.WSMPTOAPP',
  },
  WSMPTORT: {
    desc: 'Worksite Manager with PTO and Pay Rate',
    type: 'ROLE.WSMPTORT',
  },
  WSMPYCASHRPT: {
    desc: 'Worksite Manager Payroll Cash Report ONly',
    type: 'ROLE.WSMPYCASHRPT',
  },
  WSMREHIRE: { desc: 'Worksite Manager Rehire Only', type: 'ROLE.WSMREHIRE' },
  WSMRETIRE: { desc: 'WSM RETIREMENT', type: 'ROLE.WSMRETIRE' },
  WSMRPTNOPRT: {
    desc: 'Worksite Manager Reports only with no Pay Rates',
    type: 'ROLE.WSMRPTNOPRT',
  },
  WSMTIMEWRA: {
    desc: 'Work Site Manager TimeSheet With Rates',
    type: 'ROLE.WSMTIMEWRA',
  },
  WSMTSENTRY: { desc: 'Timesheet entry', type: 'ROLE.WSMTSENTRY' },
  WSMWC: { desc: 'WSM WORKERS COMP REPORT', type: 'ROLE.WSMWC' },
  WSMwithNHTMDOC: {
    desc: 'Worksite Manager with New Hire Term & Documents',
    type: 'ROLE.WSMwithNHTMDOC',
  },
  WSNODDPayTxIn: {
    desc: 'Worksite NoDD Pay and Tax Inquiry',
    type: 'ROLE.WSNODDPayTxIn',
  },
  WorksiteNoPayIn: {
    desc: 'Worksite Employee with No pay info access',
    type: 'ROLE.WorksiteNoPayIn',
  },
};

// User Access Role Constants
export const PRIMARY_ROLES = {
  FULL_ACCESS: 'Full Access',
  PAYROLL_ONLY: 'Payroll Only',
  BROKER_ACCESS: 'Broker Access',
  HR_ONLY: 'HR Only',
  PTO_ONLY: 'PTO Only (Direct Reports)',
  FINANCIAL_REPORTS_ONLY: 'Financial Reports Only',
} as const;

export type PrimaryRole = (typeof PRIMARY_ROLES)[keyof typeof PRIMARY_ROLES];

export const HR_ROLES = {
  EMPLOYEE_CONFIDENTIAL_DOCS: 'Employee Confidential Documents',
  BENEFIT_ENROLLMENT_PROXY: 'Benefit Enrollment Proxy',
  EMPLOYEE_DOCS: 'Employee Documents',
  NEW_HIRE_ENTRY: 'New Hire Entry',
  PTO_ADMIN: 'PTO Administrator (Whole Company)',
  EMPLOYEE_MANAGER_PTO: 'Employee Manager PTO Request',
} as const;

export type HrRole = (typeof HR_ROLES)[keyof typeof HR_ROLES];

export const ADDITIONAL_FUNCTIONALITY = {
  PAY_RATE_ACCESS: 'Pay Rate Access',
  FINANCIAL_REPORTS: 'Financial Reports',
  BENEFIT_ENROLLMENT: 'Benefit Enrollment',
  PTO_MANAGEMENT: 'PTO Management',
} as const;

export type AdditionalFunctionality =
  (typeof ADDITIONAL_FUNCTIONALITY)[keyof typeof ADDITIONAL_FUNCTIONALITY];

export const PAYROLL_ACCESSIBLE_ROLES = [
  PRIMARY_ROLES.FULL_ACCESS,
  PRIMARY_ROLES.PAYROLL_ONLY,
] as const;

export type PayrollAccessibleRole = (typeof PAYROLL_ACCESSIBLE_ROLES)[number];

export const PAY_RATE_ACCESSIBLE_ROLES = [
  PRIMARY_ROLES.FULL_ACCESS,
  PRIMARY_ROLES.PAYROLL_ONLY,
  PRIMARY_ROLES.FINANCIAL_REPORTS_ONLY,
] as const;

export type PayRateAccessibleRole = (typeof PAY_RATE_ACCESSIBLE_ROLES)[number];

export const PTO_ROLES = [
  HR_ROLES.PTO_ADMIN,
  HR_ROLES.EMPLOYEE_MANAGER_PTO,
] as const;

export const PAYROLL_ROLES = {
  PAYROLL_APPROVER: 'Payroll Approver',
  PAYROLL_ADMINISTRATOR: 'Payroll Administrator',
  PAYROLL_VIEWER: 'Payroll Viewer',
} as const;

export type PtoRole = (typeof PTO_ROLES)[number];
