import { PageSpinner, useNotifications } from '@armhr/ui';
import {
  AdminPanelSettings,
  Business,
  Extension,
  Functions,
  Group,
  Info,
  MonetizationOn,
  Security,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Card, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';

import SecurityAccessRequirements from '../../components/admin/sections/1-SecurityAccessRequirements';
import UserInformation from '../../components/admin/sections/2-UserInformation';
import SecurityAccess from '../../components/admin/sections/3-SecurityAccess';
import PrimaryUserRole from '../../components/admin/sections/4-PrimaryUserRole';
import PayrollSection from '../../components/admin/sections/5-PayrollSection';
import HrAddOnsSection from '../../components/admin/sections/6-HrAddOnsSection';
import AdditionalFunctionality from '../../components/admin/sections/7-AdditionalFunctionality';
import SecurityAdministration from '../../components/admin/sections/8-SecurityAdministration';
import {
  FormValues,
  initialValues,
  truncatedFormUserActions,
} from '../../components/admin/userAccessFormValues';
import SectionNavigation from '../../components/common/SectionNavigation';
import { useCompany } from '../../contexts/company.context';
import { RoleValidationProvider } from '../../contexts/roleValidation.context';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import { paths } from '../../utils/paths';

interface LocationState {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const AdminUserAccessRequestFormPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { firstName, lastName, email } =
    (location.state as LocationState) || {};
  const company = useCompany();
  const { showNotification } = useNotifications();
  const [isFormLoading, setIsFormLoading] = useState(false);

  // References for each section
  const securityAccessRef = useRef<HTMLDivElement>(null);
  const userInfoRef = useRef<HTMLDivElement>(null);
  const deptSecurityRef = useRef<HTMLDivElement>(null);
  const primaryUserRoleRef = useRef<HTMLDivElement>(null);
  const payrollRef = useRef<HTMLDivElement>(null);
  const hrAddOnsRef = useRef<HTMLDivElement>(null);
  const additionalFuncRef = useRef<HTMLDivElement>(null);
  const securityAdminRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      ref: securityAccessRef,
      id: 'securityAccess',
      label: 'Access Requirements',
      icon: <Security />,
      Component: SecurityAccessRequirements,
    },
    {
      ref: userInfoRef,
      id: 'userInfo',
      label: 'User Information',
      icon: <Info />,
      Component: UserInformation,
    },
    {
      ref: deptSecurityRef,
      id: 'deptSecurity',
      label: 'Security Access',
      icon: <Business />,
      Component: SecurityAccess,
    },
    {
      ref: primaryUserRoleRef,
      id: 'primaryUserRole',
      label: 'Primary User Role',
      icon: <Group />,
      Component: PrimaryUserRole,
    },
    {
      ref: payrollRef,
      id: 'payroll',
      label: 'Payroll',
      icon: <MonetizationOn />,
      Component: PayrollSection,
    },
    {
      ref: hrAddOnsRef,
      id: 'hrAddOns',
      label: 'HR Add-Ons',
      icon: <Extension />,
      Component: HrAddOnsSection,
    },
    {
      ref: additionalFuncRef,
      id: 'additionalFunc',
      label: 'Additional Functionality',
      icon: <Functions />,
      Component: AdditionalFunctionality,
    },
    {
      ref: securityAdminRef,
      id: 'securityAdmin',
      label: 'Security Administration',
      icon: <AdminPanelSettings />,
      Component: SecurityAdministration,
    },
  ];

  const api = useApi();
  const { activeSection, scrollToSection } = useScrollToSection(sections);
  const { data: codes, loading: codesLoading } = useApiData<CompanyCode>(
    (api) => api.company.getCodes()
  );

  if (!codesLoading && !codes) {
    navigate(paths.adminRequestUserAccess, {
      state: { persistNotification: true },
    });
    showNotification({
      message: 'There was an issue loading the access form. Please try again.',
      severity: 'error',
    });
    return null;
  }

  const handleSubmit = async (values: FormValues) => {
    setIsFormLoading(true);

    try {
      await api.profiles.requestUserAccess(values);
      showNotification({
        message: 'User access request submitted successfully',
        severity: 'success',
      });
      navigate(paths.adminRequestUserAccess);
    } catch (error) {
      showNotification({
        message: 'Error submitting form. Please try again later.',
        severity: 'error',
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  const ActionButtons = () => (
    <Box sx={{ display: ['block', 'flex'], ml: 'auto' }} gap={[2, 2]}>
      <Button color="secondary" variant="outlined" onClick={() => navigate(-1)}>
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
  );

  if (codesLoading) {
    return <PageSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>User Access Request Form | Armhr</title>
        <meta
          name="description"
          content="Submit a new user access request form."
        />
      </Helmet>
      <Formik
        initialValues={{
          ...initialValues,
          date_submitting: new Date().toISOString().split('T')[0],
          client_name: company.name,
          first_name: firstName || '',
          last_name: lastName || '',
          email: email || '',
        }}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit }) => {
          const navigationSections = truncatedFormUserActions.includes(
            values.user_type
          )
            ? sections.filter(({ id }) =>
                ['securityAccess', 'securityAdmin'].includes(id)
              )
            : sections;

          return (
            <Form onSubmit={handleSubmit}>
              <RoleValidationProvider>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h2">Request user access</Typography>
                  <ActionButtons />
                </Box>
                <Alert severity="info" sx={{ mb: 4 }}>
                  If you are unsure how to complete this form, please reach out
                  to either your HRBP or Payroll Specialist for assistance.
                </Alert>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ position: 'sticky', top: '80px', mb: 4 }}>
                      <Card>
                        <Grid item xs={12}>
                          <SectionNavigation
                            sections={navigationSections}
                            activeSection={activeSection}
                            scrollToSection={scrollToSection}
                          />
                        </Grid>
                      </Card>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={9} gap={2}>
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}
                    >
                      {navigationSections.map(({ ref, id, Component }) => (
                        <Box key={id} ref={ref}>
                          <Component />
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>

                <Box
                  sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}
                >
                  <ActionButtons />
                </Box>
              </RoleValidationProvider>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AdminUserAccessRequestFormPage;
