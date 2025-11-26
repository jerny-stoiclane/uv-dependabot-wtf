import React from 'react';
import { Helmet } from 'react-helmet';

import PrismPage from '../PrismPage';

const BeneficiariesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Beneficiaries | Armhr</title>
        <meta
          name="description"
          content="Manage your dependents and beneficiaries."
        />
      </Helmet>
      <PrismPage
        queryString="&redirectUrl=ess/depben&hideNavHeader=True&lang=en"
        title="Dependents/beneficiaries"
      />
    </>
  );
};

export default BeneficiariesPage;
