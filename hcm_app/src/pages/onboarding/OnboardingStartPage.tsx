import { PageSpinner, useNotifications } from '@armhr/ui';
import { useAuth0 } from '@auth0/auth0-react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActions,
  Container,
  Grid,
  Link,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { isMobile, isSafari } from 'react-device-detect';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import Footer from '../../components/common/MainLayout/Footer';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { paths } from '../../utils/paths';

const OnboardingStartPage: React.FC = () => {
  const { user: auth0User } = useAuth0();
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const api = useApi();
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const { data: company, loading } = useApiData<Company>((api) =>
    api.company.getCompany()
  );

  const isLargeScreen = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (auth0User && !auth0User.user_metadata?.prehire) {
      navigate(paths.dashboard);
    }
  }, [auth0User, navigate]);

  const handlePrismOnboarding = async () => {
    try {
      setOnboardingLoading(true);
      const { results: prismUrl } = await api.onboarding.getPrehireRedirect();

      if (prismUrl) {
        const newWindow = window.open(prismUrl, '_blank');

        if (newWindow === null) {
          showNotification({
            severity: 'error',
            message: (
              <>
                Launching onboarding in a new window was blocked. Please allow
                popups and try again, or click the link below to continue:{' '}
                <Link href={prismUrl}>{prismUrl}</Link>
              </>
            ),
          });
        }
      }
    } catch {
      showNotification({ severity: 'error', message: true });
    } finally {
      setOnboardingLoading(false);
    }
  };

  const handleOnboarding = async () => {
    if (isMobile || isSafari) {
      handlePrismOnboarding();
      return;
    } else {
      navigate(paths.onboardingWrapper);
    }
  };

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <Grid container sx={{ flexWrap: 'nowrap' }}>
      <Helmet>
        <title>Start Onboarding | Armhr</title>
        <meta
          name="description"
          content="Begin your onboarding process with Armhr."
        />
      </Helmet>
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          flexGrow: 1,
          zIndex: 1,
        }}
      >
        <Box sx={{ pt: 8, flexGrow: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" mb={2}>
              Welcome to Armhr,{' '}
              <span>{auth0User?.given_name || auth0User?.name}</span>
              <span>!</span>
            </Typography>

            <Typography variant="h6" fontWeight="normal" mb={2}>
              In order to finish setting up your employee self-service
              dashboard, please complete {isLargeScreen && <br />}
              <span>the </span>
              <strong>{company?.name}</strong>
              <span> onboarding process.</span>
            </Typography>
          </Box>

          <Box>
            <Card sx={{ width: '75%', mx: 'auto', mb: 3, p: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" mb={2}>
                  Ready to complete your onboarding?
                </Typography>
                <Typography variant="body1" color="grey.600">
                  We'll confirm your personal and financial information and get
                  you set up for payroll and benefits. Have your bank account
                  and routing numbers handy to set up direct deposit.
                </Typography>
              </Box>
              <CardActions sx={{ p: 0, justifyContent: 'center' }}>
                <LoadingButton
                  size="large"
                  variant="contained"
                  color="primary"
                  sx={{
                    fontSize: '1.25rem',
                  }}
                  loading={onboardingLoading}
                  onClick={handleOnboarding}
                >
                  Launch Onboarding
                </LoadingButton>
              </CardActions>
            </Card>
          </Box>
        </Box>

        <Footer />
      </Container>
    </Grid>
  );
};

export default OnboardingStartPage;
