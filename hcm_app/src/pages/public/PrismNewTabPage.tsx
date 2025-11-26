import { PageSpinner } from '@armhr/ui';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { useApiData } from '../../hooks/useApiData';
import { paths } from '../../utils/paths';

const PrismNewTabPage = () => {
  const navigate = useNavigate();

  const {
    data: prismUrl,
    error,
    loading,
  } = useApiData<string>((api) => api.profiles.getPrismRedirect());

  useEffect(() => {
    if (error) {
      navigate(paths.root);
      return;
    }

    if (prismUrl) {
      // window.location.href = prismUrl;
      // safely open new tab here
      window && window.open
        ? window.open(prismUrl, '_blank')
        : (window.location.href = prismUrl);

      navigate(paths.root);
      return;
    }
  }, [error, prismUrl]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Opening Prism | Armhr</title>
        </Helmet>
        <PageSpinner />
      </>
    );
  }

  return (
    <Helmet>
      <title>Opening Prism | Armhr</title>
    </Helmet>
  );
};

export default PrismNewTabPage;
