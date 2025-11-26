import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiContext } from '../../src/hooks/useApi';
import ProfilePage from '../../src/pages/profile/ProfilePage';
import { genPublicEmployeeProfile } from '../fixtures';

let mockApi = {
  profiles: {
    getUserProfileById: vi.fn(),
  },
};

const component = () => {
  return (
    <Router>
      <ApiContext.Provider value={mockApi as any}>
        <ProfilePage />
      </ApiContext.Provider>
    </Router>
  );
};

describe('<ProfilePage />', () => {
  beforeEach(() => {
    mockApi.profiles.getUserProfileById.mockClear();
  });

  it('renders the page', async () => {
    mockApi.profiles.getUserProfileById.mockResolvedValue({
      results: genPublicEmployeeProfile({
        first_name: 'Mister',
        last_name: 'Test',
      }),
    });
    render(component());
    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'View directory' })).toBeTruthy()
    );
    expect(screen.getByRole('heading', { name: 'Mister Test' })).toBeTruthy();
  });
});
