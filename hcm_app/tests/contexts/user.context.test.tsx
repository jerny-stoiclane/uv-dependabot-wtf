import { render, renderHook, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserProvider } from '../../src/contexts/user.context';
import { useUser } from '../../src/hooks/useUser';
import { paths } from '../../src/utils/paths';
// Import the mocked function
import { isUnfinishedQuickhire } from '../../src/utils/user';

// Mock isUnfinishedQuickhire
vi.mock('../../src/utils/user', () => ({
  isUnfinishedQuickhire: vi.fn(),
}));

let mockLogout = vi.fn();
let mockGetAccessTokenSilently = vi.fn();
let mockNavigate = vi.fn();
let mockAuth0Data = {
  isAuthenticated: true,
  user: { user_metadata: { prehire: false } },
  hcm_roles: [],
  getAccessTokenSilently: mockGetAccessTokenSilently,
  logout: mockLogout,
};
let mockApi = {
  profiles: {
    getUserProfileWithStatus: vi.fn(),
    getUserProfile: vi.fn(),
    getPrismRedirect: vi.fn(),
  },
};

// Mock the module containing createApiClient
vi.mock('../../src/api', () => ({
  createApiClient: vi.fn(() => mockApi), // Mocking createApiClient to return our mockApi object
}));

const setMockAuth0Data = (newData) => {
  mockAuth0Data = { ...mockAuth0Data, ...newData };
};

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    ...mockAuth0Data,
  }),
  Auth0Provider: ({ children }) => children,
}));

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: vi.fn(() => mockNavigate),
}));

const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;

const MockChildComponent = () => {
  const { user } = useUser();
  return <div>{user ? 'User' : 'No User'}</div>;
};

