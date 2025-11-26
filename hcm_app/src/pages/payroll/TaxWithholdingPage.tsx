import { useNotifications } from '@armhr/ui';
import { LoadingButton } from '@mui/lab';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { paths } from '../../utils/paths';
import PrismPage from '../PrismPage';

const TaxWithholdingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotifications();
  const navigate = useNavigate();

  const handleUpdateTaxForms = async () => {
    setLoading(true);
    try {
      navigate(paths.taxWithholdingForm);
    } catch (error) {
      showNotification({
        severity: 'error',
        message:
          'Failed to open the tax withholding form. Please try again later or use the Back office portal.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Tax Withholding | Armhr</title>
        <meta
          name="description"
          content="View and manage your tax withholding information."
        />
      </Helmet>
      <PrismPage
        title="Tax withholding"
        queryString="&redirectUrl=ess/tax-withholding&hideNavHeader=True&lang=en"
        fluid={false}
        titleButton={
          <LoadingButton
            loading={loading}
            variant="contained"
            color="primary"
            onClick={handleUpdateTaxForms}
          >
            Update tax forms
          </LoadingButton>
        }
      />
    </>
  );
};

export default TaxWithholdingPage;
