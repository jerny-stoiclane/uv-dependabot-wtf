import { PageSpinner, useNotifications } from '@armhr/ui';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Divider, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';

import BonusTaxWithholdingRequestSignatureForm from '../../components/payroll/BonusTaxWithholdingRequestSignatureForm';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { BonusTaxWithholdingRequestStatuses } from '../../utils/constants';
import { paths } from '../../utils/paths';
import useValidationSchema from '../../utils/schemas/bonusTaxWithholdingRequestValidationSchema';

const BonusTaxWithholdingSignPage: React.FC = () => {
  const armhrLogoColor = '#1a4884';
  const navigate = useNavigate();
  const api = useApi();
  const { showNotification } = useNotifications();
  const { requestId } = useParams();

  const { data: assignedForm, loading } =
    useApiData<BonusTaxWithholdingRequest>((api) =>
      api.payroll.getBonusTaxWithholdingById(requestId!)
    );

  const handleSubmit = async (values: BonusTaxWithholdingRequestForm) => {
    try {
      await api.payroll.signBonusTaxWithholding(
        {
          ...values,
          signed_at: new Date().toISOString(),
          status: BonusTaxWithholdingRequestStatuses.SIGNED,
        },
        requestId!
      );
      showNotification({
        message:
          'Successfully signed bonus additional tax withholding request.',
        severity: 'success',
        autoHideDuration: 5000,
      });
      navigate(paths.employeeBonusTaxWithholding);
    } catch (err: any) {
      showNotification({
        message:
          'Failed to sign bonus additional tax withholding request. Please try again.',
        severity: 'error',
        autoHideDuration: 5000,
      });
      console.error(err);
    }
  };

  const validationSchema = useValidationSchema();

  if (loading || !assignedForm) {
    return <PageSpinner />;
  }

  return (
    <Box>
      <Helmet>
        <title>Sign Bonus Tax Withholding | Armhr</title>
        <meta
          name="description"
          content="Sign your bonus additional tax withholding request."
        />
      </Helmet>
      <Typography variant="h4" sx={{ mt: 3, mb: 1 }}>
        Request Bonus Additional Tax Withholding
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Please read through this document carefully and fill out the fields
        below to request additional tax withholding for your bonus.
      </Alert>

      <Typography
        variant="h4"
        sx={{ mt: 3, mb: 0, color: armhrLogoColor, fontWeight: 'bold' }}
      >
        What is a supplemental wage payment?
      </Typography>
      <Typography variant="body1" sx={{ mt: 0, mb: 3, fontWeight: 'bold' }}>
        Supplemental wages are wage payments issued to an employee that are not
        regular wages. They include, but are not limited to, bonuses,
        commissions, overtime pay, payments for accumulated sick leave,
        severance pay, awards, prizes, back pay, retroactive pay increases, and
        payments for nondeductible moving expenses.
      </Typography>

      <Typography
        variant="h4"
        sx={{ mt: 1, mb: 0, color: armhrLogoColor, fontWeight: 'bold' }}
      >
        Federal Tax Withholding Requirements
      </Typography>
      <Typography variant="body1" sx={{ mt: 0, mb: 3, fontWeight: 'bold' }}>
        Armhr follows the{' '}
        <a href="https://www.irs.gov/publications/p15">
          {' '}
          IRS Publication 15 (Circular E)
        </a>{' '}
        flat rate method of withholding federal taxes on all bonus supplemental
        wages when supplemental pay is separate from regular wages. If
        supplemental pay is combined with regular wages, witholding is
        calculated based on the employee’s Form W-4. The applicable withholding
        rate is cumulative so the amount of bonus payments earned during the
        calendar year will dictate the percentage of withholding required on all
        future bonus payments.
      </Typography>

      <Typography
        variant="h4"
        sx={{ mt: 1, mb: 0, color: armhrLogoColor, fontWeight: 'bold' }}
      >
        Bonus payments less than or equal to $1 million
      </Typography>
      <Typography variant="body1" sx={{ mt: 0, mb: 3, fontWeight: 'bold' }}>
        The current federal flat tax withholding rate is 22% on the first $1
        million issued in bonus wages. State and Local taxes may apply and will
        be withheld based on the current tax withholding rates outlined by the
        applicable state you work in.
      </Typography>

      <Typography
        variant="h4"
        sx={{ mt: 1, mb: 0, color: armhrLogoColor, fontWeight: 'bold' }}
      >
        Bonus payments over $1 million
      </Typography>
      <Typography variant="body1" sx={{ mt: 0, mb: 3, fontWeight: 'bold' }}>
        The current federal tax withholding rate is 37% on all bonus payments
        issued after your cumulative bonus earnings exceed $1 million.
      </Typography>

      <Typography
        variant="h4"
        sx={{ mt: 1, mb: 0, color: armhrLogoColor, fontWeight: 'bold' }}
      >
        Requesting Additional Tax Withholding
      </Typography>
      <Typography variant="body1" sx={{ mt: 0, mb: 3, fontWeight: 'bold' }}>
        Tax withholding must be equal to or greater than the amounts outlined
        above for all federal, state and local taxes. You may request additional
        tax withholding by completing the below authorization form.
      </Typography>

      <Formik
        validateOnBlur
        validateOnChange={true}
        validateOnMount
        initialValues={{
          ...assignedForm,
          signature: assignedForm.signature ?? '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, values, setFieldValue, validateField }) => (
          <Form>
            <Divider sx={{ my: 3 }} />
            <BonusTaxWithholdingRequestSignatureForm
              signatureValue={values.signature ?? ''}
              setSignatureValue={(newValue) => {
                setFieldValue('signature', newValue);
                validateField('signature');
              }}
            />
            <Box display="flex" gap={2} flexDirection="row-reverse">
              <LoadingButton
                variant="contained"
                size="large"
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                Sign request
              </LoadingButton>
              <Button
                variant="outlined"
                size="large"
                color="error"
                onClick={() => navigate(paths.employeeBonusTaxWithholding)}
              >
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default BonusTaxWithholdingSignPage;
