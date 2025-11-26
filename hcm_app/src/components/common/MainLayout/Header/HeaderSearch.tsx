import { GlobalSearch } from '@armhr/ui';
import { useNavigate } from 'react-router-dom';

import { createProviders } from '../../../../api/search.service';
import { useApi } from '../../../../hooks/useApi';

export const HeaderSearch = () => {
  const api = useApi();
  const navigate = useNavigate();
  const providers = createProviders(api.client, navigate);

  return (
    <GlobalSearch
      providers={providers}
      placeholder="Search employees, navigation..."
      maxWidth={400}
    />
  );
};

export default HeaderSearch;
