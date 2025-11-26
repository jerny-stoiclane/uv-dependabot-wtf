import { Helmet } from 'react-helmet';

import PrismPage from '../PrismPage';

const AdminDirectoryPage = () => {
  return (
    <>
      <Helmet>
        <title>Employee Directory | Armhr</title>
        <meta
          name="description"
          content="View and manage employee directory information."
        />
      </Helmet>
      <PrismPage
        queryString="&redirectUrl=ess/manager/employees&hideNavHeader=True&lang=en"
        title="My employees"
      />
    </>
  );
};

export default AdminDirectoryPage;
