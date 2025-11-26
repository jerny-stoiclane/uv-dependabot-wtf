import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { paths } from '../utils/paths';

export const useRedirectToDashboard = (shouldRedirect: boolean) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldRedirect) {
      navigate(paths.dashboard);
    }
  }, [shouldRedirect, navigate]);
};
