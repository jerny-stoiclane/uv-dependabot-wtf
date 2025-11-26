import { PageSpinner, useNotifications } from '@armhr/ui';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import SectionNavigation from '../../components/common/SectionNavigation';
import ContactFields from '../../components/onboarding/ContactFields';
import DevNewHireFormFiller from '../../components/onboarding/DevNewHireFormFiller';
import EmploymentFields from '../../components/onboarding/EmploymentFields';
import NewHireRequestSectionStates from '../../components/onboarding/NewHireRequestSectionStates';
import NewHireRequestStateAlerts from '../../components/onboarding/NewHireRequestStateAlerts';
import NewHireResendEmailDialog from '../../components/onboarding/NewHireResendEmailDialog';
import PayFields from '../../components/onboarding/PayFields';
import PersonalFields from '../../components/onboarding/PersonalFields';
import ValidationErrorSummary from '../../components/onboarding/ValidationErrorSummary';
import { useCompany } from '../../contexts/company.context';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import useCookieFlag from '../../hooks/useCookieFlag';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import { QUICKHIRE_COOKIE, gender } from '../../utils/constants';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';

const EditNewHireRequestPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const company = useCompany(); // Will return default company in ops context
  const [showOptional, setShowOptional] = useState(true);
  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);
  const handleToggleOptional = useCallback(() => {
    setShowOptional((prev) => !prev);
  }, []);
  const { showNotification } = useNotifications();
  useCookieFlag(QUICKHIRE_COOKIE, true);

  // sections
  const personalRef = useRef(null);
  const contactRef = useRef(null);
  const employmentRef = useRef(null);
  const payRef = useRef(null);
  const sections = [
    {
      ref: personalRef,
      id: 'personal',
      label: 'Personal Information',
      icon: <PersonIcon />,
      Component: PersonalFields,
    },
    {
      ref: contactRef,
      id: 'contact',
      label: 'Contact Information',
      icon: <ContactMailIcon />,
      Component: ContactFields,
    },
    {
      ref: employmentRef,
      id: 'employment',
      label: 'Employment Details',
      icon: <WorkIcon />,
      Component: EmploymentFields,
    },
    {
      ref: payRef,
      id: 'pay',
      label: 'Pay Details',
      icon: <PaymentIcon />,
      Component: PayFields,
    },
  ];
  const { activeSection, scrollToSection } = useScrollToSection(sections);

  const { data: prehireFields, loading: fieldsLoading } = useApiData<
    PrehireFields | PrehireField[]
  >((api) => api.onboarding.getPrehireFields());

  const { data: codes, loading: codesLoading } = useApiData<CompanyCode>(
    (api) => api.company.getCodes()
  );

  const { data: access, loading: accessLoading } = useApiData<UserAccess>(
    (api) => api.profiles.getUserAccess()
  );

  const { data: newHireRequest, loading: newHireLoading } =
    useApiData<NewHireRequest>(async (api) => {
      const result = await api.onboarding.getNewHireRequestById(requestId!);
      return result;
    });

  const { data: managers, loading: managersLoading } = useApiData<
    PrismSecurityUser[]
  >((api) => api.company.getActivePrismUsers());

  // Handle navigation errors in useEffect to avoid updating router during render
  useEffect(() => {
    if (!newHireRequest && !newHireLoading) {
      console.log('REDIRECT: New hire not found', {
        newHireRequest,
        newHireLoading,
      });
      showNotification({
        message: 'New hire not found.',
        severity: 'error',
      });
      navigate(-1);
    }
  }, [newHireRequest, newHireLoading, showNotification, navigate]);

  useEffect(() => {
    if (!access && !accessLoading) {
      console.log('REDIRECT: Access issue', {
        access,
        accessLoading,
      });
      showNotification({
        message:
          'There was an issue loading the new hire form. Please try again.',
        severity: 'error',
      });
      navigate(-1);
    }
  }, [access, accessLoading, showNotification, navigate]);

  if (!requestId) {
    return null;
  }

  if (
    fieldsLoading ||
    newHireLoading ||
    codesLoading ||
    accessLoading ||
    managersLoading
  )
    return <PageSpinner />;

  // Handle different prehireFields structures between HCM and ops
  const fields = Array.isArray(prehireFields)
    ? prehireFields
    : (prehireFields as PrehireFields)?.fields || [];

  if (!newHireRequest || !access) {
    return null;
  }

  const shouldIncludeField = (field: PrehireField) => {
    const excludedFields = ['ssn', 'employee_status', 'employee_number'];

    return (
      field.required_for_electronic_onboarding &&
      !excludedFields.includes(field.field_name)
    );
  };

  const initialValues = {
    ...newHireRequest,
    email_address: newHireRequest.personal_email || '',
    work_email_address: newHireRequest.work_email || '',
    home_phone: newHireRequest.home_phone || '',
    gender:
      gender.find((o) => o.label.toLowerCase() === newHireRequest.gender)
        ?.value || '',
  } as unknown as NewHireRequestFormValues;

  const requiredFields = (fields || [])
    .filter(shouldIncludeField)
    .map((field: PrehireField) => field.field_name);

  const validationSchema = Yup.object().shape(
    (fields || []).reduce(
      (acc: { [key: string]: any }, field: PrehireField) => {
        if (shouldIncludeField(field)) {
          acc[field.field_name] = Yup.string().required(
            'This field is required'
          );
        }
        return acc;
      },
      {}
    )
  );

  const handleSubmit = async (values: NewHireRequestFormValues) => {
    if (!newHireRequest.id) {
      return;
    }
    try {
      const res = await api.onboarding.createPrehireRequest(newHireRequest.id, {
        ...values,
        company_name: company.name,
        new_hire_request_id: newHireRequest.id,
        birth_date: formatDate(values.birth_date, 'ISO'),
      });

      if (res.detail) {
        throw new Error('There was a problem saving the new hire');
      }

      if (!res.results.commitResult) {
        throw new Error(res.results.errorMessage);
      }

      showNotification({
        message: (
          <>
            Success! An email has been sent with instructions to continue
            onboarding.
          </>
        ),
        severity: 'success',
        autoHideDuration: 10000,
      });

      navigate(paths.newHires, {
        state: {
          persistNotification: true,
        },
      });
    } catch (err: any) {
      const response = err?.response?.data;
      let errorContent;

      // Pydantic returns an array of errors, so we need to handle that until
      // we format errors via backend
      if (Array.isArray(response?.detail)) {
        const { msg, loc } = response.detail[0] || {};
        const key = loc?.[1];
        errorContent = `${key}: ${msg}`;
      } else if (typeof response?.detail === 'string') {
        errorContent = response.detail;
      }

      showNotification({
        message: (
          <>
            There was a problem saving the new hire.
            {errorContent && (
              <Box>
                <Typography variant="body2" color="error.light">
                  {errorContent}
                </Typography>
              </Box>
            )}
          </>
        ),
        severity: 'error',
      });

      window?.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit New Hire Request | Armhr</title>
        <meta
          name="description"
          content="Edit and update new hire request information."
        />
      </Helmet>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ isSubmitting, errors, submitCount }) => (
          <Form noValidate>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                flexDirection: { xs: 'column', md: 'row' },
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h2" mb={0.5}>
                  New hire setup
                </Typography>

                {newHireRequest.fsm_state === 'created' && (
                  <Typography variant="body1">
                    On save, an e-mail with instructions to create an Armhr
                    account and <br />
                    complete onboarding will be sent to the new hire.
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'start',
                  mt: { xs: 2, md: 0 },
                  ml: { md: 'auto' },
                  gap: 2,
                }}
              >
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={handleBackClick}
                >
                  Back
                </Button>

                <DevNewHireFormFiller
                  requiredFields={requiredFields}
                  codes={codes || undefined}
                  managers={undefined}
                  access={access!}
                />

                <NewHireResendEmailDialog newHireRequest={newHireRequest} />

                {['created', 'user_partial_complete'].includes(
                  newHireRequest.fsm_state
                ) && (
                  <LoadingButton
                    color="primary"
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                    type="submit"
                    loading={isSubmitting}
                    variant="contained"
                  >
                    Submit new hire
                  </LoadingButton>
                )}
              </Box>
            </Box>

            <ValidationErrorSummary errors={errors} submitCount={submitCount} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box sx={{ position: 'sticky', top: '80px', mb: 4 }}>
                  <Box sx={{ px: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h3">
                          {newHireRequest.first_name} {newHireRequest.last_name}
                        </Typography>
                        <Typography variant="body2">
                          {newHireRequest.email}
                        </Typography>
                      </Box>
                    </Box>

                    <NewHireRequestSectionStates
                      newHireRequest={newHireRequest}
                    />
                  </Box>

                  {['created', 'user_partial_complete'].includes(
                    newHireRequest.fsm_state
                  ) && (
                    <>
                      <SectionNavigation
                        sections={sections}
                        activeSection={activeSection}
                        scrollToSection={scrollToSection}
                      />

                      <Box sx={{ mt: 2 }}>
                        <FormControlLabel
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row-reverse',
                            justifyContent: 'start',
                            ml: 2,
                            mr: 0,
                          }}
                          slotProps={{
                            typography: {
                              sx: { m: '0px !important', fontSize: 14 },
                            },
                          }}
                          control={
                            <Switch
                              color="primary"
                              size="small"
                              checked={showOptional}
                              onChange={handleToggleOptional}
                            />
                          }
                          label="Show optional fields"
                        />
                      </Box>
                    </>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={9} gap={2}>
                <NewHireRequestStateAlerts newHireRequest={newHireRequest} />

                {['created', 'user_partial_complete'].includes(
                  newHireRequest.fsm_state
                ) && (
                  <Box sx={{ mb: '300px' }}>
                    {sections.map(({ ref, id, Component }) => (
                      <Box key={id} ref={ref} sx={{ mb: 6 }}>
                        <Component
                          showOptional={showOptional}
                          newHireRequest={newHireRequest}
                          requiredFields={requiredFields}
                          prehireFields={prehireFields as PrehireFields}
                          codes={codes!}
                          managers={managers || []}
                          access={access!}
                        />
                        <Divider sx={{ my: 4 }} />
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EditNewHireRequestPage;
