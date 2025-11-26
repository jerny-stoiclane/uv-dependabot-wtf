type Nullable<T> = T | null;

type ApiResponse<T> = {
  results: T;
  success?: boolean;
  start?: number;
  per_page?: number;
  total?: number;
  detail?: PydanticError; // pydantic errors, need to consolidate this
};

type PydanticError = {
  loc: string[];
  msg: string;
  type: string;
};

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

type YesNoAbbreviatedString = 'Y' | 'N';

type CommonNameFields = {
  first_name: string;
  last_name: string;
  nickname?: string;
};

type PrehireFields = {
  fields: PrehireField[];
  emp_numbers_used: boolean;
  auto_emp_number: boolean;
};

type PrehireField = {
  field_name: string;
  required_for_hire: bool;
  required_for_electronic_onboarding: bool;
};

type BirthdayPermission = {
  show_calendar_birthdays: boolean;
  employee_id: string;
};

type MaritalData = {
  marital_status: YesNoAbbreviatedString;
  married_date: string | null;
};

type HealthData = {
  smoker: YesNoAbbreviatedString;
  handicapped: YesNoAbbreviatedString;
  blind: YesNoAbbreviatedString;
  deceased: boolean;
  deceased_date: string;
  miscellaneous: unknown;
};

type Address = {
  address_line_1?: string;
  address_line_2?: string;
  zipcode?: string;
  country?: string;
  county?: string;
  city: string;
  state: string;
};

type DriverInformation = {
  auto_policies: unknown[];
  vehicle_details: unknown[];
  license_id: string;
  license_class: string;
  license_expiration: string;
  license_state: string;
};

type MilitaryStatus = {
  veteran: YesNoAbbreviatedString;
  vietnam_veteran: YesNoAbbreviatedString;
  disabled_veteran: YesNoAbbreviatedString;
  other_protected_veteran: YesNoAbbreviatedString;
  recently_separated_veteran: YesNoAbbreviatedString;
  service_medal_veteran: YesNoAbbreviatedString;
};

type Miscellaneous = {
  hrp_citizenship_country: string;
  ohio_form_c112: boolean;
  unincoporated_residence: boolean;
  skills_and_education: unknown;
  compensation_restricted: unknown;
  legacy_employee_id: string;
  hispanic: boolean;
  agriculture_worker: boolean;
  absence_journal_ids: unknown[];
  benefit_enrollment_completed: boolean;
  checksum: string;
  person_checksum: string;
  ethnic_code: string;
  cobra_ssn: string;
  override_geo_code: string;
  override_geo_code_end_date: string;
  preferred_language: string;
  scheduled_deduction: unknown;
  new_hire_questions: unknown[];
};

type UserMetadata = {
  streamlined_quickhire?: boolean;
  prehire?: boolean;
  prism_client_id?: string;
  prism_user_id?: string;
};

type Auth0User = {
  sub?: string;
  email_verified?: boolean;
  email?: string;
  name?: string;
  avatar?: string;
  picture?: string;
  roles?: string[];
  hcm_roles?: string[];
  is_admin?: boolean;
  is_manager?: boolean;
  is_swipeclock_enabled?: boolean;
  is_swipeclock_enabled_no_clock?: boolean;
  is_armhr_pto_enabled?: boolean;
  is_access_request_enabled?: boolean;
  is_hiring_enabled?: boolean;
  is_work_email_enabled?: boolean;
  is_bonus_tax_withholding_enabled?: boolean;
  is_bulk_import_new_hires_enabled?: boolean;
  user_metadata?: UserMetadata;
};

interface MFAAuthenticator {
  id: string;
  type: string;
  confirmed: boolean;
  name?: string;
  created_at: string;
  last_auth_at?: string;
}
type User = Auth0User & UserProfile;

type Absence = {
  absence_code: string;
  absence_date: string;
  absence_type: string;
  accrued_hours: string;
  accrued_through: null;
  carry_over_hours: string;
  comment: string;
  employee_id: string;
  hours: string;
  notes?: string;
  id: string;
  is_paid: 'Y' | 'N' | '';
  pto_type: string;
};

type PtoPlan = {
  type: string;
  id: string;
  calculation_basis: 'F' | 'FH' | 'M' | 'HH' | 'HM' | 'UL';
  description: string;
  accrued: boolean;
  total_hours: string;
  used_hours_ytd: string;
  end_date: string;
  last_carry_over: string;
  benefit_start: string;
  carry_over_hours: string;
  carry_over_expires: string;
  absences: Absence[];
  stop_pto_accruals: boolean;
  accrued_hours_ytd: string;
  accrued_through: string;
  enable_in_ep: boolean;
};

type PtoRequestBody = {
  action: 'C' | 'A' | 'D';
  pto: PtoRequest;
  reason?: string;
};

type PtoHourInfo = {
  planned_hours: number;
  taken_hours: number;
  total_accrued_hours: number;
  carry_over_hours: number;
  available_hours: number;
};

type PtoStatus = 'A' | 'C' | 'N' | 'P';

type PtoRequest = {
  id: string;
  start: string;
  end: string;
  leave_type: string;
  comment: string;
  status: PtoStatus;
  details: {
    date: string;
    hours: string;
  }[];
  reason: string;
  name?: string;
  requested_by?: string;
  vouchers: string[];
  leave_dates: string[];
  employee_id?: string;
  total_hours?: number;
  register_type_code?: string;
};

type PtoApprovalCount = {
  count: int;
};

type PtoClass = {
  id: string;
  description: string;
};

type PayrollSummary = {
  issue_date: string;
  check_number?: string;
  gross_wages: number;
  net_wages: number;
  taxes: number;
  deductions: number;
  other_deductions?: number;
};

