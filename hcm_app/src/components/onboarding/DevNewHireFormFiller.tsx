import { Button } from '@mui/material';
import { useFormikContext } from 'formik';
import { useCallback, useMemo } from 'react';

import { useUser } from '../../hooks/useUser';
import {
  ethnicities,
  gender,
  languages,
  maritalStatuses,
  statesAndCodes,
} from '../../utils/constants';

type Props = {
  requiredFields: string[];
  codes?: CompanyCode;
  managers?: PrismSecurityUser[];
  access?: UserAccess;
};

const sample = {
  first_name: ['Alex', 'Jordan', 'Taylor', 'Sam', 'Casey'],
  last_name: ['Smith', 'Johnson', 'Brown', 'Lee', 'Garcia'],
  middle_initial: ['A', 'B', 'C', 'D', 'E'],
  city: ['Metropolis', 'Springfield', 'Gotham', 'Star City'],
  state_code: ['NY', 'CA', 'TX', 'FL', 'WA'],
  department: ['Engineering', 'HR', 'Finance', 'Marketing'],
  division: ['East', 'West', 'North', 'South'],
  job: ['Developer', 'Analyst', 'Manager', 'Coordinator'],
  location: ['HQ', 'Remote', 'Branch-1', 'Branch-2'],
  pay_group: ['Biweekly', 'Weekly', 'Monthly'],
  pay_period: ['Biweekly', 'Weekly', 'Monthly'],
  pay_method: ['Check', 'Direct Deposit'],
  employee_type: ['FT', 'PT', 'Contractor'],
  marital_status: ['Single', 'Married'],
  gender: ['male', 'female', 'other'],
  work_group: ['A', 'B', 'C'],
  shift: ['Day', 'Night'],
  manager: ['1001', '1002', '1003'],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateString(): string {
  const year = randomInt(1970, 2002);
  const month = String(randomInt(1, 12)).padStart(2, '0');
  const day = String(randomInt(1, 28)).padStart(2, '0');
  // Use ISO-like YYYY-MM-DD for compatibility with date pickers
  return `${year}-${month}-${day}`;
}

function sanitizeEmailToken(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function randomEmailLocal(
  prefix: string,
  first: string,
  last: string,
  tag: string = ''
): string {
  const n = randomInt(10, 999);
  const token = sanitizeEmailToken(`${first}${last}${tag}${n}`);
  return `${prefix}+${token}@armhr.com`;
}

//

const DevNewHireFormFiller = ({
  requiredFields,
  codes,
  managers,
  access,
}: Props) => {
  const { values, setValues } = useFormikContext<NewHireRequestFormValues>();
  const { user } = useUser();

  const canRender = useMemo(() => {
    // Only render in dev
    return typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV;
  }, []);

  const emailPrefix = user?.login_email?.split('@')[0] || 'engineering';

  const handleFill = useCallback(() => {
    const pickId = <T extends { id: string }>(arr?: T[]): string =>
      Array.isArray(arr) && arr.length > 0 ? (pickRandom(arr) as T).id : '';
    // Seed basic person info first so other fields can reference it
    const first = pickRandom(sample.first_name);
    const last = pickRandom(sample.last_name);

    // Generate a valid pay schedule combination
    const chosenPayMethod: 'S' | 'H' = pickRandom(['S', 'H']);
    const chosenPayPeriod: PayRateCode = chosenPayMethod === 'H' ? 'H' : 'Y';
    const chosenPayRate =
      chosenPayMethod === 'H'
        ? `${randomInt(20, 60)}.00` // hourly rate
        : String(randomInt(60000, 125000)); // yearly salary

    const filled: Partial<NewHireRequestFormValues> = {
      first_name: first,
      last_name: last,
      middle_initial: pickRandom(sample.middle_initial),
      preferred_name: first,
      birth_date: randomDateString(),
      email_address: randomEmailLocal(emailPrefix, first, last, 'p'),
      work_email_address: randomEmailLocal(emailPrefix, first, last, 'w'),
      mobile_phone: String(5550000000 + randomInt(100000, 999999)),
      home_phone: String(5550000000 + randomInt(100000, 999999)),
      address_line_1: `${randomInt(10, 9999)} Main St`,
      address_line_2: `Apt ${randomInt(1, 99)}`,
      city: pickRandom(sample.city),
      state_code: (pickRandom(statesAndCodes) as any).value as string,
      zip_code: String(10000 + randomInt(0, 89999)),
      gender: (pickRandom(gender) as any).value as string,
      marital_status: (pickRandom(maritalStatuses) as any).value as string,
      ethnicity: (pickRandom(ethnicities) as any).value as string,
      preferred_language: (pickRandom(languages) as any).value as string,
      department: pickId(codes?.department_codes),
      division: pickId(codes?.division_codes),
      job: pickId(codes?.job_codes),
      location: pickId(codes?.location_codes),
      manager:
        managers && managers.length > 0
          ? (pickRandom(managers) as PrismSecurityUser).employee_id
          : '',
      supervisor:
        typeof access !== 'undefined' && access?.employees?.length
          ? pickRandom(access.employees).employeeId
          : '',
      employee_type: pickId(codes?.type_codes),
      benefits_group: pickId(codes?.benefit_group_codes),
      pay_group: pickId(codes?.pay_group_codes),
      pay_method: chosenPayMethod,
      pay_period: chosenPayPeriod,
      pay_rate: chosenPayRate,
      standard_hours: String(40),
      start_date: randomDateString(),
      work_group: pickId(codes?.workgroup_codes),
      shift: pickId(codes?.shift_codes),
      project: pickId(codes?.project_codes),
      auto_time_sheet: 'N',
      default_time_sheet_hours: '8',
      first_pay_period_hours: '80',
      emergency_contact_name: `${pickRandom(sample.first_name)} ${pickRandom(
        sample.last_name
      )}`,
      emergency_contact_relationship: 'Friend',
      emergency_contact_info: String(5550000000 + randomInt(100000, 999999)),
      ssn: `${randomInt(100, 999)}${randomInt(10, 99)}${randomInt(1000, 9999)}`,
    } as Partial<NewHireRequestFormValues>;

    // Ensure all required fields have non-empty values.
    // Only auto-fill plain text fields to avoid invalid code IDs.
    const backendCodedFields = new Set([
      'department',
      'division',
      'job',
      'location',
      'employee_type',
      'benefits_group',
      'work_group',
      'shift',
      'project',
      'pay_group',
      'manager',
      'supervisor',
    ]);
    for (const field of requiredFields) {
      if (
        !filled[field as keyof NewHireRequestFormValues] &&
        !backendCodedFields.has(field)
      ) {
        (filled as any)[field] = 'Sample';
      }
    }

    setValues({
      ...values,
      ...filled,
    });
  }, [requiredFields, setValues, values, codes, managers, access]);

  if (!canRender) return null;

  return (
    <Button variant="outlined" color="error" onClick={handleFill}>
      Fill sample data
    </Button>
  );
};

export default DevNewHireFormFiller;
