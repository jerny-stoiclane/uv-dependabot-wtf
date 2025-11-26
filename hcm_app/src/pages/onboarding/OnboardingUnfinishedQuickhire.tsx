import Logo from '@armhr/ui/src/components/Logo/Logo';
import { Box, Typography } from '@mui/material';

const OnboardingUnfinishedQuickhire = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        minHeight: '100vh',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'start',
        pt: 12,
        textAlign: 'center',
        bgcolor: 'grey.50',
      }}
    >
      <Logo width={120} height={80} />
      <Box
        sx={{
          width: '30%',
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: 1,
          border: 'solid',
          borderColor: 'grey.100',
        }}
      >
        <Typography variant="h3" sx={{ paddingBottom: '0.5rem' }}>
          We're finishing your account!
        </Typography>
        <Typography variant="body1">
          Your manager is still setting up your account.<br></br>Once they are
          finished, you'll get an email letting you know you can log in and
          start setting up your benefits.
        </Typography>
      </Box>
    </Box>
  );
};

export default OnboardingUnfinishedQuickhire;
