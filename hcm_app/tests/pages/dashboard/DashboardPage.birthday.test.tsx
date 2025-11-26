import { NotificationProvider } from '@armhr/ui';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { render, screen, waitFor, within } from '@testing-library/react';
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

import { UserContext } from '../../../src/hooks/useUser';
import DashboardPage from '../../../src/pages/dashboard/DashboardPage';
import { ConfigFlags } from '../../../src/utils/constants';
import {
  genBirthdayPermission,
  genCompany,
  genEmployee,
  genHoliday,
  genPtoRequest,
  genUser,
} from '../../fixtures';

// Mock the feature flags utility
vi.mock('../../../src/utils/feature-flags', () => ({
  isFeatureFlagEnabled: () => true,
  FEATURE_FLAGS: {
    V2_USER_PROVIDER: 'V2_USER_PROVIDER',
  },
}));

// Mock Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    user: { sub: 'test-user-id' },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

// Mock useFetchHolidays
vi.mock('../../../src/hooks/useFetchHolidays', () => ({
  default: () => [genHoliday()],
}));

// Mock FullCalendar to avoid heavy DOM and layout behavior in tests
vi.mock('../../../src/components/company/Calendar', async () => {
  const actual = await vi.importActual(
    '../../../src/components/company/Calendar'
  );
  return {
    ...actual,
    default: ({ events = [] }: any) => (
      <div data-testid="mock-fullcalendar">
        {events.map((ev: any, idx: number) => (
          <div key={`${ev.title}-${idx}`} title={ev.title}>
            {ev.title}
          </div>
        ))}
      </div>
    ),
  };
});

// Mock useApiData with per-endpoint fns to avoid brittle call-order issues
const mockDashboard = vi.fn();
const mockEmployees = vi.fn();
const mockPtoRequests = vi.fn();
const mockBirthdayPermissions = vi.fn();
const mockReports = vi.fn();

vi.mock('../../../src/hooks/useApiData', () => ({
  useApiData: (callback: any) => {
    const callbackStr = callback?.toString() || '';

    if (callbackStr.includes('getDashboard')) {
      return {
        data: mockDashboard(),
        loading: false,
        error: null,
        refresh: vi.fn(),
      };
    }

    if (callbackStr.includes('getEmployees')) {
      return {
        data: mockEmployees(),
        loading: false,
        error: null,
        refresh: vi.fn(),
      };
    }

    if (callbackStr.includes('getPtoRequests')) {
      return {
        data: mockPtoRequests(),
        loading: false,
        error: null,
        refresh: vi.fn(),
      };
    }

    if (callbackStr.includes('getBirthdays')) {
      return {
        data: mockBirthdayPermissions(),
        loading: false,
        error: null,
        refresh: vi.fn(),
      };
    }

    if (callbackStr.includes('getMyEmployees')) {
      return {
        data: mockReports(),
        loading: false,
        error: null,
        refresh: vi.fn(),
      };
    }

    return { data: [], loading: false, error: null, refresh: vi.fn() };
  },
}));

// Mock useCompany
const mockUseCompany = vi.fn();
vi.mock('../../../src/contexts/company.context', () => ({
  useCompany: () => mockUseCompany(),
}));

const component = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Router>
        <NotificationProvider>
          <UserContext.Provider
            value={{
              user: genUser({ first_name: 'Test', last_name: 'User' }),
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
            <DashboardPage />
          </UserContext.Provider>
        </NotificationProvider>
      </Router>
    </LocalizationProvider>
  );
};

