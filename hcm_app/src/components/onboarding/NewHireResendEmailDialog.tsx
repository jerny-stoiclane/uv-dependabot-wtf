import { ConfirmationDialog } from '@armhr/ui';
import { useNotifications } from '@armhr/ui';
import { LoadingButton } from '@mui/lab';
import { Box, Link, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useApi } from '../../hooks/useApi';

const NewHireResendEmailDialog: React.FC<{
  newHireRequest: NewHireRequest;
}> = ({ newHireRequest }) => {
  const api = useApi();
  const { showNotification } = useNotifications();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleResend = async () => {
    if (newHireRequest?.id) {
      try {
        await api.onboarding.resendNewHireEmail(newHireRequest.id);
        showNotification({
          message: 'Email sent successfully',
          severity: 'success',
        });
        setIsConfirmOpen(false);
      } catch (error) {
        showNotification({
          message:
            'Sorry, there was a problem sending the email. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  if (
    newHireRequest.fsm_state !== 'created' &&
    newHireRequest.fsm_state !== 'user_registration'
  ) {
    return null;
  }

  return (
    <>
      <LoadingButton
        color="primary"
        onClick={() => setIsConfirmOpen(true)}
        sx={{ whiteSpace: 'nowrap' }}
        variant="outlined"
      >
        Resend prehire e-mail
      </LoadingButton>

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleResend}
        title="Confirm resend"
        message={
          <Stack spacing={2}>
            <Typography variant="body1">
              This will send an e-mail to the new hire{' '}
              <strong>
                {newHireRequest.first_name} {newHireRequest.last_name}
              </strong>{' '}
              to collect their personal information: SSN, Gender, and Date of
              birth.
            </Typography>
            <Typography variant="body1">
              As part of verification, the new hire will be asked to go to{' '}
              <Link href="https://app.armhr.com/start" target="_blank">
                https://app.armhr.com/start
              </Link>{' '}
              and provide the following information
            </Typography>
            <Box sx={{ p: 1, border: '1px solid #dddddd' }}>
              <Typography variant="body1">
                Email address: <strong>{newHireRequest.email}</strong>
              </Typography>
              <Typography variant="body1">
                Client ID: <strong>{newHireRequest.client_id}</strong>
              </Typography>
              <Typography variant="body1">
                Hiring ID: <strong>{newHireRequest.intake_employee_id}</strong>
              </Typography>
            </Box>
            <Typography variant="body1">
              Once they have completed this step, you will be able to continue
              onboarding them. If you obtain their personal information before
              they do, you can enter it in for them on the form.
            </Typography>
          </Stack>
        }
      />
    </>
  );
};

export default NewHireResendEmailDialog;
