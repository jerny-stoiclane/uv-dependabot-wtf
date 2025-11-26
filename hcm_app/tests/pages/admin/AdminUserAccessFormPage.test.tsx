import { NotificationProvider } from '@armhr/ui';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  AccessFormUserAction,
  FormValues,
} from '../../../src/components/admin/userAccessFormValues';
import { ApiContext } from '../../../src/hooks/useApi';
import { UserContext } from '../../../src/hooks/useUser';
import AdminUserAccessRequestFormPage from '../../../src/pages/admin/AdminUserAccessRequestFormPage';
import { genCompany } from '../../fixtures';

// used in the Phone Number field in the final form section
vi.mock('react-imask', () => {
  return {
    IMaskInput: ({
      inputRef,
      onAccept,
      overwrite,
      ...props
    }: {
      inputRef?: any;
      onAccept?: (value: any) => void;
      overwrite?: boolean;
    }) => {
      const inputProps = { ...props };
      if (overwrite) {
        inputProps['data-overwrite'] = 'true';
      }
      return (
        <input
          ref={inputRef}
          onChange={(e) => onAccept?.(e.target.value)}
          {...inputProps}
        />
      );
    },
  };
});

let mockApi = {
  client: { get: vi.fn() },
  company: {
    getEmployees: vi.fn(),
    getActivePrismUsers: vi.fn(),
    getCodes: vi.fn().mockResolvedValue({
      results: [
        { id: '1', name: 'Test Code 1' },
        { id: '2', name: 'Test Code 2' },
      ],
    }),
  },
  profiles: { requestUserAccess: vi.fn() },
};

const component = () => {
  return (
    <Router>
      <NotificationProvider>
        <UserContext.Provider
          value={{
            user: null,
            company: genCompany(),
            loading: false,
            entity: undefined,
            entities: [],
            error: null,
            setUser: () => {},
            refreshEntity: async () => {},
            refresh: async () => {},
          }}
        >
          <ApiContext.Provider value={mockApi as any}>
            <AdminUserAccessRequestFormPage />
          </ApiContext.Provider>
        </UserContext.Provider>
      </NotificationProvider>
    </Router>
  );
};

const mockEmployees = [
  { id: '1', first_name: 'One', last_name: 'Employee' },
  { id: '2', first_name: 'Two', last_name: 'Employee' },
];

const mockManagers = [
  { employee_id: '3', first_name: 'Three', last_name: 'Manager' },
  { employee_id: '4', first_name: 'Four', last_name: 'Manager' },
];

const expectedUserRequest = (options?: Partial<FormValues>) => ({
  access_type: '',
  authorized_by: '',
  authorized_email: '',
  authorized_phone: '',
  client_401k_admin: false,
  client_name: 'Test Company',
  date_of_birth: '',
  date_submitting: '2025-01-01', // corresponds with mocked date value below
  departments: [],
  divisions: [],
  email: '',
  first_name: '',
  hr_addons: [],
  inactivate_user_id: '',
  last_name: '',
  locations: [],
  mirror_user: '',
  mirror_user_access: false,
  mobile_phone: '',
  pay_rate_access: false,
  payroll_approver: false,
  payroll_roles: [],
  primary_user_role: '',
  request_date: '',
  shifts: [],
  time_clock_partner: '',
  user_type: '',
  work_groups: [],
  zip_code: '',
  ...options,
});