type UpcomingPayDate = {
  pay_date: string | null;
  days_until_pay: number | null;
};

type PayrollSummaryBody = {
  year?: string;
};

type TaxWithholding = {
  description: string;
  taxable_amount: number;
  amount_withheld: number;
  over_limit: number;
};

type FederalTaxInformation = {
  filing_status: string;
  withhold_allowance: string;
  override_type: string;
  override_amt: string;
  tax_calc: string;
  multiple_jobs: boolean;
  dependents: string;
  other_income: string;
  deductions: string;
  w5_year: string;
  w5_filed: boolean;
  w4_filed: boolean;
  w4_year: string;
};

type I9TaxInformation = {
  i9_id_auth_name: string;
  i9_id_doc_num: string;
  i9_id_doc_exp_date: string;
  i9_elig_auth_name: string;
  i9_elig_doc_num: string;
  i9_elig_doc_exp_date: string;
  form_i9_filed: boolean;
  form_i9_renew_date: string;
  i9_image_audit: {
    audit_date: string;
    audit_user: string;
    audit_id: string;
    audit_step: string;
  }[];
};

type StateTaxInformation = {
  state_code: string;
  non_res_cert_filed: string;
  primary_allowance: string;
  secondary_allowance: string;
  exempt_amount: string;
  suppl_exempt_amount: string;
  override_type: string;
  override_amount: string;
  reduce_addl_withholding: string;
  fixed_withholding: string;
  alternate_calc: string;
  state_w4_filed: string;
  state_w4_year: string;
  multiple_jobs: boolean;
  dependents: {
    amount: string;
    currency: string;
  };
  other_income: {
    amount: string;
    currency: string;
  };
  deductions: {
    amount: string;
    currency: string;
  };
  non_res_cert_year: string;
  filing_status: string;
};

type LocalTaxInformation = {
  auth_id: string;
  filing_status: string;
  primary_allowance: string;
  non_res_cert: string;
  addl_withheld: string;
};

type CitizenshipStatusCode = 'Z01' | 'Z02' | 'Z03' | 'Z04';

type CitizenshipStatusLabelMap = {
  Z01: 'A citizen of the United States';
  Z02: 'A noncitizen national of the United States';
  Z03: 'A lawful permanent resident';
  Z04: 'An alien authorized to work';
};

type MaritalStatusCode = 'S' | 'M' | 'D' | 'W' | 'C' | 'O';

type MaritalStatusLabelMap = {
  S: 'Single';
  M: 'Married';
  D: 'Divorced';
  W: 'Widowed';
  C: 'Civil Union';
  O: 'Other';
};

type GenderCode = 'M' | 'F' | 'X' | 'D';

type GenderLabelMap = {
  M: 'Male';
  F: 'Female';
  X: 'Non-binary';
  D: 'Decline to state';
};

type FedFilingStatusCode = 'SS' | 'MJ' | 'H';

type FedFilingStatusLabelMap = {
  SS: 'Single';
  MJ: 'Married filing jointly';
  H: 'Head of household';
};

type TaxInformation = {
  pay_group: string;
  pay_period: string;
  default_hours: string;
  pay_method: string;
  allocation_template_id: string;
  standard_hours: string;
  hourly_pay: string;
  salary: string;
  work_shift: string;
  w2_election_form: boolean;
  paid_thru_date: string;
  eic_file_status: string;
  hourly_pay_rate: number;
  hourly_pay_period: string;
  deliver_check_home: boolean;
  auto_accept_time_sheet: boolean;
  long_pay_table: string;
  long_basis_date: string;
  annual_pay: number;
  effective_date: string;
  comp_review_next_date: string;
  last_change_pct: string;
  last_change_amt: string;
  last_pay_date: string;
  quartile: string;
  compa_ratio: string;
  benefits_base_pay: string;
  per_diem_pay: string;
  tax_credit_emp: true;
  auto_pay_code: string;
  pension_status: string;
  profit_sharing: string;
  wage_plan_ca: boolean;
  identification_document: string;
  eligibility_document: string;
  notes: string;
  fica_exempt: boolean;
  benefits_per_hour: string;
  pay_rate2: string;
  pay_rate3: string;
  pay_rate4: string;
  pay_change_last_date: string;
  override_work_geocode: string;
  family_member_mi: string;
  probation_code_mo: string;
  electronic_pay_stub: boolean;
  health_ins_vt: boolean;
  last_worked_date: string;
  irs_lock_in_date: string;
  non_res_alien: boolean;
  alien_reg_exp_date: string;
  benefit_salary: string;
  citizenship_status: CitizenshipStatusCode;
  first_pay_period_hours: string;
  provider_notified_on: string;
  federal_tax_info: FederalTaxInformation;
  i9_tax_info: I9TaxInformation;
  performance_review_info: {
    perf_review_last_date: string;
    perf_review_next_date: string;
    perf_review_last_rating: string;
    perf_review_last_title: string;
    perf_agreement: boolean;
  };
  pay_period_info: {
    period_code: string;
    period_base: string;
  }[];
  pay_allocation: {
    location_code: string;
    percent: string;
    job: string;
    dept_code: string;
    project: string;
    division: string;
  }[];
  state_tax: StateTaxInformation[];
  state_w4_params: array[];
  local_tax: LocalTaxInformation[];
  alt_pay_rate: string[];
  ee_image: {
    master_id: string;
    verify_date_time: string;
    verify_user_id: string;
  }[];
  lock_ins: {
    state: string;
    state_date: string;
    auth_user: string;
  }[];
  checksum: string;
};

type OtherDeduction = {
  other_deduct_code: string;
  other_deduct_description: string;
  other_deduct_amount: number;
  other_deduct_one_time_switch: string;
};

