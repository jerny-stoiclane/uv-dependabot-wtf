import { PageSpinner, useNotifications } from '@armhr/ui';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import ContactFields from '../../components/onboarding/ContactFields';
import DevNewHireFormFiller from '../../components/onboarding/DevNewHireFormFiller';
import EmploymentFields from '../../components/onboarding/EmploymentFields';
import PayFields from '../../components/onboarding/PayFields';
import PersonalFields from '../../components/onboarding/PersonalFields';
import ValidationErrorSummary from '../../components/onboarding/ValidationErrorSummary';
import { useCompany } from '../../contexts/company.context';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { paths } from '../../utils/paths';

const initialValues: NewHireRequestFormValues = {
  address_line_1: '',
  address_line_2: '',
  benefits_group: '',
  birth_date: '',
  citizenship_status: '',
  city: '',
  state_code: '',
  zip_code: '',
  department: '',
  shift: '',
  division: '',
  ethnicity: '',
  project: '',
  email_address: '',
  work_email_address: '',
  emergency_contact_info: '',
  emergency_contact_name: '',
  emergency_contact_relationship: '',
  employer_id: '',
  employee_type: '',
  supervisor: '',
  fed_filing_status: '',
  work_group: '',
  fed_allowances: '',
  fed_file_status: '',
  first_name: '',
  first_pay_period_hours: '',
  gender: '',
  home_phone: '',
  job: '',
  last_name: '',
  location: '',
  manager: '',
  marital_status: '',
  middle_initial: '',
  mobile_phone: '',
  pay_group: '',
  pay_method: '',
  pay_period: '',
  pay_rate: '',
  ssn: '',
  standard_hours: '',
  start_date: '',
  auto_time_sheet: 'N',
  default_time_sheet_hours: '',
  preferred_language: '',
  preferred_name: '',
};

const NewHireRequestFullPage = () => {
  const api = useApi();
  const { showNotification } = useNotifications();
  const company = useCompany();
  const navigate = useNavigate();
  const [showOptional, setShowOptional] = useState(true);
  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);
  const handleToggleOptional = useCallback(() => {
    setShowOptional((prev) => !prev);
  }, []);

  const { data: prehireFields, loading } = useApiData((api) =>
    api.onboarding.getPrehireFields()
  );

  const fields = prehireFields?.fields;

  const { data: access, loading: accessLoading } = useApiData((api) =>
    api.profiles.getUserAccess()
  );

  const { data: codes, loading: codesLoading } = useApiData<CompanyCode>(
    (api) => api.company.getCodes()
  );

  const { data: managers, loading: managersLoading } = useApiData<
    PrismSecurityUser[]
  >((api) => api.company.getActivePrismUsers());

  if (loading || accessLoading || codesLoading || managersLoading)
    return <PageSpinner />;

  const shouldIncludeField = (field: PrehireField) => {
    const excludedFields = ['ssn', 'employee_status', 'employee_number'];

    return (
      field.required_for_electronic_onboarding &&
      !excludedFields.includes(field.field_name)
    );
  };

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
    try {
      const res = await api.onboarding.createPrehire({
        ...values,
        company_name: company.name,
      });

      if (res.detail) {
        throw new Error('There was a problem saving the new hire');
      }

      if (!res.results.commitResult) {
        throw new Error(res.results.errorMessage);
      }
      navigate(paths.newHires, {
        state: {
          persistNotification: true,
        },
      });
      showNotification({
        message: (
          <>
            Success! An email has been sent to{' '}
            <strong>{values.work_email_address}</strong> with instructions to
            continue onboarding
          </>
        ),
        severity: 'success',
      });
    } catch (err: any) {
      const response = err?.response?.data;
      let errorContent: string | undefined;

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

  if (!access || !codes) {
    navigate(paths.newHires, { state: { persistNotification: true } });
    showNotification({
      message:
        'There was an issue loading the new hire form. Please try again.',
      severity: 'error',
    });
    return null;
  }

  return (
    <>
      <Helmet>
        <title>New Hire Request | Armhr</title>
        <meta
          name="description"
          content="Submit a new hire request with full employee information."
        />
      </Helmet>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ isSubmitting, errors, submitCount }) => {
          return (
            <Form noValidate>
              <Box sx={{ display: 'flex', justifyContent: 'start', mb: 6 }}>
                <Box>
                  <Typography variant="h2" mb={0.5}>
                    New hire setup for {company?.name}
                  </Typography>
                  <Typography variant="body1">
                    On save, an e-mail with instructions to continue onboarding
                    will be sent to the new hire.
                  </Typography>
                  <FormControlLabel
                    sx={{ mt: 2, display: 'flex', alignItems: 'center' }}
                    slotProps={{
                      typography: {
                        sx: {
                          ml: 1,
                          fontSize: 14,
                        },
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
                <Box
                  sx={{
                    ml: 'auto',
                    display: 'flex',
                    alignItems: 'flex-start',
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
                    managers={managers || undefined}
                    access={access}
                  />
                  <LoadingButton
                    color="primary"
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                    type="submit"
                    loading={isSubmitting}
                    variant="contained"
                  >
                    Save new hire
                  </LoadingButton>
                </Box>
              </Box>
              <ValidationErrorSummary
                errors={errors}
                submitCount={submitCount}
              />
              <Box sx={{ mb: 8 }}>
                <PersonalFields
                  requiredFields={requiredFields}
                  showOptional={showOptional}
                />

                <Divider sx={{ mt: 3, mb: 6 }} />

                <EmploymentFields
                  access={access}
                  requiredFields={requiredFields}
                  prehireFields={prehireFields}
                  showOptional={showOptional}
                  codes={codes!}
                  managers={managers || []}
                />

                <Divider sx={{ mt: 3, mb: 6 }} />

                <ContactFields
                  requiredFields={requiredFields}
                  showOptional={showOptional}
                />

                <Divider sx={{ mt: 3, mb: 6 }} />

                <PayFields
                  requiredFields={requiredFields}
                  showOptional={showOptional}
                  codes={codes}
                />
              </Box>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
export default NewHireRequestFullPage;
