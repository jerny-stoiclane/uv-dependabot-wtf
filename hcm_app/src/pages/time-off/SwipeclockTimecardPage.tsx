import { PageSpinner } from '@armhr/ui';
import { Alert, Box, Card, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { useApiData } from '../../hooks/useApiData';
import { useUser } from '../../hooks/useUser';
import { paths } from '../../utils/paths';

const SwipeclockTimecardPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const {
    data: swipeClockUrl,
    error: timecardError,
    loading: timecardLoading,
  } = useApiData<string>((api) => api.attendance.getTimecardRedirect());

  const {
    data: clockUrl,
    error: clockError,
    loading: clockLoading,
  } = useApiData<string>((api) => api.attendance.getClockRedirect());

  if (!user?.is_swipeclock_enabled) {
    navigate(paths.dashboard);
    return null;
  }

  if (timecardLoading || clockLoading) {
    return <PageSpinner />;
  }

  if (timecardError || clockError || !clockUrl || !swipeClockUrl) {
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
        <title>Time Card | Armhr</title>
        <meta
          name="description"
          content="View and manage your time card and attendance."
        />
      </Helmet>
      <Box sx={{ display: 'flex', mb: 4 }}>
        <Typography variant="h2">Time & attendance</Typography>
      </Box>
      {!user?.is_swipeclock_enabled_no_clock && (
        <Card>
          <iframe
            loading="lazy"
            src={clockUrl}
            title="SwipeClock"
            style={{ width: '100%', height: 250, border: 'none' }}
          />
        </Card>
      )}
      <iframe
        loading="lazy"
        src={swipeClockUrl}
        title="SwipeClock"
        style={{ width: '100%', height: '100vh', border: 'none' }}
      />
    </Box>
  );
};

export default SwipeclockTimecardPage;