type PretaxDeduction = {
  description: string;
  amount_deducted: number;
  union_id: string;
};

type PayrollVoucher = {
  id: string;
  type: 'R' | 'V' | 'S' | 'A' | 'J';
  summary: PayrollSummary;
  pay_period: string;
  pay_period_start: string;
  earning: PayrollEarning[];
  pay_period_end: string;
  taxes: TaxWithholding[];
  pretax_deductions: PretaxDeduction[];
  other_deductions: OtherDeduction[];
};

type PayrollEarning = {
  pay_code: string;
  pay_class: string;
  pay_class_description: string;
  charge_date: string;
  hours_units: number;
  hours_worked: number;
  unit_rate: number;
  pay_amount: number;
  division: string;
  job_code: string;
  shift: string;
  department: string;
  location: string;
  gl_code: string;
  work_comp: string;
  proj_work: string;
  proj_phase: string;
};

type TableSort = {
  key: string;
  order: 'asc' | 'desc';
};

type UpdateEmergencyContactResponse = {
  updateMessage: string | null;
  errorCode: string;
  errorMessage: string;
  extension: null;
};

type UpdateEmergencyContactsPayload = {
  person_checksum: string;
  emergency_contact: FormikEmergencyContact[];
};

type EmergencyContact = {
  contactRelationship?: string;
  contactName?: string;
  contactInfo?: string;
  contactType?: string;
};

interface FormikEmergencyContact {
  contact_name: string;
  contact_info: string;
  contact_relationship: string;
  contact_type: string;
}

type PayMethodCode = 'S' | 'H' | 'C' | 'D';

type PayMethodLabelMap = {
  S: 'Salary';
  H: 'Hourly';
  C: 'Commission';
  D: 'Driver';
};

type PayRateCode = 'H' | 'W' | 'B' | 'S' | 'M' | 'Y';

type PayRateLabelMap = {
  H: 'Hourly';
  W: 'Weekly';
  B: 'Bi-weekly';
  S: 'Semi-monthly';
  M: 'Monthly';
  Y: 'Yearly';
};

type PayPeriod =
  | 'D'
  | 'W'
  | 'B'
  | 'S'
  | 'M'
  | 'MDNO'
  | 'MDNW'
  | 'MDLW'
  | 'MDAD'
  | 'MDBD'
  | 'A';

type PayPeriodInfo = {
  period_code: PayPeriod;
  period_base: string;
};

type PayAllocation = {
  location_code: string;
  percent: string;
  job: string;
  dept_code: string;
  project: string;
  division: string;
};

type Compensation = {
  last4_ssn?: string;
  pay_method?: 'S' | 'H' | 'C' | 'D';
  pay_period?: PayPeriod;
  pay_period_info?: PayPeriodInfo[];
  annual_pay?: string;
  allocations?: PayAllocation[];
};

type Manager = CommonNameFields & {
  id?: string;
  position?: {
    code?: string;
    employee_title?: string;
    employee_type?: string;
  };
};

type ActiveBenefits = {
  insurance_plans?: boolean;
  pto_plans?: boolean;
};

type BenefitBody = {
  effective_date?: string;
};

type RegisterFormValues = {
  last_name: string;
  identifier_type: 'SSN' | 'EIN';
  identifier: string;
  personal_email: string;
  work_email: string;
  password: string;
  confirm_password: string;
};

type NewHireRequestFormValues = {
  address_line_1: string;
  address_line_2: string;
  benefits_group: string;
  birth_date: string;
  citizenship_status: string;
  email_address: string;
  work_email_address: string;
  emergency_contact_info: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  employee_number?: string;
  employee_status?: string;
  employee_type: string;
  employer_id?: string;
  ethnicity: string;
  department: string;
  shift?: string;
  division: string;
  city: string;
  company_name?: string;
  new_hire_request_id?: number;
  state_code: string;
  zip_code: string;
  fed_allowances: string;
  fed_file_status: string;
  first_name: string;
  gender: string;
  home_phone: string;
  job: string;
  last_name: string;
  location: string;
  manager: string;
  marital_status: string;
  employee_number?: string;
  middle_initial: string;
  mobile_phone: string;
  pay_group: string;
  pay_method: string;
  pay_period: string;
  pay_rate: string;
  project: string;
  ssn: string;
  standard_hours: string;
  start_date: string;
  supervisor: string;
  fed_filing_status: string;
  work_group: string;
  first_pay_period_hours: string;
  auto_time_sheet: string;
  preferred_language: string;
  default_time_sheet_hours?: string;
  preferred_name: string;
};

type PayrollVoucherBody = {
  start?: string;
  end?: string;
  start_page?: number;
  count?: number;
};

type PublicEmployeeProfile = CommonNameFields & {
  id: string;
  email_address?: string;
  work_email_address?: string;
  preferred_pronouns?: string;
  mobile?: string;
  manager?: Manager;
  office_location?: Address;
  reports_to?: string;
  manager_id?: string;
  position?: Position;
  profile_picture?: string;
  birth_date?: string;
  first_hire_date?: string;
};

type EmployeeStatus = 'A' | 'L' | 'T';

type Employer = {
  city: string;
  id: string;
  name: string;
  state: string;
};

type AddressInfo = {
  alt_address: Address;
  checksum: string;
  home_address: Address;
  w2_address: Address;
  unincorporated_residence?: boolean;
  home_geo_code?: string;
};

type PhoneNumbers = {
  home: string;
  mobile: string;
};

type UserEnrollmentStatus = {
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  is_complete: boolean;
  is_enrollment_in_progress?: {
    enrollmentInProgress: boolean;
    enrollmentType: 'BE' | 'LE' | 'OE' | 'AE';
  };
};

type VisibleTaxForms = {
  bonus_tax_forms: boolean;
};

