import React from 'react';
import { Helmet } from 'react-helmet';

import PrismPage from '../PrismPage';

const W2Page: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>W-2 | Armhr</title>
        <meta name="description" content="View and download your W-2 forms." />
      </Helmet>
      <PrismPage
        title="W-2"
        queryString="&redirectUrl=ess/w2&hideNavHeader=True&lang=en"
      />
    </>
  );
};

export default W2Page;
