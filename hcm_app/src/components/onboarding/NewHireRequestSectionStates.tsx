import { Box, Stack, Typography } from '@mui/material';

import { formatDate } from '../../utils/date';
import NewHireStateChip from './NewHireStateChip';

const NewHireRequestSectionStates: React.FC<{
  newHireRequest: NewHireRequest;
}> = ({ newHireRequest }) => {
  return (
    <>
      {newHireRequest.fsm_state === 'created' && (
        <Box>
          <Stack spacing={1}>
            <NewHireStateChip state={newHireRequest.fsm_state as any} />

            <Typography variant="body2" sx={{ my: 1 }}>
              Sent at: {formatDate(newHireRequest.created_at, 'WITH_TIME')}{' '}
              <br />
            </Typography>
          </Stack>
        </Box>
      )}

      {newHireRequest.fsm_state === 'user_partial_complete' && (
        <Stack spacing={1}>
          <NewHireStateChip state={newHireRequest.fsm_state as any} />

          <Typography variant="body2" sx={{ my: 1 }}>
            Updated at: {formatDate(newHireRequest.created_at, 'WITH_TIME')}{' '}
          </Typography>
        </Stack>
      )}

      {newHireRequest.fsm_state === 'user_registration' && (
        <Stack spacing={1}>
          <NewHireStateChip state={newHireRequest.fsm_state as any} />

          <Typography variant="body2" sx={{ my: 1 }}>
            Updated at: {formatDate(newHireRequest.created_at, 'WITH_TIME')}{' '}
          </Typography>
        </Stack>
      )}

      {newHireRequest.fsm_state === 'user_prism_onboarding' && (
        <Stack spacing={1}>
          <NewHireStateChip state={newHireRequest.fsm_state as any} />

          <Typography variant="body2" sx={{ my: 1 }}>
            started {formatDate(newHireRequest.created_at, 'SHORT')} at{' '}
            {formatDate(newHireRequest.created_at, 'h:mm aaa')}{' '}
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default NewHireRequestSectionStates;
