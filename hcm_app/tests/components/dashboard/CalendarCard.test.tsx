import { NotificationProvider } from '@armhr/ui';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
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

import CalendarCard from '../../../src/components/dashboard/CalendarCard';
import { UserContext } from '../../../src/hooks/useUser';
import { CalendarEvent } from '../../../src/utils/anniversary';
import { genCalendarEvent, genCompany, genUser } from '../../fixtures';

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

type ComponentOptions = {
  companyOverride?: any;
};

const component = (
  events: CalendarEvent[] = [],
  options: ComponentOptions = {}
) => {
  const company = options.companyOverride ?? genCompany();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Router>
        <NotificationProvider>
          <UserContext.Provider
            value={{
              user: genUser({ first_name: 'Test', last_name: 'User' }),
              company,
              loading: false,
              entity: undefined,
              entities: [],
              error: null,
              setUser: () => {},
              refreshEntity: async () => {},
              refresh: async () => {},
            }}
          >
            <CalendarCard events={events} />
          </UserContext.Provider>
        </NotificationProvider>
      </Router>
    </LocalizationProvider>
  );
};

describe('<CalendarCard />', () => {
  beforeAll(() => {
    const mockDate = new Date(2025, 0, 15, 13); // January 15, 2025
    vi.setSystemTime(mockDate);
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the calendar card', () => {
    render(component());
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Upcoming events')).toBeInTheDocument();
  });

  it('handles different event types correctly (labels shown depend on flags)', () => {
    const events = [
      genCalendarEvent({
        title: "John Doe's Birthday",
        type: 'birthday',
        start: '2025-01-20T00:00:00.000Z',
      }),
      genCalendarEvent({
        title: "New Year's Day",
        type: 'holiday',
        start: '2025-02-01T00:00:00.000Z',
      }),
      genCalendarEvent({
        title: 'John Doe PTO',
        type: 'pto',
        start: '2025-01-21T00:00:00.000Z',
      }),
      genCalendarEvent({
        title: 'John Doe Anniversary',
        type: 'anniversary',
        start: '2025-01-22T00:00:00.000Z',
      }),
    ];

    // Ensure flags allow both birthday and anniversary to show
    const company = genCompany();
    company.config = [
      {
        flag: 'show_calendar_birthdays',
        value: true,
        client_id: '000001',
        data: null,
      },
      {
        flag: 'hide_anniversaries',
        value: false,
        client_id: '000001',
        data: null,
      },
    ];

    render(component(events, { companyOverride: company }));

    // Verify all event types are displayed
    expect(screen.getByText("John Doe's Birthday")).toBeInTheDocument();
    expect(screen.getByText("New Year's Day")).toBeInTheDocument();
    expect(screen.getByText('John Doe PTO')).toBeInTheDocument();
    expect(screen.getByText('John Doe Anniversary')).toBeInTheDocument();

    // Verify event type labels (Birthdays label only when flag is enabled)
    expect(screen.getByText('Birthdays')).toBeInTheDocument();
    expect(screen.getByText('Holidays')).toBeInTheDocument();
    expect(screen.getByText('Time Off')).toBeInTheDocument();
    expect(screen.getByText('Anniversaries')).toBeInTheDocument();
  });

  it('handles event filtering and sorting', () => {
    const events = [
      genCalendarEvent({
        title: 'Past Birthday',
        type: 'birthday',
        start: '2024-12-01T00:00:00.000Z', // Past date
      }),
      genCalendarEvent({
        title: 'Future Event 1',
        type: 'birthday',
        start: '2025-01-20T00:00:00.000Z', // Earlier future date
      }),
      genCalendarEvent({
        title: 'Future Event 2',
        type: 'birthday',
        start: '2025-02-01T00:00:00.000Z', // Later future date
      }),
    ];

    const company = genCompany();
    company.config = [
      {
        flag: 'show_calendar_birthdays',
        value: true,
        client_id: '000001',
        data: null,
      },
    ];
    render(component(events, { companyOverride: company }));

    // Past events should be filtered out
    expect(screen.queryByText('Past Birthday')).not.toBeInTheDocument();

    // Future events should be sorted by date
    const eventElements = screen.getAllByText(/Future Event/);
    expect(eventElements[0]).toHaveTextContent('Future Event 1');
    expect(eventElements[1]).toHaveTextContent('Future Event 2');
  });

  it('handles pagination correctly', () => {
    // Create 6 events to trigger pagination
    const events = Array.from({ length: 6 }, (_, i) =>
      genCalendarEvent({
        title: `Event ${i + 1}`,
        type: 'birthday',
        start: `2025-01-${20 + i}T00:00:00.000Z`,
      })
    );

    const company = genCompany();
    company.config = [
      {
        flag: 'show_calendar_birthdays',
        value: true,
        client_id: '000001',
        data: null,
      },
    ];
    const { rerender } = render(
      component(events, { companyOverride: company })
    );

    // Should show pagination for more than 4 events
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();

    // Render with fewer events
    rerender(component(events.slice(0, 3)));

    // Should not show pagination for 4 or fewer events
    expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
  });

  it('shows link to company calendar', () => {
    render(component());

    expect(screen.getByText('View company calendar')).toBeInTheDocument();
  });
});
