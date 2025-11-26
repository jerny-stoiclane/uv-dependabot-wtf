import { MainCard, useNotifications } from '@armhr/ui';
import { Download } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useCompany } from '../../contexts/company.context';
import { useApi } from '../../hooks/useApi';

const LaborNoticeCard = () => {
  const { id } = useCompany();
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotifications();

  const handleDownload = async () => {
    try {
      setLoading(true);
      const blob = await api.company.getLaborNotice();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Notice of Filing of a Labor Condition Application.pdf';

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(url);

      showNotification({
        severity: 'success',
        message: 'Labor notice downloaded successfully',
        autoHideDuration: 5000,
      });
    } catch (error) {
      console.error('Failed to download notice:', error);
      showNotification({
        severity: 'error',
        message: 'Failed to download labor notice. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const afterNotice = new Date() > new Date('2025-07-24');

  if (id !== '623085' || afterNotice) {
    return null;
  }

  return (
    <MainCard
      border={false}
      contentSX={{ p: 1 }}
      sx={{
        transition: 'all 0.3s ease-in-out',
        background: 'hsla(45, 100%, 96%, 0.5)',
        border: '1px solid hsl(45, 100%, 70%) !important',
        borderRadius: '12px',
        boxShadow:
          'hsla(45, 100%, 90%, 0.5) 0 -3px 1px inset, hsla(45, 100%, 90%, 0.3) 0 2px 4px 0',
      }}
    >
      <Stack spacing={1} sx={{ p: 3, pb: 0 }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          NOTICE OF FILING OF A LABOR CONDITION APPLICATION
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'hsl(45, 80%, 35%)',
          }}
        >
          7/14/25
        </Typography>
        <Divider />
        <Typography variant="body1" sx={{ fontWeight: 400 }}>
          This notice is provided to you in connection with an E-3 non-immigrant
          worker petition renewal that Heintges will file soon.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            pt: 1,
          }}
        >
          <LoadingButton
            size="small"
            loading={loading}
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownload}
            sx={{ minWidth: 170 }}
          >
            Download notice
          </LoadingButton>
        </Box>
      </Stack>
    </MainCard>
  );
};
export default LaborNoticeCard;
