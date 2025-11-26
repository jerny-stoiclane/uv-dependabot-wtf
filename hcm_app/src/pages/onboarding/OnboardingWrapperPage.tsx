/* eslint-disable react-google-translate/no-conditional-text-nodes-with-siblings */
import { PageSpinner, useNotifications } from '@armhr/ui';
import { useAuth0 } from '@auth0/auth0-react';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import errorImage from '../../assets//error-image.svg';
import InactivityPrompt from '../../components/common/InactivityPrompt';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { paths } from '../../utils/paths';

const OnboardingWrapperPage: React.FC<{ isEnrolling?: boolean }> = ({
  isEnrolling,
}) => {
  const [iframeError, setIframeError] = useState(false);
  const { user: auth0User } = useAuth0();
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const { logout } = useAuth0();
  const api = useApi();

  useEffect(() => {
    if (auth0User && !auth0User.user_metadata?.prehire && !isEnrolling) {
      navigate(paths.dashboard);
    }
  }, [auth0User, navigate]);

  const {
    data: prehireUrl,
    error,
    loading,
    refresh,
  } = useApiData<string>((api) => api.onboarding.getPrehireRedirect());

  if (loading) {
    return <PageSpinner />;
  }

  const handleOnboarding = async () => {
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
                <Link href={prismUrl} target="_blank" rel="noopener">
                  {prismUrl}
                </Link>
              </>
            ),
          });
        }
      } else {
        navigate('/');
      }
    } catch {
      showNotification({ severity: 'error', message: true });
    } finally {
      setOnboardingLoading(false);
    }
  };

  if (!loading && (error || iframeError || !prehireUrl)) {
    return (
      <OnboardingError
        handleOnboarding={handleOnboarding}
        loading={onboardingLoading}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Helmet>
        <title>{isEnrolling ? 'Enrollment' : 'Onboarding'} | Armhr</title>
        <meta
          name="description"
          content={
            isEnrolling
              ? 'Complete your benefits enrollment process.'
              : 'Complete your onboarding process.'
          }
        />
      </Helmet>
      {prehireUrl && (
        <iframe
          src={forceHttps(prehireUrl)}
          title="Prism"
          onError={() => setIframeError(true)}
          style={{
            background: 'white',
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      )}
      <InactivityPrompt onContinue={refresh} onLogout={logout} />
    </Box>
  );
};

const forceHttps = (url) => {
  const urlObj = new URL(url);
  urlObj.protocol = 'https';
  return urlObj.toString();
};

const OnboardingError: React.FC<{
  handleOnboarding: () => {};
  loading: boolean;
}> = ({ handleOnboarding, loading }) => (
  <Container>
    <Box sx={{ textAlign: 'center' }}>
      <img src={errorImage} alt="error" width={300} />
      <Typography variant="h4" mt={2}>
        Sorry, something went wrong.
      </Typography>

      <Box sx={{ maxWidth: 500, mx: 'auto' }}>
        <Typography variant="body1" mt={2}>
          We've been notified of the error, please refresh and try again. If the
          issue persists, please try going directly to onboarding using the link
          below.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <LoadingButton
            loading={loading}
            onClick={handleOnboarding}
            variant="contained"
          >
            Launch Onboarding
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  </Container>
);

export default OnboardingWrapperPage;
