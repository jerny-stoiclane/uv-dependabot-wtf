import { PageSpinner } from '@armhr/ui';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';

import { useApiData } from '../../hooks/useApiData';
import { paths } from '../../utils/paths';

const DirectBenefitsEnrollmentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: redirectUrl, error } = useApiData<string>((api) =>
    api.benefits.getOpenEnrollmentRedirect(location.state?.origin)
  );

  useEffect(() => {
    if (error) {
      navigate(paths.root);
    } else if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl, error, navigate]);

  return (
    <>
      <Helmet>
        <title>Benefits Enrollment | Armhr</title>
        <meta
          name="description"
          content="Enrolling in benefits, please wait."
        />
      </Helmet>
      <PageSpinner color="secondary" />
    </>
  );
};

export default DirectBenefitsEnrollmentPage;
