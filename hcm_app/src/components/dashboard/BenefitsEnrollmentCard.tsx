import { MainCard } from '@armhr/ui';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import openSvg from '../../assets/open-enrollment.svg';
import { useUser } from '../../hooks/useUser';
import { paths } from '../../utils/paths';

const BenefitsEnrollmentCard: React.FC<{
  onClick?: () => void;
}> = ({ onClick }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  // const startDate = new Date('2024-11-19');

  const oeProgress = user?.enrollment_status?.is_enrollment_in_progress;

  if (!oeProgress || !oeProgress.enrollmentInProgress) {
    return null;
  }

  const handleGotoEnrollment = () => {
    onClick
      ? onClick()
      : navigate(paths.openEnrollment, {
          state: { origin: 'dashboard' },
        });
  };

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
      contentSX={{ px: 0, py: 1 }}
    >
      <Grid container>
        <Grid
          item
          sm={4}
          xs={12}
          sx={{ display: { xs: 'none', sm: 'initial' } }}
        >
          <Stack
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pt: 1,
            }}
          >
            <img width={180} src={openSvg} alt="Welcome" />
          </Stack>
        </Grid>
        <Grid item sm={8} xs={12}>
          <Stack spacing={2} sx={{ py: 2, pb: 0 }}>
            <Typography variant="h3">Benefits enrollment</Typography>
            <Typography variant="body1">
              You are now eligible to begin or continue benefit enrollment.
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
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" onClick={handleGotoEnrollment}>
                    Go to Enrollment
                  </Button>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};
export default BenefitsEnrollmentCard;