type UserProfile = CommonNameFields & {
  id: string;
  client_id: string;
  login_email?: string;
  entities: ClientEntity[];
  company: Company;
  profile_picture?: string;
  prism_roles?: {
    user_role?: string[];
    human_resource_role?: string[];
  };
  has_handbooks?: boolean;
  has_required_custom_fields?: boolean;

  // NEED TO ADD
  active_benefits?: ActiveBenefits;
  employee_status: EmployeeStatus;
  enrollment_status?: UserEnrollmentStatus;
  prism_active_status: boolean;
  tax_form_visibility?: VisibleTaxForms;
};

type UserProfileWithStatus = UserProfile & OnboardingStatusResponse;

type UserProfileEarlyExit = {
  id: string;
  client_id: string;
  employee_status: EmployeeStatus;
  status?: string;
  prism_active_status: boolean;
};

type UserProfileWithStatusResponse =
  | UserProfileWithStatus
  | UserProfileEarlyExit;

type UserDefinedField = {
  key: string;
  label: string;
  type: 'A' | 'N' | 'D'; // Alphanumeric, Numeric, Date
  mandatory: string;
  value: string;
};

type CustomField = {
  typeId: string;
  fields?: UserDefinedField[];
  checksum: string;
};

// New type for custom field values from profile
type ProfileCustomFieldValue = {
  id: number | null;
  client_id: string;
  prism_user_id: string;
  field_definition_id: number;
  field_value: string | null;
  field_definition: {
    id: number;
    client_id: string;
    field_key: string;
    field_label: string;
    field_type: 'alphanumeric' | 'numeric' | 'date' | 'dropdown';
    is_required: boolean;
    description: string;
    dropdown_values: CustomFieldDropdownValue[];
    created_at: string;
    updated_at: string;
  };
  created_at: string | null;
  updated_at: string | null;
};

type UserDefinedFieldsGetResponse = {
  error_code: string;
  error_message: string;
  extension?: unknown;
  custom_fields?: CustomField[];
};

type UserDefinedFieldUpdate = {
  key: string;
  value: string;
};

type UpdateUserDefinedFieldsPayload = {
  user_defined_fields: UserDefinedFieldUpdate[];
  checksum: string;
};

type EmployeeProfile = CommonNameFields & {
  id: string;
  client_id: string;
  nickname: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  primary_email_source: 'P' | 'W' | '';
  login_email?: string;
  work_email_address?: string;
  email_address?: string;
  active_benefits?: ActiveBenefits;
  birth_date: string;
  enrollment_status: UserEnrollmentStatus;
  entities: ClientEntity[];
  geo_code: string;
  marital_data: MaritalData;
  first_hire_date: string;
  health_data: HealthData;
  address_info: AddressInfo;
  peo_start_date: string;
  school_district: string;
  phone_numbers: PhoneNumbers;
  profile_picture?: string;
  gender: GenderCode;
  gender_identity: string;
  preferred_pronouns: 'H' | 'PDS' | 'PNL' | 'S' | 'TH';
  user_id: string;
  mfa_authenticators?: MFAAuthenticator[];
  driver_information: DriverInformation;
  military_status: MilitaryStatus;
  miscellaneous: Miscellaneous;
  employee_events: unknown;
  employee_status: EmployeeStatus;
  tax_information: TaxInformation;
  emergency_contact: EmergencyContact[];
  direct_deposit: unknown;
  compensation: Compensation;
  parent_id: string;
  position?: Position;
  worksite: Address;
  manager: Manager;
  prism_roles?: {
    user_role?: string[];
    human_resource_role?: string[];
  };
  tax_form_visibility?: VisibleTaxForms;
  has_handbooks?: boolean;
  user_defined_fields?: ProfileCustomFieldValue[];
};

type Position = {
  code?: string;
  department?: string;
  employee_type?: string;
  employee_title?: string;
};

type AccountTypeCode = 'C' | 'S' | 'IP';

type AchVoucher = {
  transit_num: string;
  account_num: string;
  account_type: AccountTypeCode;
  method: 'F' | 'P' | 'FS' | 'PN' | 'B';
  amount: number | string;
  limit: number | string;
  status: 'P' | 'D' | 'I';
  bank_name: string;
  voucher_type_override: string;
};

type DirectDeposit = {
  ach_status: 'A' | 'I';
  voucher_type: 'R' | 'S' | 'V';
  suppress_account_print: true;
  ach_voucher: AchVoucher[];
  checksum: string;
};

type CommittedHire = {
  ssn: string;
  employeeId: string;
};

type PrismPrehire = {
  commitResult: {
    commitError: string;
    committedHire: CommittedHire[];
  };
  errorCode: '0' | '1' | '2';
  errorMessage: string;
};

type PrismRedirectBody = {
  ssoToken: null;
  redirectUrl: string;
  prismUser: null;
  userInfo: null;
  favorite: null;
  errorCode: string;
  errorMessage: string;
  extension: null;
};

type InsurancePlan = {
  id: string;
  name: string;
  active: boolean;
  coverage_start: string;
  coverage_end: string | null;
  deduction_start: string | null;
  deduction_end: string | null;
  employee_contribution: string;
  plan_type: PlanType;
  type: InsuranceType;
  offer_type_code: string;
  carrier_url: string | null;
  plan_desc_url: string | null;
  effective_date: string | null;
  details?: any[];
};

type PlanType = 'EPO' | 'PPO' | 'HMO' | 'POS';

