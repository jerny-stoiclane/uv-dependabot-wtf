import { NotificationProvider } from '@armhr/ui';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { genUser } from '../../../quote/tests/fixtures';
import { UserContext } from '../../src/hooks/useUser';
import DashboardPage from '../../src/pages/dashboard/DashboardPage';
import { genCompany } from '../fixtures';

// Mock the feature flags utility
vi.mock('../../src/utils/feature-flags', () => ({
  isFeatureFlagEnabled: () => true, // Default to V1
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

describe('<DashboardPage />', () => {
  beforeAll(() => {
    const mockDate = new Date(2025, 0, 1, 13);
    vi.setSystemTime(mockDate);
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  it('renders the page', async () => {
    render(component());
    await waitFor(() => expect(screen.getByText('Welcome, Test')).toBeTruthy());
  });
});
