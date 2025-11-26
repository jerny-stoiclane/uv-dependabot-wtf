import { Helmet } from 'react-helmet';

import PrismPage from '../PrismPage';

const ApprovalsPage = () => {
  return (
    <>
      <Helmet>
        <title>Approvals | Armhr</title>
        <meta
          name="description"
          content="Review and manage employee approvals for your team."
        />
      </Helmet>
      <PrismPage queryString="&redirectUrl=ess/manager/approvals/pending&hideNavHeader=True&lang=en" />
    </>
  );
};

export default ApprovalsPage;
