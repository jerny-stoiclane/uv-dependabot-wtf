import { PageSpinner, useNotifications } from '@armhr/ui';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import WorkIcon from '@mui/icons-material/Work';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Divider, Grid, Typography } from '@mui/material';
import { Formik } from 'formik';
import { merge } from 'lodash';
import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import SectionNavigation from '../../components/common/SectionNavigation';
import { AccountTab } from '../../components/profile/AccountTab';
import { AddressTab } from '../../components/profile/AddressTab';
import { CustomFieldsTab } from '../../components/profile/CustomFieldsTab';
import { EmergencyContactsTab } from '../../components/profile/EmergencyContactsTab';
import { JobTab } from '../../components/profile/JobTab';
import { PersonalTab } from '../../components/profile/PersonalTab';
import ProfilePicture from '../../components/profile/ProfilePicture';
import { useCompany } from '../../contexts/company.context';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import { useUser } from '../../hooks/useUser';
import { getCompanyConfigValue } from '../../utils/companyConfig';
import { ConfigFlags } from '../../utils/constants';
import { paths } from '../../utils/paths';

const UpdateProfilePage: React.FC = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { refresh } = useUser();
  const company = useCompany();

  const [isFormLoading, setIsFormLoading] = useState(false);
  const { showNotification } = useNotifications();

  const accountRef = useRef(null);
  const personalRef = useRef(null);
  const employmentRef = useRef(null);
  const addressRef = useRef(null);
  const emergencyContactRef = useRef(null);
  const userDefinedFieldsRef = useRef(null);

  const isUserDefinedFieldsEnabled = getCompanyConfigValue(
    company,
    ConfigFlags.USER_DEFINED_FIELDS_ENABLED,
    false
  );

  const sections = [
    {
      ref: personalRef,
      id: 'personal',
      label: 'Personal information',
      icon: <PersonIcon />,
      Component: PersonalTab,
    },
    {
      ref: accountRef,
      id: 'account',
      label: 'Account information',
      icon: <ManageAccountsIcon />,
      Component: AccountTab,
    },
    {
      ref: employmentRef,
      id: 'employment',
      label: 'Employment details',
      icon: <WorkIcon />,
      Component: JobTab,
    },
    {
      ref: addressRef,
      id: 'pay',
      label: 'Address',
      icon: <ContactMailIcon />,
      Component: AddressTab,
    },
    {
      ref: emergencyContactRef,
      id: 'emergency',
      label: 'Emergency contacts',
      icon: <ContactEmergencyIcon />,
      Component: EmergencyContactsTab,
    },
    ...(isUserDefinedFieldsEnabled
      ? [
          {
            ref: userDefinedFieldsRef,
            id: 'userDefinedFields',
            label: 'Custom fields',
            icon: <SettingsIcon />,
            Component: CustomFieldsTab,
          },
        ]
      : []),
  ];

  const { activeSection, scrollToSection } = useScrollToSection(sections);

  const {
    data: profile,
    loading,
    refresh: refreshProfile,
  } = useApiData((api) => api.profiles.getEmployeeProfile());

  if (loading) {
    return <PageSpinner />;
  }

  if (!profile) {
    showNotification({
      message:
        'No profile found, something went wrong. Please refresh and try again',
      severity: 'error',
    });
    navigate(paths.dashboard);
    return null;
  }

  const handleSubmit = async (values: ProfileFormValues) => {
    setIsFormLoading(true);

    try {
      const resp = await api.profiles.updateUserProfile(merge(profile, values));

      if (!!resp.success) {
        showNotification({
          message: 'Your profile information was updated successfully.',
          severity: 'success',
          autoHideDuration: 5000,
        });

        refresh({ disableSpinner: true });
      }
    } catch (err) {
      console.error({ err });
      showNotification({
        message: 'There was an error updating your profile. Please try again.',
        severity: 'error',
        autoHideDuration: 5000,
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile | Armhr</title>
        <meta
          name="description"
          content="View and update your profile information."
        />
      </Helmet>
      <Formik
        initialValues={profile}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            {/* <RouterPrompt
            when={dirty}
            message="You have unsaved changes. Are you sure you want to leave?"
          /> */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
              <Typography variant="h2">Your profile</Typography>

              <Box sx={{ display: ['block', 'flex'], ml: 'auto' }} gap={[2, 2]}>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                {!getCompanyConfigValue(
                  company,
                  ConfigFlags.HIDE_COMPANY_DIRECTORY,
                  false
                ) && (
                  <Button
                    variant="outlined"
                    to={`${paths.profile}/${profile.id}`}
                    component={RouterLink}
                  >
                    View public profile
                  </Button>
                )}
                <LoadingButton
                  variant="contained"
                  color="primary"
                  loading={isFormLoading}
                  type="submit"
                >
                  Save changes
                </LoadingButton>
              </Box>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <Box sx={{ position: 'sticky', top: '80px', mb: 4 }}>
                  <Card sx={{ pt: 2 }}>
                    <Grid item xs={12}>
                      <ProfilePicture
                        profile={profile}
                        refreshProfile={refreshProfile}
                      />

                      <SectionNavigation
                        sections={sections}
                        activeSection={activeSection}
                        scrollToSection={scrollToSection}
                      />
                    </Grid>
                  </Card>
                </Box>
              </Grid>

              <Grid item xs={12} md={9} gap={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {sections.map(({ ref, id, Component }) => (
                    <Box key={id} ref={ref}>
                      <Component
                        profile={profile}
                        refreshProfile={refreshProfile}
                      />
                      <Divider sx={{ mt: 4 }} />
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default UpdateProfilePage;