type InsuranceType =
  | 'medical'
  | 'dental'
  | 'vision'
  | 'life'
  | 'employee_assistance'
  | 'short_term_disability'
  | 'long_term_disability'
  | 'Accidental Death and Dismemberment'
  | 'Accident Benefits'
  | 'Life Insurance - Basic'
  | 'Gap Insurance'
  | 'Voluntary Hospitalization'
  | 'Ancillary'
  | 'Additional STD'
  | 'Legal'
  | 'Identity Theft'
  | 'Telehealth'
  | 'Cancer Benefits'
  | 'Voluntary Benefits'
  | 'Critical Illness'
  | 'Pet Benefits'
  | 'Basic Life Extra'
  | 'Whole Life'
  | 'Group Term Life'
  | 'Additional LTD'
  | 'Flexible Spending Acct'
  | 'Health Savings Acct'
  | 'Life Insurance - Basic - Spouse Only'
  | 'Life Insurance - Basic - Child Only'
  | 'Commuter'
  | 'Domestic Partner Medical'
  | 'Domestic Partner Dental'
  | 'Domestic Partner Vision'
  | 'Critical Illness as Life'
  | 'Dependent Care FSA'
  | 'Bond';

type Holiday = {
  summary: string;
  start: {
    date: string;
  };
  end: {
    date: string;
  };
};

type HolidayDates = {
  name: string;
  description: string;
  holiday_dates: string[];
};

type PrismTeamContact = {
  name: string;
  email: string;
  phone_numbers: {
    home: string;
    work: string;
    mobile: string;
  };
  title: string;
};

type OrgChartEmployee = CommonNameFields & {
  id: string;
  image_url: string;
  parent_id: string;
  title: string;
  department: string;
};

type CompanyCode = {
  benefit_group_codes?: { id: string; value: string }[];
  citizenship_status_codes?: { id: string; value: string }[];
  project_codes?: { id: string; value: string }[];
  deduction_codes?: { id: string; value: string }[];
  department_codes?: { id: string; value: string }[];
  division_codes?: { id: string; value: string }[];
  shift_codes?: { id: string; value: string }[];
  workgroup_codes?: { id: string; value: string }[];
  location_codes?: { id: string; value: string }[];
  job_codes?: { id: string; value: string }[];
  type_codes?: { id: string; value: string }[];
  pay_group_codes?: { id: string; value: string }[];
  pay_codes?: { id: string; value: string }[];
};

type Company = {
  id: string;
  name: string;
  logo_url?: string;
  config: CompanyConfig[];
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip: string;
  website_url: string;
  main_phone: string;
  division_required: boolean;
  department_required: boolean;
  shift_required: boolean;
  work_group_required: boolean;
  codes?: CompanyCode;
  employees: PublicEmployeeProfile[];
  vw_enabled?: boolean;
  talent_mgt_enabled?: boolean;
};

type ReportId = string;

type ReportRunSchedule = {
  startDate: string;
  endDate: string;
  neverEnds?: boolean;
  frequency?: 'one-time' | string | null;
};

type ReportRunOptions = {
  interactive?: boolean;
  schedule: ReportRunSchedule;
};

type ReportColumnFilter = {
  abbrv: string;
  display_name: string;
};

type ReportColumn = {
  id?: number;
  name: string;
  value: string;
  filters?: ReportColumnFilter[];
  col_type?: string;
  selected?: boolean;
};

type TemplateColumn = {
  id?: number;
  label: string;
  value: string;
  description: string;
  col_type: string;
  filters?: ReportColumnFilter[];
  template_id: number;
};

type ReportRow = {
  [key: string]: string | number;
};

type ReportRun = {
  columns: string[];
  completed_at?: string;
  created_at?: string;
  filters?: ReportColumnFilter[];
  id?: number;
  query?: string;
  report_id?: number;
  report_name?: string;
  result?: ReportRow[];
  run_by?: string;
  scheduled_for?: string;
  template_id?: number;
  template_name?: string;
  template_version?: string;
  available_columns?: TemplateColumn[];
};

type ReportData = {
  id?: number;
  owner_id?: null;
  run_by?: string;
  report_id?: number;
  report_name?: string;
  template_name?: string;
  name?: string; // report title
  title?: string; // template title
  description?: string;
  version?: string;
  template_id?: number;
  template_version?: string;
  columns: ReportColumn[];
  available_columns: TemplateColumn[];
  selected_filters?: CreateReportFilter[];
  selected_columns: string[];
  filters?: ReportColumnFilter[];
  result?: ReportRow[];
  created_at?: string;
  completed_at?: string;
  scheduled_for?: string | null;
  query?: string;
  deprecated_at?: string | null;
};

type ReportTemplate = {
  id: string;
  user_id: number;
  title: string;
  version: string;
  description: string;
  template_id: number;
  template_description: string;
  columns: string[];
  example: ReportRow[];
  reports: [];
  column_info: TemplateColumn[];
};

type CreateReportFilter = {
  id?: number;
  abbrv: string;
  ctype: string;
  value: string;
  column_name: string;
};

type OnSubmitScheduleProps = {
  frequency: string;
  startDate: Date | null;
  endDate: Date | null;
  neverEnds: boolean;
};

type ReportSchedule = {
  run_id?: number;
  schedule?: {
    anchor_datetime?: string;
    created_at?: string;
    end_datetime?: string;
    report_id: number;
    schedule_interval?: number;
  };
};

type PasswordRequirement = {
  text: string;
  valid?: boolean;
  validation: (password: string, children?: PasswordRequirement[]) => boolean;
  children?: PasswordRequirement[];
};

type ProfileFormValues = CommonNameFields & {
  id?: string;
  address_info?: AddressInfo;
  worksite?: Address;
  first_hire_date?: string;
  middle_initial?: string;
  user_id?: string;
  primary_email_source?: string;
  email_address?: string;
  manager?: Manager;
  work_email_address?: string;
  position?: Position;
  employee_status?: string;
  gender_identity?: string;
  preferred_pronouns?: string;
  emergency_contact?: EmergencyContact[];
  phone_numbers?: PhoneNumbers;
  miscellaneous?: Miscellaneous;
  gender?: string;
  birth_date?: string;
  compensation?: Compensation;
  user_defined_fields?: ProfileCustomFieldValue[];
};

