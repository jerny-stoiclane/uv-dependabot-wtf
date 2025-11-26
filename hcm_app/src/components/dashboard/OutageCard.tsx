import {
  Close as CloseIcon,
  WarningAmber as WarningAmberIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const OutageCard = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Check if we should show the card (between today and April 28)
  const today = new Date();
  const endDate = new Date('2025-04-28T06:00:00-04:00');
  const shouldShow = today <= endDate;

  if (!shouldShow || !isVisible) {
    return null;
  }

  return (
    <Card
      sx={{
        mb: 2,
        background: 'hsla(25, 100%, 96%, 0.5)',
        borderRadius: '12px',
        boxShadow:
          'hsla(25, 100%, 90%, 0.5) 0 -3px 1px inset, hsla(25, 100%, 90%, 0.3) 0 2px 4px 0',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 24 }} />
            <Typography variant="h6" color="warning.main">
              Planned Maintenance Notice
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setIsVisible(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Stack spacing={2}>
          <Typography variant="body1" color="text.secondary">
            Please be advised that Armhr will be undergoing scheduled
            maintenance starting{' '}
            <strong>Friday, April 25 at 9:00 p.m. ET</strong>. The maintenance
            window is expected to continue until{' '}
            <strong>Monday, April 28 at 6:00 a.m. ET</strong>, though we
            anticipate that services may be restored sooner.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            During this period, certain features on the Armhr platform may be
            temporarily unavailable. We apologize for any inconvenience this may
            cause and appreciate your patience as we work to improve your
            experience.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If you require immediate assistance while the system is down, please
            contact us at{' '}
            <Link
              color="primary"
              href="mailto:clientsuccess@armhr.com"
              sx={{ m: 0, p: 0, minWidth: 0 }}
            >
              clientsuccess@armhr.com
            </Link>
            .
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OutageCard;
