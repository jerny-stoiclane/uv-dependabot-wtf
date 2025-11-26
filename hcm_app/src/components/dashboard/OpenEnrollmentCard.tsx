import { MainCard, useNotifications } from '@armhr/ui';
import { Download } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { differenceInCalendarDays, isAfter, isEqual, parseISO } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import openSvg from '../../assets/open-enrollment.svg';
import { useApi } from '../../hooks/useApi';
import { useUser } from '../../hooks/useUser';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';
import { exportBenefitsConfirmationPdf } from '../../utils/pdf';

const OpenEnrollmentCard: React.FC<{
  onClick?: () => void;
}> = ({ onClick }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const api = useApi();

  const endDate = user?.enrollment_status?.end_date;

  if (!user?.enrollment_status?.is_active || !endDate) {
    return null;
  }

  const daysRemaining = calculateDaysRemaining(endDate);

  const handleGotoEnrollment = () => {
    onClick
      ? onClick()
      : navigate(paths.openEnrollment, {
          state: { origin: 'dashboard' },
        });
  };

  const handleConfirmation = async () => {
    setLoading(true);
    try {
      const response = await api.benefits.getBenefitsConfirmation();
      if (response.results) {
        await exportBenefitsConfirmationPdf(
          response.results as EnrollmentConfirmation
        );
        showNotification({
          message: 'Benefits confirmation downloaded successfully',
          severity: 'success',
          autoHideDuration: 5000,
        });
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Error exporting benefits confirmation PDF:', error);
      showNotification({
        message:
          'Failed to download confirmation, please try again. If the problem persists, contact your HR administrator.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const startDate = user?.enrollment_status?.start_date;
  const referenceDate = parseISO('2024-05-27');

  const wsgUrl =
    startDate &&
    (isAfter(parseISO(startDate), referenceDate) ||
      isEqual(parseISO(startDate), referenceDate))
      ? 'https://calendly.com/armhr/2024-open-enrollment-3?month=2024-05'
      : 'https://calendly.com/armhr/2024-open-enrollment';

  return (
    <MainCard
      border={false}
      sx={{
        transition: 'all 0.3s ease-in-out',
        background: 'hsla(210, 100%, 96%, 0.5)',
        border: '1px solid hsl(210, 100%, 70%) !important',
        borderRadius: '12px',
        boxShadow:
          'hsla(210, 100%, 90%, 0.5) 0 -3px 1px inset, hsla(210, 100%, 90%, 0.3) 0 2px 4px 0',
      }}
    >
      <Grid container>
        <Grid
          item
          sm={3.5}
          xs={12}
          sx={{ display: { xs: 'none', sm: 'initial' } }}
        >
          <Stack
            sx={{ position: 'relative' }}
            justifyContent="center"
            alignItems="flex-start"
          >
            <img width={220} src={openSvg} alt="Welcome" />
          </Stack>
        </Grid>
        <Grid item md={8.5} sm={8.5} xs={12}>
          <Stack spacing={2} sx={{ p: 2, pb: 0 }}>
            <Typography variant="h2">
              It&apos;s time to enroll in benefits!
            </Typography>
            <Typography variant="body1">
              You are now eligible to enroll in benefits for the new plan year.
              Whether you choose to participating or waive, it is important to
              complete the process to let your company know your election
              decisions by: <strong>{formatDate(endDate)}</strong>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'space-between',
                flexDirection: ['column', 'row'],
                mt: 1,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1 }}>
                <Typography variant="caption">Time remaining</Typography>
                <Typography variant="h6">
                  <strong>{daysRemaining} days</strong>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    href={wsgUrl}
                    target="_blank"
                    size="large"
                  >
                    Schedule 1:1 Enrollment
                  </Button>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={handleGotoEnrollment}
                  >
                    Go to Self Enrollment
                  </Button>
                </Box>
                <LoadingButton
                  size="small"
                  loading={loading}
                  variant="text"
                  startIcon={<Download />}
                  onClick={handleConfirmation}
                  sx={{ ml: 'auto' }}
                >
                  Download confirmation
                </LoadingButton>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

const calculateDaysRemaining = (endDate) => {
  if (!endDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(`${endDate}T00:00`);
  return differenceInCalendarDays(end, today);
};

export default OpenEnrollmentCard;
