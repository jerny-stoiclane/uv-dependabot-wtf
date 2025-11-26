import { useNotifications } from '@armhr/ui';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Card, Link, Stack, Typography } from '@mui/material';
import React from 'react';

import welcomeSvg from '../../assets/welcome.svg';
import { useApi } from '../../hooks/useApi';

const NewHireRequestStateAlerts: React.FC<{
  newHireRequest: NewHireRequest;
}> = ({ newHireRequest }) => {
  const { showNotification } = useNotifications();
  const [loading, setLoading] = React.useState(false);
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
            'Something went wrong. Please use the link on the sidebar on the left or try again.',
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
          'Failed to open the Back Office admin. Please use the link on the sidebar to the left or try again.',
        autoHideDuration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {newHireRequest.fsm_state === 'created' && (
        <Alert severity="warning" sx={{ py: 2, mb: 3 }}>
          <Typography variant="body1" sx={{ lineHeight: '20px' }}>
            This new hire has not provided their personal information yet, this
            form will be updated once they have. <br />
            You can continue if you have that information available (such as
            SSN, Birth date), or resend the request details e-mail above.
          </Typography>
        </Alert>
      )}

      {newHireRequest.fsm_state === 'user_partial_complete' && (
        <Alert severity="success" sx={{ py: 2, mb: 3 }}>
          <Typography variant="body1" sx={{ lineHeight: '20px' }}>
            {newHireRequest.first_name} has provided the required personal
            details and can now continue onboarding with Armhr. Please provide
            the rest of the information below to complete the process.
          </Typography>
        </Alert>
      )}

      {newHireRequest.fsm_state === 'user_registration' && (
        <>
          <Alert
            severity="info"
            sx={{ background: 'rgb(229, 246, 253)', py: 2, mb: 3 }}
          >
            <Typography variant="body1" sx={{ lineHeight: '20px' }}>
              {newHireRequest.first_name} has been sent an e-mail to create
              their Armhr.com account and complete onboarding. Once they have
              completed the process, you will be able to view their information
              in the application.
            </Typography>
          </Alert>
          <Stack
            sx={{ position: 'relative' }}
            justifyContent="center"
            alignItems="center"
          >
            <img width={450} src={welcomeSvg} alt="Welcome" />
          </Stack>
        </>
      )}

      {newHireRequest.fsm_state === 'user_prism_onboarding' && (
        <>
          <Alert
            severity="info"
            sx={{ background: 'rgb(229, 246, 253)', py: 2, mb: 3 }}
          >
            <Typography variant="body1" sx={{ lineHeight: '20px' }}>
              {newHireRequest.first_name} is currently onboarding. Once they are
              finished, they will be able to access the Armhr Employee Portal,
              and you will be able to view their information in the application.
            </Typography>
          </Alert>
          <Card sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              What's next?
            </Typography>
            <Typography variant="body1">
              Once the new hire submits their I-9 information, you may be
              notified to review and approve their forms. <br />
              Use the{' '}
              <Link sx={{ cursor: 'pointer' }} onClick={handlePrism}>
                Back office admin{' '}
              </Link>{' '}
              to do this for now.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={handlePrism}
                loading={loading}
              >
                Back office admin
              </LoadingButton>
            </Box>
          </Card>
          <Stack
            sx={{ position: 'relative' }}
            justifyContent="center"
            alignItems="center"
          >
            <img width={450} src={welcomeSvg} alt="Welcome" />
          </Stack>
        </>
      )}
    </>
  );
};

export default NewHireRequestStateAlerts;