type NavItemType = {
  breadcrumbs?: boolean;
  caption?: ReactNode | string;
  children?: NavItemType[];
  elements?: NavItemType[];
  chip?: any;
  state?: object;
  onClick?: () => void;
  isVisible?: ((user: User) => boolean) | boolean;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'default' | undefined;
  disabled?: boolean;
  external?: boolean;
  icon?: GenericCardProps['iconPrimary'] | string;
  id?: string;
  search?: string;
  target?: boolean;
  title?: ReactNode | string;
  titleContent?: ReactNode | string;
  type?: string;
  url?: string | undefined;
};

type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

type DialogState = {
  action?: () => void;
  confirmText?: string;
  cancelText?: string;
  message?: string | React.ReactNode;
  renderChildren?: () => React.ReactNode;
  title?: string;
  color?: 'primary' | 'error';
};

enum NewHireRequestState {
  CREATED = 'created',
  USER_PARTIAL_COMPLETE = 'user_partial_complete',
  USER_REGISTRATION = 'user_registration',
  USER_PRISM_ONBOARDING = 'user_prism_onboarding',
  COMPLETE = 'complete',
}

type NewHireRequestForm = {
  first_name: string;
  last_name: string;
  email: string;
  manager_id?: string;
};

type NewHireRequestPrehireForm = {
  new_hire_request_id: number;
  client_id: string;
  email?: string;
  ssn?: string;
  // Personal fields
  first_name?: string;
  last_name?: string;
  middle_initial?: string;
  preferred_name?: string;
  birth_date?: string;
  gender?: string;
  marital_status?: string;
  ethnicity?: string;
  preferred_language?: string;
  personal_email?: string;
  work_email?: string;
  home_phone?: string;
  mobile_phone?: string;
  // Address fields
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state_code?: string;
  zip_code?: string;
  // Emergency contact
  emergency_contact_name?: string;
  emergency_contact_info?: string;
  emergency_contact_relationship?: string;
  // Employment fields
  location?: string;
  job?: string;
  department?: string;
  division?: string;
  shift?: string;
  start_date?: string;
  employee_type?: string;
  benefits_group?: string;
  employee_number?: string;
  supervisor?: string;
  manager?: string;
  project?: string;
  work_group?: string;
  // Pay fields
  pay_group?: string;
  pay_method?: string;
  pay_rate?: string;
  pay_period?: string;
  standard_hours?: string;
  default_time_sheet_hours?: string;
  first_pay_period_hours?: string;
  auto_time_sheet?: string;
  // Tax fields
  fed_filing_status?: string;
  fed_allowances?: string;
  citizenship_status?: string;
};

type NewHireRequest = {
  id?: number;
  client_id?: string;
  intake_employee_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  personal_email?: string;
  work_email?: string;
  home_phone?: string;
  birth_date?: string;
  gender?: string;
  ssn?: string;
  has_ssn?: boolean;
  has_birth_date?: boolean;
  has_gender?: boolean;
  fsm_state: NewHireRequestState;
  created_at?: string;
  updated_at?: string;
  preferred_name?: string;
};

type EmployeeConfig = {
  id?: number;
  employee_id: string;
  flag: string;
  value: boolean;
};

type CompanyConfig = {
  id?: number;
  client_id: string;
  flag: string;
  data: any;
  value: boolean;
};

type Config = {
  show_company_logo: boolean;
  show_calendar_birthdays: boolean;
  new_hire_work_email: boolean;
  show_org_chart: boolean;
  show_custom_link: boolean;
  redirect_pto_approvals?: boolean;
  show_bonus_tax_withholding: boolean;
  armhr_pto_enabled: boolean;
  bulk_import_new_hires_enabled: boolean;
  fsa_commuter_enrollment_enabled: boolean;
  hide_backoffice: boolean;
  swipeclock_enabled: boolean;
  swipeclock_enabled_no_clock: boolean;
  everify_enabled: boolean;
  user_defined_fields_enabled: boolean;
  hide_company_directory: boolean;
};

type CompanyConfigFlag = keyof Config;

type CompanyConfigUpdate = {
  client_id: string;
  flag: string;
  value: boolean | string;
};

type OnboardingStatusResponse = {
  url?: string;
  status:
    | 'benefit_enrollment_incomplete'
    | 'benefit_enrollment_prehire_onboarding_complete'
    | 'benefit_enrollment_complete';
};

type ClientEntity = {
  id?: string;
  client_id: string;
  client_name?: string; // TODO: legacy support, remove after new dashboard
  name: string;
};

interface AppNotification {
  type:
    | 'ptoRequestSummary'
    | 'profileCompletion'
    | 'openEnrollment'
    | 'productUpdates'
    | 'signHandbook';
  secondaryText: string;
  primaryText: string;
  icon: React.ReactNode;
  onClickPath?: string;
  onClick?: () => void;
  iconColor?: string;
  iconBgColor?: string;
  expiresAt?: date;
  excludeFromCount?: boolean;
}

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  classNames: string[];
  type: string;
  name?: string;
  [key: string]: any;
}

interface EnrollmentEmployee {
  prism_client_id: string;
  prism_employee_id: string;
  prism_employee_first_name: string;
  prism_employee_last_name: string;
  prism_employee_email_address: string;
  prism_employee_work_email_address: string;
  prism_employee_primary_email_source: string;
  prism_employee_home_phone: string;
  prism_employee_mobile_phone: string;
  armhr_enrollment_status: EnrollmentStatus;
}

