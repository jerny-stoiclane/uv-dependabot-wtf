import { useUser } from '../hooks/useUser';

export const useCompany = (): Company => {
  const { company } = useUser();
  if (!company) {
    return {
      id: '',
      name: '',
      logo_url: '',
      config: [],
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      zip: '',
      website_url: '',
      main_phone: '',
      division_required: false,
      department_required: false,
      shift_required: false,
      work_group_required: false,
      codes: undefined,
      employees: [],
      vw_enabled: false,
    };
  }
  return { ...(company! ?? {}), employees: company!.employees ?? [] };
};
