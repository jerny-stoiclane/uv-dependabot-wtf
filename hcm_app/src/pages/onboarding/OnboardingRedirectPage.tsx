import { PageSpinner } from '@armhr/ui';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { useApiData } from '../../hooks/useApiData';
import { paths } from '../../utils/paths';

const OnboardingRedirectPage = () => {
  const navigate = useNavigate();

  const {
    data: prehireUrl,
    error,
    loading,
  } = useApiData<string>((api) => api.onboarding.getPrehireRedirect());

  useEffect(() => {
    if (error) {
      navigate(paths.root);
      return;
    }

    if (prehireUrl) {
      window.location.href = prehireUrl;
      return;
    }
  }, [error, prehireUrl]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Redirecting to Onboarding | Armhr</title>
        </Helmet>
        <PageSpinner />
      </>
    );
  }

  return (
    <Helmet>
      <title>Redirecting to Onboarding | Armhr</title>
    </Helmet>
  );
};

export default OnboardingRedirectPage;