describe('<DashboardPage /> - Birthday Configuration', () => {
  beforeAll(() => {
    const mockDate = new Date(2025, 0, 15, 13); // January 15, 2025
    vi.setSystemTime(mockDate);
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mockUseCompany.mockReturnValue({
      config: [{ flag: ConfigFlags.SHOW_CALENDAR_BIRTHDAYS, value: true }],
    });

    mockDashboard.mockReturnValue({
      most_recent_voucher: null,
      active_benefit_plans: [],
      pto_summary: [],
      support: [],
    });
    mockEmployees.mockReturnValue([
      genEmployee({
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        nickname: '',
        birth_date: '1990-01-15',
      }),
    ]);
    mockPtoRequests.mockReturnValue([genPtoRequest()]);
    mockBirthdayPermissions.mockReturnValue([
      genBirthdayPermission({
        employee_id: '1',
        show_calendar_birthdays: true,
      }),
    ]);
    mockReports.mockReturnValue([]);
  });

  it('handles birthday visibility and permissions correctly', async () => {
    // Test with company config enabled and default permissions
    const { rerender } = render(component());

    await waitFor(() => {
      expect(screen.getByTitle("John Doe's Birthday")).toBeInTheDocument();
    });

    // Test with company config disabled
    mockUseCompany.mockReturnValue({
      config: [{ flag: ConfigFlags.SHOW_CALENDAR_BIRTHDAYS, value: false }],
    });

    rerender(component());

    await waitFor(() => {
      expect(
        screen.queryByTitle("John Doe's Birthday")
      ).not.toBeInTheDocument();
    });

    // Test individual permissions
    mockUseCompany.mockReturnValue({
      config: [{ flag: ConfigFlags.SHOW_CALENDAR_BIRTHDAYS, value: true }],
    });

    mockDashboard.mockReturnValue({
      most_recent_voucher: null,
      active_benefit_plans: [],
      pto_summary: [],
      support: [],
    });
    mockEmployees.mockReturnValue([
      genEmployee({
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        nickname: '',
        birth_date: '1990-01-15',
      }),
      genEmployee({
        id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        nickname: '',
        birth_date: '1992-03-20',
      }),
    ]);
    mockPtoRequests.mockReturnValue([genPtoRequest()]);
    mockBirthdayPermissions.mockReturnValue([
      genBirthdayPermission({
        employee_id: '1',
        show_calendar_birthdays: true,
      }),
      genBirthdayPermission({
        employee_id: '2',
        show_calendar_birthdays: false,
      }),
    ]);
    mockReports.mockReturnValue([]);

    rerender(component());

    await waitFor(() => {
      expect(screen.getByTitle("John Doe's Birthday")).toBeInTheDocument();
      expect(
        screen.queryByTitle("Jane Smith's Birthday")
      ).not.toBeInTheDocument();
    });
  });

  it('handles special date cases correctly', async () => {
    // Test leap year birthday
    mockDashboard.mockReturnValue({
      most_recent_voucher: null,
      active_benefit_plans: [],
      pto_summary: [],
      support: [],
    });
    mockEmployees.mockReturnValue([
      genEmployee({
        id: '1',
        first_name: 'Leap',
        last_name: 'Year',
        nickname: '',
        birth_date: '1992-02-29',
      }),
      genEmployee({
        id: '2',
        first_name: 'Past',
        last_name: 'Birthday',
        nickname: '',
        birth_date: '1990-01-10',
      }),
      genEmployee({
        id: '3',
        first_name: 'Future',
        last_name: 'Birthday',
        nickname: '',
        birth_date: '1990-01-20',
      }),
    ]);
    mockPtoRequests.mockReturnValue([genPtoRequest()]);
    mockBirthdayPermissions.mockReturnValue([
      genBirthdayPermission({
        employee_id: '1',
        show_calendar_birthdays: true,
      }),
      genBirthdayPermission({
        employee_id: '2',
        show_calendar_birthdays: true,
      }),
      genBirthdayPermission({
        employee_id: '3',
        show_calendar_birthdays: true,
      }),
    ]);
    mockReports.mockReturnValue([]);

    render(component());

    await waitFor(() => {
      const calendar = screen.getByTestId('mock-fullcalendar');
      // Verify leap year birthday only within the calendar widget
      expect(
        within(calendar).getByTitle("Leap Year's Birthday")
      ).toBeInTheDocument();
      // Verify past birthday
      expect(
        within(calendar).getByTitle("Past Birthday's Birthday")
      ).toBeInTheDocument();
      // Verify future birthday
      expect(
        within(calendar).getByTitle("Future Birthday's Birthday")
      ).toBeInTheDocument();
    });
  });
});
