import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const PrismLogoutPage = () => {
  const { isAuthenticated, isLoading, error } = useAuth0();

  useEffect(() => {
    const debugInfo = () => {
      try {
        console.log('window.location', window.location);
        console.log('document.referrer', document.referrer);
        console.log('navigator.userAgent', navigator.userAgent);
      } catch (err) {
        console.error('Error accessing debug information:', err);
      }
    };

    const sendMessageToParent = () => {
      try {
        if (isLoading) return;

        const message = {
          type: 'THIRD_PARTY_LOGOUT',
          isAuthenticated: isAuthenticated && !error,
          timestamp: Date.now(),
        };

        const parentOrigin = import.meta.env.VITE_APP_FRONTEND_BASE_URL;

        window.parent.postMessage(message, parentOrigin);
      } catch (err) {
        console.error('Error sending message to parent window:', err);
      }
    };

    debugInfo();
    sendMessageToParent();
  }, [isAuthenticated, isLoading, error]);

  return (
    <div>
      <Helmet>
        <title>Logout | Armhr</title>
      </Helmet>
      <p>Processing logout...</p>
    </div>
  );
};

export default PrismLogoutPage;
