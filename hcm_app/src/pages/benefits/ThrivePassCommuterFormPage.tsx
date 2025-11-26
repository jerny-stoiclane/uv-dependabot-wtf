import { PageSpinner, useNotifications } from '@armhr/ui';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import RequiredFormInfo from '../../components/benefits/sections_thrivepass/1-RequiredInfo';
import ParticipantInformation from '../../components/benefits/sections_thrivepass/2-ParticipantInformation';
import PhysicalAddress from '../../components/benefits/sections_thrivepass/3-PhysicalAddress';
import ThrivePassElections from '../../components/benefits/sections_thrivepass/4-Elections';
import SignatureSection from '../../components/benefits/sections_thrivepass/5-Signature';
import {
  prefillInitalValues,
  validationSchema,
} from '../../components/benefits/thrivepassFormData';
import { useCompany } from '../../contexts/company.context';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { useRedirectToDashboard } from '../../hooks/useRedirectToDashboard';
import { getCompanyConfigValue } from '../../utils/companyConfig';
import { paths } from '../../utils/paths';

const ThrivePassCommuterFormPage: React.FC = () => {
  const api = useApi();
  const company = useCompany();
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);

  const { data: employeeProfile } = useApiData((api) =>
    api.profiles.getEmployeeProfile()
  );

  // if fsa commuter enrollment is disabled, redirect to dashboard
  const fsaCommuterEnabled = getCompanyConfigValue(
    company,
    'fsa_commuter_enrollment_enabled',
    true
  );
  useRedirectToDashboard(!fsaCommuterEnabled);

  if (!employeeProfile) return <PageSpinner />;

  const sections = [
    { id: 'elections', component: ThrivePassElections },
    { id: 'requiredInfo', component: RequiredFormInfo },
    { id: 'signature', component: SignatureSection },
    { id: 'participantInfo', component: ParticipantInformation },
    { id: 'physicalAddress', component: PhysicalAddress },
  ];

  const handleSubmit = async (values: ThrivePassCommuterEnrollmentForm) => {
    setIsFormLoading(true);

    try {
      await api.benefits.createThrivePassEnrollmentSubmission(values);
      showNotification({
        message: 'ThrivePass Commuter Enrollment form submitted successfully.',
        severity: 'success',
      });
      navigate(paths.thrivepassEnrollment);
      window.scrollTo(0, 0);
    } catch (error) {
      showNotification({
        message: 'Error submitting form. Please try again later.',
        severity: 'error',
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Commuter Benefits | Armhr</title>
        <meta
          name="description"
          content="Enroll in ThrivePass commuter benefits program."
        />
      </Helmet>
      <Formik
        initialValues={prefillInitalValues(employeeProfile!, company)}
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h2">
                  ThrivePass Commuter Enrollment Form
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 4 }}>
                Some information has been prefilled for your convenience. Please
                check to make sure everything is correct and all required fields
                are completed before submitting.
              </Alert>

              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}
                  >
                    {sections.map((section) => (
                      <Box key={section.id}>
                        <section.component />
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
                <Box
                  sx={{ display: ['block', 'flex'], ml: 'auto' }}
                  gap={[2, 2]}
                >
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    loading={isFormLoading}
                    type="submit"
                  >
                    Submit
                  </LoadingButton>
                </Box>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ThrivePassCommuterFormPage;
