import * as Yup from 'yup';

export const prefillInitalValues = (
  user: EmployeeProfile,
  company: Company
): ThrivePassCommuterEnrollmentForm => {
  return {
    form_action: 'new',
    employer_name: company.name ?? '',
    effective_date: null,
    employee_name: `${user.first_name} ${user.last_name}`,
    birth_date: user.birth_date ?? null,
    physical_address: {
      address_line_1: user.address_info.home_address.address_line_1 ?? '',
      address_line_2: user.address_info.home_address.address_line_2 ?? '',
      city: user.address_info.home_address.city ?? '',
      state: user.address_info.home_address.state ?? '',
      zipcode: user.address_info.home_address.zipcode ?? '',
    },
    phone_number: user.phone_numbers.mobile ?? '',
    email: user.email_address ?? '',
    parking_fsa_election: undefined,
    transit_fsa_election: undefined,
    signature: '',
    date_signed: null,
  };
};

export const validationSchema = Yup.object().shape({
  employer_name: Yup.string().required('Required'),
  effective_date: Yup.date().required('Required'),
  employee_name: Yup.string().required('Required'),
  birth_date: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Required'),
  physical_address: Yup.object().shape({
    address_line_1: Yup.string().required('Required'),
    address_line_2: Yup.string().notRequired(),
    city: Yup.string().required('Required'),
    state: Yup.string().required('Required'),
    zipcode: Yup.string().required('Required'),
  }),
  email: Yup.string()
    .email('Must be a valid email adress')
    .required('Required'),
  phone_number: Yup.string().required('Required'),
  parking_fsa_election: Yup.number().when('form_action', {
    is: 'terminate',
    then: Yup.number().nullable().notRequired(),
    otherwise: Yup.number()
      .min(0, 'Amount must be $0.00 or more')
      .max(325, 'The maximum amount that can be elected is $325.00')
      .required('Required'),
  }),
  transit_fsa_election: Yup.number().when('form_action', {
    is: 'terminate',
    then: Yup.number().nullable().notRequired(),
    otherwise: Yup.number()
      .min(0, 'Amount must be $0.00 or more')
      .max(325, 'The maximum amount that can be elected is $325.00')
      .required('Required'),
  }),
  signature: Yup.string().required('Must provide signature'),
  date_signed: Yup.date().required('Required'),
});
