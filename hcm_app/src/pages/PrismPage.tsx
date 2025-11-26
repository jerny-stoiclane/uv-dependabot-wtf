import { PageSpinner, useNav, useNotifications } from '@armhr/ui';
import { useAuth0 } from '@auth0/auth0-react';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCompany } from '../contexts/company.context';
import { useApi } from '../hooks/useApi';
import { useApiData } from '../hooks/useApiData';
import { useUser } from '../hooks/useUser';

// const ALLOWED_ORIGINS = [
//   'http://localhost:3200',
//   'https://app.staging.armhr.com',
//   'https://app.armhr.com',
// ];

const PrismPage: React.FC<{
  title?: string;
  fluid?: boolean;
  titleButton?: React.ReactNode;
  queryString?: string;
}> = ({ title, titleButton, fluid = true, queryString }) => {
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const { showNotification } = useNotifications();
  const { entity } = useUser();
  const { setFluid } = useNav();
  const company = useCompany();
  const clientId = entity?.client_id || company?.id;
  const api = useApi();
  const [sessionError, setSessionError] = useState(false);
  const [backOfficeLoading, setBackOfficeLoading] = useState(false);

  const { data, error, loading } = useApiData<string>((api) =>
    api.profiles.getPrismHeadlessRedirect('ESS.2.0', clientId, queryString)
  );

  // Check for corrupted sessionId in the URL
  useEffect(() => {
    if (data && !loading) {
      try {
        const url = new URL(data);
        const sessionId = url.hash.match(/sessionId=([^&]+)/)?.[1];
        if (sessionId) {
          const decodedSessionId = decodeURIComponent(sessionId);
          if (/[<>"']/.test(decodedSessionId)) {
            setSessionError(true);
          }
        }
      } catch (error) {
        console.error('Error parsing URL:', error);
        setSessionError(true);
      }
    }
  }, [loading, data]);

  useEffect(() => {
    if (fluid) {
      setFluid(true);
    }
    return () => {
      if (fluid) {
        setFluid(false);
      }
    };
  }, [setFluid, fluid]);

  useEffect(() => {
    if (!loading && error) {
      showNotification({ message: true, severity: 'error' });
      navigate(-1);
    }
  }, [loading, error, showNotification]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        console.log('Received message event:', event);

        const { type, isAuthenticated: iframeIsAuthenticated } =
          event.data || {};

        // Validate message structure
        if (type !== 'THIRD_PARTY_LOGOUT') {
          console.warn('Received unknown message type:', type);
          return;
        }

        if (typeof iframeIsAuthenticated !== 'boolean') {
          console.warn('Invalid isAuthenticated value:', iframeIsAuthenticated);
          return;
        }

        if (iframeIsAuthenticated) {
          // User is still authenticated in Auth0
          console.log('User is authenticated in Auth0, refreshing iframe');
          const iframe = document.getElementById(
            'prism-iframe'
          ) as HTMLIFrameElement;
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.location.reload();
          }
        } else {
          // User is not authenticated in Auth0
          console.log('User is not authenticated, logging out');
          logout({ returnTo: window.location.origin });
        }
      } catch (error) {
        console.error('Error handling message event:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [logout]);

  const handleBackOfficePortal = async () => {
    try {
      setBackOfficeLoading(true);
      const resp = await api.profiles.getPrismRedirect('', clientId);
      if (resp.results) {
        window.open(
          resp.results +
            (queryString ? queryString.replace('&hideNavHeader=True', '') : ''),
          '_blank'
        );
      } else {
        showNotification({
          message:
            'Opening the Back office portal failed. Please refresh and try again',
          severity: 'error',
        });
      }
    } catch (err) {
      showNotification({
        message:
          'Opening the Back office portal failed. Please refresh and try again',
        severity: 'error',
      });
    } finally {
      setBackOfficeLoading(false);
    }
  };

  if (loading) {
    return <PageSpinner />;
  }

  if (!data) {
    showNotification({ message: true, severity: 'error' });
    navigate(-1);
    return null;
  }

  // Show error screen for corrupted sessionId
  if (sessionError) {
    return (
      <Box display="flex" flexDirection="column" height="100vh">
        {title && (
          <Box sx={{ display: 'flex', px: 4, py: 2, alignItems: 'center' }}>
            <Typography variant="h2" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            {titleButton}
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Alert severity="error" sx={{ mb: 3, maxWidth: 600, py: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }} fontWeight="bold">
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              There was an issue with your session. Our team has been notified
              and will investigate the issue. Please try again later. We
              apologize for any inconvenience.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              For now you can use the Back Office Portal to continue your work.
            </Typography>
            <Button
              variant="contained"
              onClick={handleBackOfficePortal}
              disabled={backOfficeLoading}
              sx={{ my: 1 }}
            >
              {backOfficeLoading ? 'Opening...' : 'Open Back Office Portal'}
            </Button>
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {title && (
        <Box sx={{ display: 'flex', px: 4, py: 2, alignItems: 'center' }}>
          <Typography variant="h2" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {titleButton}
        </Box>
      )}
      <iframe
        id="prism-iframe"
        src={data}
        title="Prism"
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </Box>
  );
};

export default PrismPage;
