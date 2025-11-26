import { useAuth0 } from '@auth0/auth0-react';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ApiClientType, createApiClient } from '../api';
import { ApiContext, initialContext } from '../hooks/useApi';
import { useUser } from '../hooks/useUser';

export const ApiProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { entity } = useUser();
  const {
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user: auth0User,
  } = useAuth0();

  const [apiClient, setApiClient] = useState<ApiClientType>(initialContext);
  const location = useLocation();

  useEffect(() => {
    const initApiClient = async () => {
      if (isLoading) return;

      if (!isAuthenticated) {
        await loginWithRedirect({
          appState: {
            returnTo: `${window.location.origin}${location.pathname}`,
          },
        });
        return null;
      }

      const token = await getAccessTokenSilently();

      const apiClientInstance = createApiClient(token, entity, auth0User);
      setApiClient(apiClientInstance);
    };

    initApiClient();
  }, [
    entity,
    auth0User,
    getAccessTokenSilently,
    isLoading,
    isAuthenticated,
    loginWithRedirect,
  ]);

  if (isLoading || apiClient === initialContext) {
    return null;
  }

  return (
    <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>
  );
};
