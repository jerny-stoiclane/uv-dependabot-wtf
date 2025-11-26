/* eslint-disable import/first */
import { NotificationProvider } from '@armhr/ui';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { render, screen, waitFor } from '@testing-library/react';
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
import CalendarPage from '../../../src/pages/company/CalendarPage';
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

// Mock useApiData
const mockEmployees = vi.fn();
const mockBirthdayPermissions = vi.fn();
const mockPtoRequests = vi.fn();
const mockReports = vi.fn();

vi.mock('../../../src/hooks/useApiData', () => ({
  useApiData: (callback: any) => {
    const callbackStr = callback?.toString() || '';

    // For Calendar component's getMyEmployees call
    if (callbackStr.includes('getMyEmployees')) {
      return {
        data: mockReports(),
        loading: false,
        error: null,
        refresh: vi.fn(),
      };
    }

    // For CalendarPage's getEmployees call
    if (callbackStr.includes('getEmployees')) {
      return {
        data: mockEmployees(),
        loading: false,
        error: null,
        refresh: vi.fn(),
      };
    }

    // For getBirthdays call
    if (callbackStr.includes('getBirthdays')) {
      return {
        data: mockBirthdayPermissions(),
        loading: false,
        error: null,
        refresh: vi.fn(),
      };
    }

    // For getPtoRequests call
    if (callbackStr.includes('getPtoRequests')) {
      return {
        data: mockPtoRequests(),
        loading: false,
        error: null,
        refresh: vi.fn(),
      };
    }

    // Default fallback
    return {
      data: [],
      loading: false,
      error: null,
      refresh: vi.fn(),
    };
  },
}));

// Mock useCompany
const mockUseCompany = vi.fn();
vi.mock('../../../src/contexts/company.context', () => ({
  useCompany: () => mockUseCompany(),
}));

// Mock useNotifications
vi.mock('@armhr/ui', async () => {
  const actual = await vi.importActual('@armhr/ui');
  return {
    ...actual,
    useNotifications: () => ({
      showNotification: vi.fn(),
    }),
  };
});

// Mock FullCalendar to avoid layout/height issues in jsdom and render events plainly
vi.mock('@fullcalendar/react', () => ({
  default: ({ events = [], eventClassNames }: any) => (
    <div data-testid="mock-fullcalendar">
      {events.map((ev: any, idx: number) => {
        const classes =
          typeof eventClassNames === 'function'
            ? eventClassNames({ event: { extendedProps: { type: ev.type } } })
            : [];
        return (
          <div
            key={`${ev.title}-${idx}`}
            title={ev.title}
            className={classes?.join(' ')}
          >
            {ev.title}
          </div>
        );
      })}
    </div>
  ),
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

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
            <CalendarPage />
          </UserContext.Provider>
        </NotificationProvider>
      </Router>
    </LocalizationProvider>
  );
};

describe('<CalendarPage />', () => {
  beforeAll(() => {
    const mockDate = new Date(2025, 0, 15, 13); // January 15, 2025
    vi.setSystemTime(mockDate);

    // FullCalendar relies on ResizeObserver; mock it for JSDOM
    (global as any).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as any;
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

    // Set up default data for each API call
    mockEmployees.mockReturnValue([
      genEmployee({
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        birth_date: '1990-01-15',
      }),
    ]);

    mockBirthdayPermissions.mockReturnValue([
      genBirthdayPermission({
        employee_id: '1',
        show_calendar_birthdays: true,
      }),
    ]);

    mockPtoRequests.mockReturnValue([genPtoRequest()]);
    mockReports.mockReturnValue([]);
  });

  it('renders the calendar page', async () => {
    render(component());
    await waitFor(() => {
      // Calendar event content is rendered as HTML inside FullCalendar; use title attribute
      expect(screen.getByTitle("Johnny Doe's Birthday")).toBeInTheDocument();
    });
  });

  it('handles birthday visibility based on company config and permissions', async () => {
    // Test with company config enabled
    mockUseCompany.mockReturnValue({
      config: [{ flag: ConfigFlags.SHOW_CALENDAR_BIRTHDAYS, value: true }],
    });
    // Override mocked API data for this test
    mockEmployees.mockReturnValue([
      genEmployee({
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        birth_date: '1990-01-15',
      }),
      genEmployee({
        id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        birth_date: '1992-03-20',
      }),
    ]);

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

    mockPtoRequests.mockReturnValue([genPtoRequest()]);
    mockReports.mockReturnValue([]);

    const { rerender } = render(component());

    await waitFor(() => {
      // Should show John's birthday (permission: true)
      expect(screen.getByTitle("Johnny Doe's Birthday")).toBeInTheDocument();
      // Should not show Jane's birthday (permission: false)
      expect(
        screen.queryByTitle("Johnny Smith's Birthday")
      ).not.toBeInTheDocument();
    });

    // Test with company config disabled
    mockUseCompany.mockReturnValue({
      config: [{ flag: ConfigFlags.SHOW_CALENDAR_BIRTHDAYS, value: false }],
    });

    rerender(component());

    await waitFor(() => {
      // Should hide all birthdays when company config is disabled
      expect(
        screen.queryByTitle("Johnny Doe's Birthday")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTitle("Johnny Smith's Birthday")
      ).not.toBeInTheDocument();
    });
  });

  it('handles special date cases correctly', async () => {
    mockUseCompany.mockReturnValue({
      config: [{ flag: ConfigFlags.SHOW_CALENDAR_BIRTHDAYS, value: true }],
    });
    // Override mocked API data for this test
    mockEmployees.mockReturnValue([
      genEmployee({
        id: '1',
        first_name: 'Leap',
        last_name: 'Year',
        birth_date: '1992-02-29',
      }),
    ]);

    mockBirthdayPermissions.mockReturnValue([
      genBirthdayPermission({
        employee_id: '1',
        show_calendar_birthdays: true,
      }),
    ]);

    mockPtoRequests.mockReturnValue([genPtoRequest()]);
    mockReports.mockReturnValue([]);

    render(component());

    await waitFor(() => {
      expect(screen.getByTitle("Johnny Year's Birthday")).toBeInTheDocument();
    });
  });
});
