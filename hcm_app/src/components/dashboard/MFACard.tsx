import MainCard from '@armhr/ui/src/components/Card/MainCard';
import {
  Close as CloseIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { Box, IconButton, Link, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useCompany } from '../../contexts/company.context';

const MFACard = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { id, name } = useCompany();

  // Show until 6/3/2025 (inclusive)
  const today = new Date();
  const endDate = new Date('2025-06-03T23:59:59');

  // Turn off for these clients, since its on already
  if (['623095', '623131', '000001'].includes(id)) {
    return null;
  }

  if (!isVisible || today > endDate) return null;

  return (
    <MainCard
      border={false}
      content={false}
      sx={{
        mb: 2,
        backgroundColor: '#e3f2fd',
        border: '1px solid #1976d2',
        borderRadius: '10px',
        minHeight: 0,
        boxShadow:
          '0 2px 8px 0 rgba(25, 118, 210, 0.08), 0 -2px 1px 0 rgba(25, 118, 210, 0.04) inset',
        p: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <SecurityIcon sx={{ color: '#1976d2', fontSize: 20 }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: '#1976d2' }}
          >
            Two-Factor Authentication Coming Soon
          </Typography>
        </Stack>
        <IconButton size="small" onClick={() => setIsVisible(false)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ px: 2, pb: 1 }}>
        <Typography variant="body1" color="text.secondary">
          To help keep your account safe, <b>two-factor authentication (2FA)</b>{' '}
          will be required for all users starting <b>Monday, June 2, 2025</b>.
          <br />
          When you sign in, you'll be prompted to set up 2FA using either SMS or
          an authenticator app to verify your identity.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, pb: 1 }}
        >
          Need help? Contact your{' '}
          <Link
            href={`mailto:security@armhr.com?subject=2FA%20Authentication%20${name}`}
            color="primary"
            underline="always"
          >
            Armhr team
          </Link>
          .
        </Typography>
      </Box>
    </MainCard>
  );
};

export default MFACard;
