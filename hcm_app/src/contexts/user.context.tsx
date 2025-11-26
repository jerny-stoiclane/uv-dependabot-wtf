import { FullPageSpinner, PageSpinner } from '@armhr/ui';
import { useAuth0 } from '@auth0/auth0-react';
import { datadogRum } from '@datadog/browser-rum';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ApiClientType, createApiClient } from '../api';
import ErrorScreen, { DetailedError } from '../components/common/ErrorScreen';
import { UserContext } from '../hooks/useUser';
import { getCompanyConfigValue } from '../utils/companyConfig';
import { FEATURE_FLAGS, isFeatureFlagEnabled } from '../utils/feature-flags';
import { paths } from '../utils/paths';
import { isUnfinishedQuickhire } from '../utils/user';

export const UserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const navigate = useNavigate();
  const { logout, user: auth0User, getAccessTokenSilently } = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [entity, setEntity] = useState<ClientEntity | undefined>(undefined);
  const [entities, setEntities] = useState<ClientEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    setLoading(true);
    try {
      if (import.meta.env.PROD) {
        datadogRum.setUser({
          ...auth0User,
          ...(entity ? entity : {}),
          git_sha: import.meta.env.VITE_APP_GIT_SHA,
        });
      }

      // cant use api context here because it would create a circular dependency
      const token = await getAccessTokenSilently();
      const apiClient = createApiClient(token, entity, auth0User);

      // check if user is an unfinished quickhire user (meaning they aren't a prehire yet but have an auth0 account)
      if (await isQuickhireInProgress()) return;

      // check if in prehire state and redirect
      if (await isPrehireUser()) return;

      // get the user profile and set it in the context
      await getUserProfile(apiClient);
    } catch (err) {
      if (import.meta.env.PROD) {
        datadogRum.addError(new Error('User failed to initialize'), {
          user: auth0User,
          error: err,
        });
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const isPrehireUser = async () => {
    if (auth0User?.user_metadata?.prehire) {
      navigate(paths.startOnboarding);
      return true;
    }
    return false;
  };

  const isQuickhireInProgress = async () => {
    if (isUnfinishedQuickhire(auth0User)) {
      const usr: Partial<User> = {
        ...auth0User,
        first_name: auth0User?.given_name || '',
        last_name: auth0User?.family_name || '',
      };
      setUser(usr as User);
      setCompany(null);
      setEntity(undefined);
      return true;
    }
    return false;
  };

  const getUserProfile = async (apiClient: ApiClientType) => {
    const profileResponse = await apiClient.profiles.getUserProfileWithStatus();

    // Check status first for potential onboarding redirect
    if (profileResponse?.results?.status === 'benefit_enrollment_incomplete') {
      navigate(paths.enrollmentWrapper);
      return;
    }

    if (!profileResponse.results) {
      throw new DetailedError('Failed to get user profile', {
        profileResponse,
      });
    }

    if (profileResponse.results.employee_status === 'T') {
      await handleTerminatedEmployee(apiClient);
    } else if (!profileResponse.results.prism_active_status) {
      navigate(paths.logout);
    } else {
      // Check if we have a full profile response (not early exit)
      if (
        'first_name' in profileResponse.results &&
        'company' in profileResponse.results
      ) {
        if (!auth0User) throw new Error('Auth0 user not found');

        const userData = createUserData(profileResponse.results, auth0User);

        setUser(userData);
        setCompany(profileResponse.results.company);

        // Set entities from the profile response (for multi entity support)
        if (profileResponse.results.entities) {
          setEntities(profileResponse.results.entities);
          // Set the first entity (which is the default one) as the current entity
          if (profileResponse.results.entities.length > 0) {
            setEntity(profileResponse.results.entities[0]);
          }
        }
      } else {
        // This shouldn't happen in normal flow, but handle gracefully
        console.warn(
          'Received early exit response but no redirect was triggered',
          profileResponse.results
        );
      }
    }
  };

  const handleTerminatedEmployee = async (
    apiClient: ReturnType<typeof createApiClient>
  ) => {
    const redirectResponse = await apiClient.profiles.getPrismRedirect();
    if (redirectResponse.results) {
      window.location.href = redirectResponse.results;
    } else {
      throw new DetailedError('Failed to get prism redirect', {
        response: redirectResponse,
      });
    }
  };

  const handleRefresh = async (options?: RefreshOptions) => {
    // some updates to a user's profile require a refresh so parts of the app
    // like the user dropdown and navigation can be updated
    const token = await getAccessTokenSilently();
    const entity = options?.entity;
    const showSpinner = !options?.disableSpinner;
    const apiClient = createApiClient(token, entity, auth0User);
    try {
      showSpinner && setRefreshing(true);
      const profileResponse =
        await apiClient.profiles.getUserProfileWithStatus();

      if (
        'first_name' in profileResponse.results &&
        'company' in profileResponse.results
      ) {
        if (!auth0User) throw new Error('Auth0 user not found');
        const userData = createUserData(profileResponse.results, auth0User);
        setUser(userData);
        setCompany(profileResponse.results.company);

        // Update entities from the profile response
        if (profileResponse.results.entities) {
          setEntities(profileResponse.results.entities);
        }

        entity && setEntity(entity);
      }
    } catch (err) {
      setError(true);
    } finally {
      showSpinner && setRefreshing(false);
    }
  };

  const handleRefreshEntity = async (entity: ClientEntity) => {
    handleRefresh({ entity });
  };

  if (loading) return <PageSpinner />;

  if (error) return <ErrorScreen logout={logout} />;

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        entity,
        entities,
        company,
        loading,
        setUser,
        refresh: handleRefresh,
        refreshEntity: handleRefreshEntity,
      }}
    >
      <FullPageSpinner open={refreshing} />
      {children}
    </UserContext.Provider>
  );
};

const createUserData = (profileData: User, auth0User: Auth0User) => {
  const roles = auth0User?.hcm_roles || [];
  const company = profileData.company;

  const userData: Partial<User> = {
    ...profileData,
    login_email: auth0User?.email,
    is_admin: roles.includes('Administrator'),
    is_swipeclock_enabled:
      getCompanyConfigValue(company, 'swipeclock_enabled', false) ||
      getCompanyConfigValue(company, 'swipeclock_enabled_no_clock', false),
    is_swipeclock_enabled_no_clock: getCompanyConfigValue(
      company,
      'swipeclock_enabled_no_clock',
      false
    ),
    is_armhr_pto_enabled: getCompanyConfigValue(
      company,
      'armhr_pto_enabled',
      true
    ),
    is_access_request_enabled: isFeatureFlagEnabled(
      auth0User,
      FEATURE_FLAGS.ACCESS_REQUEST
    ),
    is_hiring_enabled: isFeatureFlagEnabled(auth0User, FEATURE_FLAGS.HIRING),
    is_work_email_enabled: getCompanyConfigValue(
      company,
      'new_hire_work_email',
      false
    ),
    is_bulk_import_new_hires_enabled: getCompanyConfigValue(
      company,
      'bulk_import_new_hires_enabled',
      false
    ),
    is_bonus_tax_withholding_enabled: isFeatureFlagEnabled(
      auth0User,
      FEATURE_FLAGS.BONUS_TAX_FORM
    ),
  };
  return userData as User;
};
