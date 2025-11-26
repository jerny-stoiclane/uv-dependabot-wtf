import { PageSpinner } from '@armhr/ui';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';

import { useApiData } from '../../hooks/useApiData';
import { paths } from '../../utils/paths';

const BenefitsEnrollmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: prismUrl,
    error,
    loading,
  } = useApiData<string>((api) =>
    api.benefits.getOpenEnrollmentRedirect(location.state?.origin)
  );

  useEffect(() => {
    if (error) {
      navigate(paths.root);
      return;
    }

    if (prismUrl) {
      window.location.href = prismUrl;
      return;
    }
  }, [error, prismUrl]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Benefits Enrollment | Armhr</title>
        </Helmet>
        <PageSpinner />
      </>
    );
  }

  return (
    <Helmet>
      <title>Benefits Enrollment | Armhr</title>
    </Helmet>
  );
};

export default BenefitsEnrollmentPage;
