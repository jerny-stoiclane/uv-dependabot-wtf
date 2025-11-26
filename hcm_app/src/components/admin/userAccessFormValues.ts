export enum AccessFormUserAction {
  MIRROR = 'Mirror User Access',
  INACTIVATE = 'Inactivate User',
  NEW = 'New User',
  CHANGE = 'Change User',
  NONE = '',
}

export const truncatedFormUserActions = [
  AccessFormUserAction.MIRROR,
  AccessFormUserAction.INACTIVATE,
];

export interface FormValues {
  client_name: string;
  request_date: string;
  user_type: AccessFormUserAction;
  access_type: string;
  last_name: string;
  first_name: string;
  mobile_phone: string;
  email: string;
  departments: { id: string; value: string }[];
  divisions: { id: string; value: string }[];
  mirror_user_access: boolean;
  mirror_user: string;
  inactivate_user_id: string;
  locations: { id: string; value: string }[];
  work_groups: { id: string; value: string }[];
  primary_user_role: string;
  payroll_roles: string[];
  hr_addons: string[];
  client_401k_admin: boolean;
  time_clock_partner: string;
  authorized_by: string;
  date_submitting: string;
  authorized_phone: string;
  authorized_email: string;
  zip_code: string;
  date_of_birth: string;
  pay_rate_access: boolean;
  payroll_approver: boolean;
  shifts: { id: string; value: string }[];
}

export const initialValues: FormValues = {
  client_name: '',
  request_date: '',
  user_type: AccessFormUserAction.NONE,
  access_type: '',
  last_name: '',
  first_name: '',
  mirror_user_access: false,
  mirror_user: '',
  inactivate_user_id: '',
  mobile_phone: '',
  email: '',
  departments: [],
  divisions: [],
  locations: [],
  work_groups: [],
  primary_user_role: '',
  payroll_roles: [],
  hr_addons: [],
  client_401k_admin: false,
  time_clock_partner: '',
  authorized_by: '',
  date_submitting: '',
  authorized_phone: '',
  authorized_email: '',
  zip_code: '',
  date_of_birth: '',
  pay_rate_access: false,
  payroll_approver: false,
  shifts: [],
};