type EnrollmentStatus = 'not_started' | 'in_progress' | 'completed';

type FieldListItem = {
  fieldId: string;
  fieldDefault: string[];
};

type ConfForm = {
  fieldList: FieldListItem[];
};

type SectionData = {
  effective: string;
  policy: string;
  covers: string[];
  cost: string;
};

type Section = {
  headers: { [key: string]: string };
  data: SectionData[];
  waived?: string;
};

type EmployeeInfo = {
  employeeName: string;
  confirmCode: string;
  employeeId: string;
  confirmDate: string;
  IP: string;
};

type EnrollmentConfirmation = {
  periodType: string;
  employeeAddress: string[];
  employeeInfo: EmployeeInfo;
  confForm: ConfForm;
  totalCost: string;
  MED?: Section;
  DEN?: Section;
  VIS?: Section;
  STD?: Section;
  ACC?: Section;
  CRI?: Section;
  HOS?: Section;
  GTL?: Section;
  LTD?: Section;
  PET?: Section;
  IDT?: Section;
  LGL?: Section;
  TEL?: Section;
};

type PrismSecurityEmployee = {
  firstName: string;
  lastName: string;
  employeeId: string;
  middleName: string;
};

type PrismEntity = {
  entityType: string;
  entityId: string;
};

type UserAccess = {
  entities: PrismEntity[];
  employees: PrismSecurityEmployee[];
};

type RefreshOptions = {
  entity?: ClientEntity;
  disableSpinner?: boolean;
};

type DirectDepositFormValues = {
  depositMethods: AchVoucher[];
};

type RequestTimeOffFormValues = {
  reason: string;
  message: string;
  requests: {
    date: Date;
    hours: string;
  }[];
};

interface PtoSummary {
  client_id: string;
  employee_id: string;
  plan_id: string;
  planned_hours: string;
  taken_hours: string;
  available_hours: string;
  carry_over_hours: string;
  accrued_hours: string;
  calculation_basis?: string | null;
  description?: string | null;
}

interface MostRecentPayrollVoucher {
  issue_date: string;
  check_number: string;
  pay_period_start: string;
  pay_period_end: string;
  voucher_id: string;
  earn_amount: string;
  taxes: string;
  net_pay: string;
}

interface DashboardPage {
  support: PrismTeamContact[];
  most_recent_voucher?: MostRecentPayrollVoucher | null;
  active_benefit_plans: InsurancePlan[];
  pto_summary: PtoSummary[];
}

type NavContextType = {
  drawerOpen: boolean;
  nav: any;
  fluid: boolean;
  openItem: string[];
  selectedID: string | null | number;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFluid: React.Dispatch<React.SetStateAction<boolean>>;
  setNav: React.Dispatch<React.SetStateAction<any>>;
  setOpenItem: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedID: React.Dispatch<React.SetStateAction<string | null | number>>;
};

interface DepartmentDivisionLocation {
  id: string;
  value: string;
}

interface UserAccessRequestForm {
  access_type?: string;
  authorized_by?: string;
  authorized_email?: string;
  authorized_phone?: string;
  client_401k_admin?: boolean;
  client_name: string;
  date_of_birth?: Date;
  date_submitting?: Date;
  departments?: DepartmentDivisionLocation[];
  divisions?: DepartmentDivisionLocation[];
  email?: string;
  first_name: string;
  hr_addons?: string[];
  last_name: string;
  locations?: DepartmentDivisionLocation[];
  mirror_user_access?: boolean;
  mirror_user?: string;
  mobile_phone?: string;
  pay_rate_access?: boolean;
  payroll_approver?: boolean;
  payroll_role?: string;
  primary_user_role?: string;
  request_date?: Date;
  time_clock_partner?: string;
  user_type?: string;
  work_groups?: DepartmentDivisionLocation[];
  zip_code?: string;
}

interface UserAccessRequest extends UserAccessRequestForm {
  id: int;
  created_at: string;
  updated_at: string;
}

type SpendingAccountBenefit = {
  account_id: string;
  elect_amount: string;
  deduct_amount: string;
};

type SpendingAccountConcise = {
  year: string;
  account_type: 'FSA' | 'HSA';
  benefit_accounts?: SpendingAccountBenefit[];
};

type ThrivePassCommuterEnrollmentForm = {
  form_action: 'new' | 'change' | 'terminate';
  employer_name: string;
  effective_date: Date | null;
  employee_name: string;
  birth_date: string | null;
  physical_address: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    zipcode: string;
  };
  phone_number: string;
  email: string;
  parking_fsa_election?: number;
  transit_fsa_election?: number;
  signature: string;
  date_signed: Date | null;
};

type BonusTaxWithholdingAssignRequest = {
  employee_ids: string[];
};

type BonusTaxWithholdingRequestForm = {
  client_id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  acknowledgement: boolean;
  signature: string | null;
  bonus_pay_date: date | null;
  additional_fed_tax: number;
  additional_state_tax: number;
  additional_local_tax: number;
  assigned_by: string | null;
  signed_at: string | null;
  status: BonusTaxWithholdingRequestStatuses;
};

interface BonusTaxWithholdingRequest extends BonusTaxWithholdingRequestForm {
  id: string;
  created_at: string;
  updated_at: string;
}

type readablePrismUserTypes =
  | 'worksite_manager'
  | 'trusted_advisor'
  | 'service_provider';

interface PrismSecurityUser {
  prism_user_id: string | null;
  user_type: 'M' | 'A' | 'I' | null; // Worksite (M)anager, Worksite Trusted (A)dvisor, Service Provider (I)
  employee_id: string | null;
  employee_status_class: 'A' | 'L' | 'T' | null; // (A)ctive, On (L)eave, (T)erminated
  user_active: boolean | null;
  first_name: string | null;
  last_name: string | null;
}

