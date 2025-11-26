import { GlobalNotification } from '@armhr/ui';
import { Box, Toolbar } from '@mui/material';

import OnboardingHeader from './OnboardingHeader';

const OnboardingLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <OnboardingHeader />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            backgroundImage:
              'url(https://armhr.com/assets/background1-61395f10.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            opacity: 0.4,
          }}
        />
        <Toolbar />
        <GlobalNotification sx={{ mb: 0 }} />
        <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default OnboardingLayout;
