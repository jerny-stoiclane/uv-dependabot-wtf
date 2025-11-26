import { useNotifications } from '@armhr/ui';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Link, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useApi } from '../../hooks/useApi';

const RedirectPtoApprovals: React.FC = () => {
  const { showNotification } = useNotifications();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const api = useApi();

  const handlePrism = async () => {
    setLoading(true);
    try {
      const response = await api.profiles.getPrismRedirect();
      const prismUrl = response.results;

      if (!prismUrl) {
        showNotification({
          severity: 'error',
          message:
            'Something went wrong. Please use the link on the sidebar on the left.',
        });
        return;
      }

      const newWindow = window.open(prismUrl, '_blank');

      if (newWindow === null) {
        showNotification({
          severity: 'error',
          message: (
            <>
              Launching the Back Office admin in a new window was blocked.
              Please allow popups and try again, or click the link below to
              continue: <Link href={prismUrl}>{prismUrl}</Link>
            </>
          ),
        });
      }
    } catch (error) {
      showNotification({
        severity: 'error',
        message:
          'Failed to open the Back Office admin. Please use the link on the sidebar to the left.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography variant="h2">Time off requests</Typography>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            color="primary"
            onClick={handlePrism}
          >
            Open Back office admin
          </LoadingButton>
        </Box>
      </Box>

      <Alert color="warning" severity="warning" sx={{ mb: 4 }}>
        <Typography>
          To approve time off requests, please use the{' '}
          <Link sx={{ cursor: 'pointer' }} onClick={handlePrism}>
            Back office admin{' '}
          </Link>
          .
        </Typography>
      </Alert>
    </>
  );
};

export default RedirectPtoApprovals;
