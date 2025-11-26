import { Box, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    sx={{ p: '48px 0px 0px', mt: 'auto' }}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography variant="caption">
        Copyright &copy; {new Date().getFullYear()}. All rights reserved
      </Typography>
    </Box>
    <Stack
      spacing={4}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Link
        component={RouterLink}
        to="https://www.armhr.com/privacy-policy"
        target="_blank"
        variant="caption"
        color="primary.main"
      >
        Privacy policy
      </Link>
      <Link
        component={RouterLink}
        to="https://www.armhr.com/terms-of-use"
        target="_blank"
        variant="caption"
        color="primary.main"
      >
        Terms of use
      </Link>
      <Link
        component={RouterLink}
        to="mailto:hr@armhr.com"
        target="_blank"
        variant="caption"
        color="primary.main"
      >
        Support
      </Link>
    </Stack>
  </Stack>
);

export default Footer;
