import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

import { useApiData } from '../../hooks/useApiData';
import { useUser } from '../../hooks/useUser';

const AttendanceCard: React.FC = () => {
  const { user } = useUser();

  const {
    data: timecardUrl,
    error: timecardError,
    loading: timecardLoading,
  } = useApiData<string>((api) => api.attendance.getTimecardRedirect());

  const {
    data: clockUrl,
    error: clockError,
    loading: clockLoading,
  } = useApiData<string>((api) => api.attendance.getClockRedirect());

  const isLoading = timecardLoading || clockLoading;

  if (
    !isLoading &&
    (timecardError || clockError || !clockUrl || !timecardUrl)
  ) {
    return (
      <Alert severity="error">
        An error occured while loading the attendance page. Please refresh and
        try again
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          color="initial"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          Time & attendance
        </Typography>
      </Box>
      {isLoading ? (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack direction="column" spacing={1}>
          {clockUrl && !user?.is_swipeclock_enabled_no_clock && (
            <Card>
              <iframe
                src={clockUrl}
                title="SwipeClock"
                style={{ width: '100%', height: 180, border: 'none' }}
              />
            </Card>
          )}
          {timecardUrl && (
            <Card>
              <iframe
                src={timecardUrl}
                title="SwipeClock"
                style={{ width: '100%', height: 630, border: 'none' }}
              />
            </Card>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default AttendanceCard;
