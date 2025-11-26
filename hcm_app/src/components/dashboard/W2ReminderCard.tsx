import { MainCard, useNotifications } from '@armhr/ui';
import { LoadingButton } from '@mui/lab';
import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useApi } from '../../hooks/useApi';

const W2ReminderCard: React.FC<{}> = () => {
  const { showNotification } = useNotifications();
  const [prismLoading, setPrismLoading] = useState('');
  const api = useApi();

  const handlePrism = async (componentId) => {
    try {
      setPrismLoading(componentId);
      const resp = await api.profiles.getPrismRedirect(componentId);
      if (resp) {
        window.open(resp.results, '_blank');
      } else {
        showNotification({
          message:
            'There was an error opening the Back office portal. Refresh and try again',
          severity: 'error',
        });
      }
    } catch (error) {
      showNotification({
        message:
          'There was an error opening the Back office portal. Refresh and try again',
        severity: 'error',
      });
    } finally {
      setPrismLoading('');
    }
  };

  return (
    <MainCard
      border={false}
      sx={{
        transition: 'all 0.3s ease-in-out',
        background: 'hsla(210, 100%, 96%, 0.5)',
        borderRadius: '12px',
        boxShadow:
          'hsla(210, 100%, 90%, 0.5) 0 -3px 1px inset, hsla(210, 100%, 90%, 0.3) 0 2px 4px 0',
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h3">W-2 season is coming!</Typography>
        <Typography variant="body1">
          Be sure to review your personal information such as home address and
          name to ensure accuracy of your W-2. Navigate to the Back Office
          portal if you wish to enroll in Electronic W-2 for 2024
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'flex-end',
            flexDirection: ['column', 'row'],
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <LoadingButton
                size="small"
                variant="outlined"
                loading={prismLoading === 'PROFILE_ADDRESS_PAGE'}
                onClick={() => handlePrism('PROFILE_ADDRESS_PAGE')}
              >
                Update personal info
              </LoadingButton>
              <LoadingButton
                size="small"
                variant="contained"
                loading={prismLoading === 'W2_PAGE'}
                onClick={() => handlePrism('W2_PAGE')}
              >
                Go to W-2 Page
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </Stack>
    </MainCard>
  );
};
export default W2ReminderCard;
