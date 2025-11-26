import React from 'react';
import { Helmet } from 'react-helmet';

import PrismPage from '../PrismPage';

const DirectDepositPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Direct Deposit | Armhr</title>
        <meta
          name="description"
          content="Manage your direct deposit settings."
        />
      </Helmet>
      <PrismPage
        title="Direct deposit"
        queryString="&redirectUrl=ess/direct-deposit&hideNavHeader=True&lang=en"
      />
    </>
  );
};

export default DirectDepositPage;
