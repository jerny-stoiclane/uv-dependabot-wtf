import { Auth0Provider } from '@auth0/auth0-react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const domain = import.meta.env.VITE_APP_DOMAIN;
  const clientId = import.meta.env.VITE_APP_CLIENT_ID;
  const scope = import.meta.env.VITE_APP_SCOPE;
  const audience = import.meta.env.VITE_APP_AUDIENCE;
  const redirectUri = `${window.location.origin}/callback`;
  const cacheLocation = import.meta.env.DEV ? 'localstorage' : 'memory';

  if (!domain || !clientId) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={redirectUri}
      scope={scope}
      audience={audience}
      cacheLocation={cacheLocation}
      authorizationParams={{
        scope,
        audience,
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={(appState) => {
        const returnTo = appState?.returnTo || window.location.origin;
        window.location.href = returnTo;
      }}
    >
      {children}
    </Auth0Provider>
  );
};
