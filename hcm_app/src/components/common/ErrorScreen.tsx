import { Logo } from '@armhr/ui';
import { Box, Button, Container, Link, Stack, Typography } from '@mui/material';

export class DetailedError extends Error {
  originalError?: Error;
  context?: any;

  constructor(message: string, context?: any, originalError?: Error) {
    super(message);
    this.name = 'DetailedError';
    this.originalError = originalError;
    this.context = context;
  }
}

export const ErrorScreen: React.FC<{
  logout: () => void;
}> = ({ logout }) => (
  <Container
    maxWidth="sm"
    style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }}
  >
    <Logo />
    <Typography variant="h4" gutterBottom mt={2}>
      Sorry! Something went wrong.
    </Typography>
    <Typography variant="body1" sx={{ mt: 1, mb: 4 }}>
      Something unexpected happened while trying to load your profile. <br />{' '}
      Please try again, or contact support if the issue persists.
    </Typography>
    <Stack spacing={2} direction="row">
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.reload()}
      >
        Try again
      </Button>
    </Stack>
    <Box mt={4}>
      <Typography variant="caption">
        If you need help, please contact support at{' '}
        <Link href="mailto:hr@armhr.com" target="_blank">
          hr@armhr.com
        </Link>
        , or{' '}
        <Link href="#" onClick={logout}>
          logout
        </Link>
        .
      </Typography>
    </Box>
  </Container>
);

export default ErrorScreen;