describe('UserProvider', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        assign: vi.fn(),
        replace: vi.fn(),
      },
      writable: true,
    });

    mockNavigate = vi.fn();
    mockApi.profiles.getUserProfileWithStatus.mockClear();
    mockApi.profiles.getUserProfile.mockClear();
    mockApi.profiles.getPrismRedirect.mockClear();
    vi.mocked(isUnfinishedQuickhire).mockClear();
    vi.mocked(isUnfinishedQuickhire).mockReturnValue(false);

    mockAuth0Data = {
      isAuthenticated: true,
      user: { user_metadata: { prehire: false } },
      hcm_roles: [],
      getAccessTokenSilently: mockGetAccessTokenSilently,
      logout: mockLogout,
    };
  });

  it('handles terminated employee by redirecting', async () => {
    renderHook(() => useUser(), { wrapper });

    mockApi.profiles.getUserProfileWithStatus.mockResolvedValue({
      results: { employee_status: 'T' },
    });

    mockApi.profiles.getPrismRedirect.mockResolvedValue({
      results: 'https://prism.com/redirect-url',
    });

    await waitFor(() => {
      expect(window.location.href).toBe('https://prism.com/redirect-url');
    });
  });

  it('redirects prehire user to onboarding flow', async () => {
    setMockAuth0Data({ user: { user_metadata: { prehire: true } } });

    renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(paths.startOnboarding);
    });
  });

  it('does not redirect non-prehire user', async () => {
    renderHook(() => useUser(), { wrapper });

    setMockAuth0Data({ user: { user_metadata: { prehire: false } } });

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(paths.startOnboarding);
    });
  });

  it('renders without crashing', async () => {
    renderHook(() => useUser(), { wrapper });

    setMockAuth0Data({
      user: { user_metadata: { prehire: true } },
    });

    expect(screen.queryByText('Loading')).not.toBeTruthy();
  });

  it('sets user data and roles correctly', async () => {
    setMockAuth0Data({ user: { hcm_roles: ['Developer'] } });

    const { result } = renderHook(() => useUser(), { wrapper });

    mockApi.profiles.getUserProfileWithStatus.mockResolvedValue({
      results: {
        first_name: 'Developer',
        last_name: 'User',
        employee_status: 'A',
        company: { id: '000001', name: 'Test Company' },
        prism_active_status: true,
      },
    });

    await waitFor(() => {
      expect(result.current.user.first_name).toBe('Developer');
    });
  });

  it('initializes user on component mount', async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    mockApi.profiles.getUserProfileWithStatus.mockResolvedValue({
      results: {
        first_name: 'User',
        last_name: 'Test',
        employee_status: 'A',
        company: { id: '000001', name: 'Test Company' },
        prism_active_status: true,
      },
    });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
      expect(result.current.user.first_name).toBe('User');
    });
  });

  it('redirects user with incomplete onboarding', async () => {
    renderHook(() => useUser(), { wrapper });
    mockApi.profiles.getUserProfileWithStatus.mockResolvedValue({
      results: { status: 'benefit_enrollment_incomplete' },
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(paths.enrollmentWrapper);
    });
  });

  it('sets user role data correctly for an admin user', async () => {
    const { result } = renderHook(() => useUser(), { wrapper });
    setMockAuth0Data({ user: { hcm_roles: ['Administrator'] } });

    mockApi.profiles.getUserProfileWithStatus.mockResolvedValue({
      results: {
        first_name: 'Admin',
        last_name: 'User',
        employee_status: 'A',
        company: { id: '000001', name: 'Test Company' },
        prism_active_status: true,
      },
    });

    await waitFor(() => {
      if (result.current) {
        expect(result.current.user.is_admin).toBeTruthy();
      }
    });
  });

  it('does not redirect or show error for a regular user', async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    mockApi.profiles.getUserProfileWithStatus.mockResolvedValue({
      results: {
        first_name: 'User',
        last_name: 'Test',
        employee_status: 'A',
        company: { id: '000001', name: 'Test Company' },
        prism_active_status: true,
      },
    });

    await waitFor(() => {
      if (result.current) {
        expect(result.current.user.first_name).toBe('User');
        expect(mockNavigate).not.toHaveBeenCalled();
      }
    });
  });

  it('shows loading initially and then resolves', async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    mockApi.profiles.getUserProfileWithStatus.mockResolvedValue({
      results: {
        first_name: 'John',
        last_name: 'Doe',
        employee_status: 'A',
        company: { id: '000001', name: 'Test Company' },
        prism_active_status: true,
      },
    });

    await waitFor(() => {
      if (result.current) {
        expect(result.current.loading).toBeTruthy();
      }
    });

    await waitFor(() => {
      if (result.current) {
        expect(result.current.loading).toBeFalsy();
      }
    });
  });

  it('sets error state when there is a problem in user profile fetch', async () => {
    setMockAuth0Data({ user: { user_metadata: { prehire: false } } });

    mockApi.profiles.getUserProfileWithStatus.mockRejectedValue(
      new Error('API error')
    );

    renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Sorry! Something went wrong.')).toBeTruthy();
    });
  });

  it('does not redirect or make additional API calls for regular users', async () => {
    setMockAuth0Data({ user: { user_metadata: { prehire: false } } });

    renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(paths.startOnboarding);
      expect(mockNavigate).not.toHaveBeenCalledWith(paths.enrollmentWrapper);
      expect(mockApi.profiles.getPrismRedirect).not.toHaveBeenCalled();
    });
  });

  it('sets error state when getPrismRedirect API call fails', async () => {
    mockApi.profiles.getUserProfileWithStatus.mockResolvedValue({
      results: { employee_status: 'T' },
    });

    mockApi.profiles.getPrismRedirect.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(result.current).toBeNull();
      expect(screen.getByText('Sorry! Something went wrong.')).toBeTruthy();
    });
  });

  it('completes user initialization with expected attributes', async () => {
    setMockAuth0Data({
      user: { email: 'test@example.com' },
    });

    mockApi.profiles.getUserProfileWithStatus.mockResolvedValue({
      results: {
        first_name: 'Test',
        last_name: 'User',
        employee_status: 'A',
        company: { id: '000001', name: 'Test Company' },
        prism_active_status: true,
      },
    });

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(
        expect.objectContaining({
          first_name: 'Test',
          last_name: 'User',
          login_email: 'test@example.com',
        })
      );
    });
  });

  it('renders children after successful user initialization', async () => {
    mockApi.profiles.getUserProfileWithStatus.mockResolvedValue({
      results: {
        first_name: 'User',
        last_name: 'Test',
        employee_status: 'A',
        company: { id: '000001', name: 'Test Company' },
        prism_active_status: true,
      },
    });

    const { findByText } = render(
      <UserProvider>
        <MockChildComponent />
      </UserProvider>
    );

    const childComponent = await findByText('User');
    expect(childComponent).toBeTruthy();
  });

  it('does not render children if an error occurs', async () => {
    mockApi.profiles.getUserProfileWithStatus.mockRejectedValue(
      new Error('API error')
    );

    const { queryByText } = render(
      <UserProvider>
        <MockChildComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(queryByText('Sorry! Something went wrong.')).toBeTruthy();
    });

    expect(queryByText('User')).toBeNull();
  });

  it('handles quickhire in progress user', async () => {
    setMockAuth0Data({
      user: {
        user_metadata: { prehire: false },
        given_name: 'John',
        family_name: 'Doe',
        email: 'john.doe@example.com',
      },
    });

    vi.mocked(isUnfinishedQuickhire).mockReturnValue(true);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(
        expect.objectContaining({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
        })
      );
    });
  });

  it('sets entities from profile response', async () => {
    const mockEntities = [
      { id: '1', name: 'Entity 1' },
      { id: '2', name: 'Entity 2' },
    ];

    mockApi.profiles.getUserProfileWithStatus.mockResolvedValue({
      results: {
        first_name: 'User',
        last_name: 'Test',
        employee_status: 'A',
        company: { id: '000001', name: 'Test Company' },
        entities: mockEntities,
        prism_active_status: true,
      },
    });

    const { result } = renderHook(() => useUser(), { wrapper });

    // Wait for loading to be false first
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.entities).toEqual(mockEntities);
    });

    await waitFor(() => {
      expect(result.current.entity).toEqual(mockEntities[0]);
    });
  });

  it('handles refresh with entity change', async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    mockApi.profiles.getUserProfileWithStatus.mockResolvedValue({
      results: {
        first_name: 'User',
        last_name: 'Test',
        employee_status: 'A',
        company: { id: '000001', name: 'Test Company' },
        prism_active_status: true,
      },
    });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    });

    const newEntity = { id: '2', name: 'New Entity' };
    mockApi.profiles.getUserProfile.mockResolvedValue({
      results: {
        first_name: 'User',
        last_name: 'Test',
        employee_status: 'A',
        company: { id: '000001', name: 'Test Company' },
        entities: [newEntity],
        prism_active_status: true,
      },
    });

    await result.current.refreshEntity(newEntity);

    await waitFor(() => {
      expect(result.current.entity).toEqual(newEntity);
    });
  });
});