describe('<UserAccessRequestFormPage/>', () => {
  beforeAll(() => {
    const mockDate = new Date(2025, 0, 1);
    vi.setSystemTime(mockDate);
  });

  beforeEach(() => {
    mockApi.company.getEmployees.mockClear();
    mockApi.company.getActivePrismUsers.mockClear();
    mockApi.company.getCodes.mockClear();
    mockApi.profiles.requestUserAccess.mockClear();

    // Ensure getCodes resolves immediately with mock data
    mockApi.company.getCodes.mockResolvedValue({
      results: [
        { id: '1', name: 'Test Code 1' },
        { id: '2', name: 'Test Code 2' },
      ],
    });
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('hides other form inputs when the user selects Inactivate User or Mirror User', async () => {
    render(component());

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Access requirements' })
      ).toBeTruthy();
    });
    expect(
      screen.getByRole('heading', { name: 'User information' })
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Security access' })
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Primary User Role' })
    ).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Payroll' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'HR add-ons' })).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Additional functionality' })
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Security administration' })
    ).toBeTruthy();

    fireEvent.click(screen.getByRole('radio', { name: 'Inactivate User' }));

    expect(
      screen.queryByRole('heading', { name: 'User information' })
    ).toBeFalsy();
    expect(
      screen.queryByRole('heading', { name: 'Security access' })
    ).toBeFalsy();
    expect(
      screen.queryByRole('heading', { name: 'Primary User Role' })
    ).toBeFalsy();
    expect(screen.queryByRole('heading', { name: 'Payroll' })).toBeFalsy();
    expect(screen.queryByRole('heading', { name: 'HR add-ons' })).toBeFalsy();
    expect(
      screen.queryByRole('heading', { name: 'Additional Functionality' })
    ).toBeFalsy();
    // // form still shows these sections
    expect(
      screen.getByRole('heading', { name: 'Access requirements' })
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Security administration' })
    ).toBeTruthy();

    fireEvent.click(screen.getByRole('radio', { name: 'Mirror User Access' }));

    expect(
      screen.queryByRole('heading', { name: 'User information' })
    ).toBeFalsy();
    expect(
      screen.queryByRole('heading', { name: 'Security access' })
    ).toBeFalsy();
    expect(
      screen.queryByRole('heading', { name: 'Primary User Role' })
    ).toBeFalsy();
    expect(screen.queryByRole('heading', { name: 'Payroll' })).toBeFalsy();
    expect(screen.queryByRole('heading', { name: 'HR add-ons' })).toBeFalsy();
    expect(
      screen.queryByRole('heading', { name: 'Additional functionality' })
    ).toBeFalsy();
    // form still shows these sections
    expect(
      screen.getByRole('heading', { name: 'Access requirements' })
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Security administration' })
    ).toBeTruthy();
  });

  it('Inactivate User allows the user to search and select a given employee', async () => {
    mockApi.company.getEmployees.mockResolvedValue({
      results: mockEmployees,
    });

    render(component());

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Access requirements' })
      ).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('radio', { name: 'Inactivate User' }));

    await waitFor(() => {
      expect(
        screen.getByRole('combobox', { name: 'Type to search by user name' })
      ).toBeTruthy();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('One Employee')).toBeTruthy();
    expect(screen.getByText('Two Employee')).toBeTruthy();

    fireEvent.click(screen.getByText('Two Employee'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Submit' })[0]);
    const expected = expectedUserRequest({
      inactivate_user_id: '2',
      first_name: 'Two',
      last_name: 'Employee',
      user_type: AccessFormUserAction.INACTIVATE,
    });
    await waitFor(() => {
      expect(mockApi.profiles.requestUserAccess).toHaveBeenCalledWith(expected);
    });
  });

  it('Mirror User Access allows the user to search and select a given manager', async () => {
    mockApi.company.getActivePrismUsers.mockResolvedValue({
      results: mockManagers,
    });

    render(component());

    await waitFor(() => {
      fireEvent.click(
        screen.getByRole('radio', { name: 'Mirror User Access' })
      );
    });

    expect(
      screen.getByRole('combobox', { name: 'Type to search by user name' })
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Three Manager')).toBeTruthy();
    expect(screen.getByText('Four Manager')).toBeTruthy();

    fireEvent.click(screen.getByText('Three Manager'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Submit' })[0]);
    const expected = expectedUserRequest({
      mirror_user: '3',
      first_name: 'Three',
      last_name: 'Manager',
      user_type: AccessFormUserAction.MIRROR,
    });
    await waitFor(() => {
      expect(mockApi.profiles.requestUserAccess).toHaveBeenCalledWith(expected);
    });
  });

  it('changing from inactive user to another user action type unsets the name fields', async () => {
    mockApi.company.getEmployees.mockResolvedValue({
      results: mockEmployees,
    });

    render(component());

    // select a user to inactivate
    await waitFor(() => {
      fireEvent.click(screen.getByRole('radio', { name: 'Inactivate User' }));
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByText('Two Employee'));

    // change to adding a new user
    fireEvent.click(screen.getByRole('radio', { name: 'New User' }));

    // see that the name fields are empty, meaning formik state has been reset
    const firstNameField: HTMLInputElement = screen.getByRole('textbox', {
      name: 'First name',
    });
    expect(firstNameField.value).not.toEqual('Two');
    const lastNameField: HTMLInputElement = screen.getByRole('textbox', {
      name: 'Last name',
    });
    expect(lastNameField.value).not.toEqual('Employee');
  });

  it('changing from mirror user to another user action type unsets the name fields', async () => {
    mockApi.company.getActivePrismUsers.mockResolvedValue({
      results: mockManagers,
    });

    render(component());

    // select a user to mirror
    await waitFor(() => {
      fireEvent.click(
        screen.getByRole('radio', { name: 'Mirror User Access' })
      );
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByText('Three Manager'));

    // change to adding a new user
    fireEvent.click(screen.getByRole('radio', { name: 'New User' }));

    // see that the name fields are empty, meaning formik state has been reset
    const firstNameField: HTMLInputElement = screen.getByRole('textbox', {
      name: 'First name',
    });
    expect(firstNameField.value).not.toEqual('Three');
    const lastNameField: HTMLInputElement = screen.getByRole('textbox', {
      name: 'Last name',
    });
    expect(lastNameField.value).not.toEqual('Manager');
  });

  it('hitting enter on the user search input does not submit the form', async () => {
    mockApi.company.getActivePrismUsers.mockResolvedValue({
      results: mockManagers,
    });

    render(component());

    await waitFor(() => {
      fireEvent.click(
        screen.getByRole('radio', { name: 'Mirror User Access' })
      );
    });

    expect(
      screen.getByRole('combobox', { name: 'Type to search by user name' })
    ).toBeTruthy();
    fireEvent.keyDown(
      screen.getByRole('combobox', { name: 'Type to search by user name' }),
      { key: 'Enter', code: 'Enter' }
    );
    await waitFor(() => {
      expect(mockApi.profiles.requestUserAccess).not.toHaveBeenCalled();
    });
  });
});