interface HRRole {
  code: string;
  desc: string;
}

interface AllowedEmployee {
  employee_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  job_title: string;
  allowed_employees?: AllowedEmployee[];
}

interface UserDetails {
  employee_id: string;
  user_type: string;
  user_role: string[] | null;
  email: string | null;
  employee_first_name: string;
  employee_last_name: string;
  human_resource_role: HRRole[] | null;
  allowed_employees: AllowedEmployee[];
}

interface HRRole {
  code: string;
  desc: string;
}

interface UserCardProps {
  name: string;
  position: string;
  userRoles: string[];
  hrRoles: HRRole[];
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  allowed_employees?: AllowedEmployee[];
}

interface ClientAsset {
  id: number;
  client_id: string;
  employee_id: string | null;
  key: string;
  asset_type: string;
  archived: boolean;
}

interface HandbookAsset extends ClientAsset {
  presigned_url: string | null;
}

interface EmployeeHandbookAssignment {
  id?: string;
  employee_id: string;
  client_id: string;
  handbook_id: number;
  assigned_at: string | null;
  due_date: string | null;
  status: 'pending' | 'signed' | 'overdue' | 'read_only';
  signed_at: string | null;
  signature: string | null;
  presigned_url: string | null;
}

interface DashboardPageProps {
  version?: 'v1' | 'v2';
}

interface DashboardData {
  most_recent_voucher?: MostRecentPayrollVoucher | null;
  pto_summary?: PtoSummary[];
  active_benefit_plans?: InsurancePlan[];
  support?: PrismTeamContact[];
}

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  type: string;
  classNames: string[];
  [key: string]: any;
}

interface CustomFieldDropdownValue {
  id?: number;
  field_definition_id?: number;
  value: string;
  display_order: number;
  created_at?: string;
}

interface CustomFieldDefinition {
  id: number;
  client_id: string;
  field_key: string;
  field_label: string;
  field_type: 'alphanumeric' | 'numeric' | 'date' | 'dropdown';
  is_required: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
  dropdown_values: CustomFieldDropdownValue[];
}

interface CustomFieldDefinitionCreate {
  field_key?: string; // Optional since it's auto-generated from field_label
  field_label: string;
  field_type: 'alphanumeric' | 'numeric' | 'date' | 'dropdown';
  is_required: boolean;
  description?: string;
  dropdown_values?: CustomFieldDropdownValue[];
}

interface CustomFieldDefinitionUpdate {
  field_label?: string;
  field_type?: 'alphanumeric' | 'numeric' | 'date' | 'dropdown';
  is_required?: boolean;
  description?: string;
  dropdown_values?: CustomFieldDropdownValue[];
}

interface CustomFieldValue {
  id: number;
  client_id: string;
  prism_user_id: string;
  field_definition_id: number;
  field_value?: string;
  created_at: string;
  updated_at: string;
  field_definition: CustomFieldDefinition;
}

interface CustomFieldValueUpdate {
  field_key: string;
  field_value: string;
}

interface CustomFieldValueBulkUpdate {
  field_values: CustomFieldValueUpdate[];
}

interface GeocodeLocation {
  geoCode: string;
  state: string;
  stateCode: string;
  city?: string;
  county?: string;
}
interface QuickHireRow {
  first_name: string;
  last_name: string;
  email: string;
  manager_id?: string;
  rowIndex?: number;
  errors?: { [key: string]: string };
  submitted?: boolean;
}

interface PrehireRow {
  new_hire_request_id: number;
  client_id: string;
  first_name: string;
  last_name: string;
  email: string;
  // Personal fields
  middle_initial?: string;
  preferred_name?: string;
  birth_date?: string;
  gender?: string;
  marital_status?: string;
  ethnicity?: string;
  preferred_language?: string;
  ssn?: string;
  // Contact fields
  email_address?: string; // Prehire schema field name
  work_email_address?: string; // Prehire schema field name
  personal_email?: string; // NewHireRequest model field name (legacy)
  work_email?: string; // NewHireRequest model field name (legacy)
  home_phone?: string;
  mobile_phone?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state_code?: string;
  zip_code?: string;
  emergency_contact_name?: string;
  emergency_contact_info?: string;
  emergency_contact_relationship?: string;
  // Employment fields
  location?: string;
  job?: string;
  department?: string;
  division?: string;
  shift?: string;
  start_date?: string;
  employee_type?: string;
  benefits_group?: string;
  employee_number?: string;
  supervisor?: string;
  manager?: string;
  project?: string;
  work_group?: string;
  // Pay fields
  pay_group?: string;
  pay_method?: string;
  pay_rate?: string;
  pay_period?: string;
  standard_hours?: string;
  default_time_sheet_hours?: string;
  first_pay_period_hours?: string;
  auto_time_sheet?: string;
  fed_filing_status?: string;
  fed_withholding?: string; // Prehire schema field name
  fed_allowances?: string; // Form field name (legacy, mapped to fed_withholding)
  citizenship_status?: string;
  rowIndex?: number;
  errors?: { [key: string]: string };
  submitted?: boolean;
}

type ImportRow = QuickHireRow | PrehireRow;

interface WizardProgressProps {
  steps: readonly string[];
  activeStep: number;
  onStepClick: (stepIndex: number) => void;
  isStepClickable: (stepIndex: number) => boolean;
}

interface PrehireRowEditDialogProps {
  open: boolean;
  row: PrehireRow | null;
  onClose: () => void;
  onSave: (updatedRow: PrehireRow) => void;
  prehireFields: PrehireFields | null;
  codes: CompanyCode | null;
  managers: PrismSecurityUser[] | null;
  access: UserAccess | null;
}
