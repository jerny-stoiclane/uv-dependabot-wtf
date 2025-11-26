import { Button } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { paths } from '../../utils/paths';
import PrismPage from '../PrismPage';

const TaxWithholdingFormPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Update Tax Withholding | Armhr</title>
        <meta name="description" content="Update your tax withholding forms." />
      </Helmet>
      <PrismPage
        title="Update Tax Withholding"
        queryString="&redirectUrl=ess/tax-withholding/symmetry&hideNavHeader=True&lang=en"
        titleButton={
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(paths.taxWithholding)}
          >
            Back to Tax Withholding
          </Button>
        }
      />
    </>
  );
};

export default TaxWithholdingFormPage;
