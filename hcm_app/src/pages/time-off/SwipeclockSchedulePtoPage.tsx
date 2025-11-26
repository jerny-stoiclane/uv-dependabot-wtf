import { PageSpinner } from '@armhr/ui';
import { Alert, Box, Card, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { useApiData } from '../../hooks/useApiData';
import { useUser } from '../../hooks/useUser';
import { paths } from '../../utils/paths';

const SwipeclockSchedulePtoPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const {
    data: ptoUrl,
    loading: ptoLoading,
    error: ptoError,
  } = useApiData<string>((api) => api.attendance.getPtoRedirect());

  const {
    data: scheduleUrl,
    loading: scheduleLoading,
    error: scheduleError,
  } = useApiData<string>((api) => api.attendance.getScheduleRedirect());

  if (!user?.is_swipeclock_enabled) {
    navigate(paths.dashboard);
    return null;
  }

  if (ptoLoading || scheduleLoading) {
    return <PageSpinner />;
  }

  if (ptoError || scheduleError || !ptoUrl || !scheduleUrl) {
    return (
      <Alert severity="error">
        An error occured while loading the attendance page. Please refresh and
        try again
      </Alert>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>Schedule PTO | Armhr</title>
        <meta name="description" content="View your schedule and plan PTO." />
      </Helmet>
      <Box sx={{ display: 'flex', mb: 4 }}>
        <Typography variant="h2">Schedule PTO</Typography>
      </Box>
      <iframe
        src={ptoUrl}
        title="SwipeClock"
        loading="lazy"
        style={{ width: '100%', height: 800, border: 'none' }}
      />
      <Card>
        <iframe
          src={scheduleUrl}
          title="SwipeClock"
          loading="lazy"
          style={{ width: '100%', height: 750, border: 'none' }}
        />
      </Card>
    </Box>
  );
};

export default SwipeclockSchedulePtoPage;
