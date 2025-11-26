// Define all application paths in one place to avoid circular dependencies
export const paths = {
  // Public routes (no auth required)
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  forgotEmail: '/forgot-email',
  resetPassword: '/reset-password',
  logout: '/logout',
  startNewHire: '/start',

  // Auth-only routes (basic auth wrapper, no main layout)
  updatePassword: '/auth/update-password',
  prismLogout: '/auth/prism/logout',

  // Main authenticated routes
  root: '/',
  dashboard: '/dashboard',

  // Admin routes
  adminCompanyConfig: '/admin/company/config',
  adminDirectory: '/admin/employees',
  adminUserPermissions: '/admin/user-permissions',
  adminRequestUserAccess: '/admin/user-permission/requests',
  adminRequestUserAccessNew: '/admin/user-permission/new',
  adminApproveTimeOff: '/admin/pto-requests',
  adminPayroll: '/admin/payroll',
  adminHiring: '/admin/hiring',
  adminHandbooks: '/admin/handbooks',
  adminCustomFields: '/admin/custom-fields',
  adminBonusTaxWithholding: '/admin/bonus-tax-withholding',
  adminBonusTaxWithholdingAssign: '/admin/bonus-tax-withholding/assign',

  // Manager routes
  managerEmployees: '/manager/employees',

  // Benefits routes
  benefits: '/benefits',
  benefitsEnrollment: '/benefits/enrollment',
  enrollmentDashboard: '/benefits/enrollment-dashboard',
  openEnrollment: '/benefits/open',
  directBenefitsEnrollment: '/benefits/direct-enrollment',
  thrivepassEnrollment: '/benefits/thrivepass',
  beneficiaries: '/benefits/beneficiaries',

  // Company routes
  calendar: '/company/calendar',
  directory: '/company/directory',
  orgChart: '/company/org-chart',

  // Payroll routes
  payroll: '/payroll/history',
  directDeposit: '/payroll/direct-deposit',
  employeeBonusTaxWithholding: '/payroll/bonus-tax-withholding',
  employeeBonusTaxWithholdingSign: '/payroll/bonus-tax-withholding/sign',
  taxWithholding: '/payroll/tax-withholding',
  taxWithholdingForm: '/payroll/tax-withholding/update',
  w2: '/payroll/w2',

  // Profile routes
  profile: '/profile',

  // Handbook routes
  employeeHandbooks: '/handbooks',

  // Time off routes
  approvals: '/approvals',
  timeOff: '/time-off',
  timeOffRequest: '/time-off/:requestId',
  requestTimeOff: '/time-off/request',

  // Time tracking routes
  swipeclockTimeCard: '/attendance/time-card',
  swipeclockSchedulePto: '/attendance/pto',

  // New hire routes
  newHire: '/new-hire',
  newHireQuick: '/new-hire/quick-hire',
  newHires: '/new-hires',
  quickHireBulkImport: '/new-hires/bulk-import/quick-hire',
  prehireBulkImport: '/new-hires/bulk-import/prehire-completion',

  // Onboarding routes
  onboarding: '/onboarding',
  startOnboarding: '/onboarding/start',
  onboardingWrapper: '/onboarding/continue',
  onboardingRedirect: '/onboarding/redirect',
  enrollmentWrapper: '/onboarding/enrollment',

  // Other routes
  prismRedirect: '/prism/redirect',
  prismNewTab: '/back-office/redirect',
  prismEnrollment: '/benefits/enrollment/',
} as const;
