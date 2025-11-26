import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';

import ContactFields from '../../components/onboarding/ContactFields';
import EmploymentFields from '../../components/onboarding/EmploymentFields';
import PayFields from '../../components/onboarding/PayFields';
import PersonalFields from '../../components/onboarding/PersonalFields';
import ValidationErrorSummary from '../../components/onboarding/ValidationErrorSummary';
import { useApi } from '../../hooks/useApi';

const PrehireRowEditDialog: React.FC<PrehireRowEditDialogProps> = ({
  open,
  row,
  onClose,
  onSave,
  prehireFields,
  codes,
  managers,
  access,
}) => {
  const api = useApi();
  const [showOptional, setShowOptional] = useState(false);
  const [newHireRequestData, setNewHireRequestData] =
    useState<NewHireRequest | null>(null);
  const [isLoadingNHR, setIsLoadingNHR] = useState(false);

  const handleToggleOptional = useCallback(() => {
    setShowOptional((prev) => !prev);
  }, []);

  const handleDialogClose = useCallback(() => {
    onClose();
    setNewHireRequestData(null); // Clear data on close
  }, [onClose]);

  // Fetch New Hire Request data when dialog opens
  useEffect(() => {
    const fetchNewHireRequest = async () => {
      if (open && row?.new_hire_request_id) {
        setIsLoadingNHR(true);
        try {
          const response = await api.onboarding.getNewHireRequestById(
            String(row.new_hire_request_id)
          );
          setNewHireRequestData(response.results);
        } catch (error) {
          console.error('Error fetching New Hire Request:', error);
        } finally {
          setIsLoadingNHR(false);
        }
      }
    };

    fetchNewHireRequest();
  }, [open, row?.new_hire_request_id, api]);

  // Helper functions for sanitizing values
  const sanitizeBirthDate = useCallback((value: string | undefined) => {
    if (!value) return '';
    // Only clear if it's the CSV template masking pattern with ## or multiple **
    if (value.includes('##/') || value === '**/**/****') return '';
    // Keep real dates and month-only masks from API
    return value;
  }, []);

  const sanitizeGender = useCallback((value: string | undefined) => {
    if (!value) return '';
    // Only clear if it's exactly the masking pattern
    if (value === '*****') return '';
    return value;
  }, []);

  // Convert gender label to code if needed
  const normalizeGenderValue = useCallback((value: string | undefined) => {
    if (!value) return '';

    // Map common gender labels to codes
    const genderLabelToCode: { [key: string]: string } = {
      male: 'M',
      female: 'F',
      'non-binary': 'X',
      'decline to state': 'D',
      decline: 'D',
    };

    // If it's already a code (single letter), return as-is
    if (value.length === 1) return value;

    // Try to convert label to code
    const normalized = value.toLowerCase().trim();
    return genderLabelToCode[normalized] || value;
  }, []);

  // Helper function to check if field should be included in validation
  const shouldIncludeField = useCallback((field: PrehireField) => {
    // Exclude fields that don't need validation or use different field names
    const excludedFields = [
      'ssn',
      'birth_date',
      'gender',
      'employee_status',
      'employee_number',
      'email_address',
      'work_email_address',
    ];
    return (
      field.required_for_electronic_onboarding &&
      !excludedFields.includes(field.field_name)
    );
  }, []);

  // Memoized required fields list
  const requiredFieldsList = useMemo(
    () =>
      (prehireFields?.fields || [])
        .filter(shouldIncludeField)
        .map((field: PrehireField) => field.field_name),
    [prehireFields, shouldIncludeField]
  );

  // Memoized validation schema
  const validationSchema = useMemo(
    () =>
      Yup.object().shape(
        (prehireFields?.fields || []).reduce(
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
      ),
    [prehireFields, shouldIncludeField]
  );

  // Use memoized initial values that include NHR data when available
  const initialValues: NewHireRequestFormValues = useMemo(
    () => ({
      address_line_1: row?.address_line_1 || '',
      address_line_2: row?.address_line_2 || '',
      benefits_group: row?.benefits_group || '',
      birth_date:
        newHireRequestData?.birth_date ||
        sanitizeBirthDate(row?.birth_date) ||
        '',
      citizenship_status: row?.citizenship_status || '',
      city: row?.city || '',
      state_code: row?.state_code || '',
      zip_code: row?.zip_code || '',
      department: row?.department || '',
      shift: row?.shift || '',
      division: row?.division || '',
      ethnicity: row?.ethnicity || '',
      project: row?.project || '',
      email_address:
        row?.email_address || row?.personal_email || row?.email || '',
      work_email_address: row?.work_email_address || row?.work_email || '',
      emergency_contact_info: row?.emergency_contact_info || '',
      emergency_contact_name: row?.emergency_contact_name || '',
      emergency_contact_relationship: row?.emergency_contact_relationship || '',
      employer_id: '',
      employee_type: row?.employee_type || '',
      supervisor: row?.supervisor || '',
      fed_filing_status: row?.fed_filing_status || '',
      work_group: row?.work_group || '',
      fed_allowances: row?.fed_withholding || row?.fed_allowances || '',
      fed_file_status: '',
      first_name: row?.first_name || '',
      first_pay_period_hours: row?.first_pay_period_hours || '',
      gender: normalizeGenderValue(
        newHireRequestData?.gender || sanitizeGender(row?.gender)
      ),
      home_phone: row?.home_phone || '',
      job: row?.job || '',
      last_name: row?.last_name || '',
      location: row?.location || '',
      manager: row?.manager || '',
      marital_status: row?.marital_status || '',
      middle_initial: row?.middle_initial || '',
      mobile_phone: row?.mobile_phone || '',
      pay_group: row?.pay_group || '',
      pay_method: row?.pay_method || '',
      pay_period: row?.pay_period || '',
      pay_rate: row?.pay_rate || '',
      ssn: newHireRequestData?.ssn || row?.ssn || '',
      standard_hours: row?.standard_hours || '',
      start_date: row?.start_date || '',
      auto_time_sheet: row?.auto_time_sheet || 'N',
      default_time_sheet_hours: row?.default_time_sheet_hours || '',
      preferred_language: row?.preferred_language || '',
      preferred_name: row?.preferred_name || '',
    }),
    [
      row,
      newHireRequestData,
      sanitizeBirthDate,
      sanitizeGender,
      normalizeGenderValue,
    ]
  );

  // Create newHireRequest object with fetched NHR data
  // PersonalFields will manage its own editMode state based on this
  // Setting fsm_state to 'user_partial_complete' ensures read-only mode for SSN/DOB/Gender
  const newHireRequest = useMemo(
    () =>
      newHireRequestData
        ? {
            ...newHireRequestData,
            // Override first/last name with row data (might be updated in CSV)
            first_name: row?.first_name || newHireRequestData.first_name,
            last_name: row?.last_name || newHireRequestData.last_name,
            // Normalize gender value to code
            gender: normalizeGenderValue(newHireRequestData.gender),
          }
        : ({
            fsm_state: 'user_partial_complete',
            first_name: row?.first_name || '',
            last_name: row?.last_name || '',
          } as NewHireRequest),
    [row?.first_name, row?.last_name, newHireRequestData, normalizeGenderValue]
  );

  const handleSubmit = useCallback(
    (values: NewHireRequestFormValues) => {
      if (!row) return; // Safety check

      // Convert back to PrehireRow format
      const updatedRow: PrehireRow = {
        new_hire_request_id: row.new_hire_request_id,
        client_id: row.client_id,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.work_email_address || values.email_address,
        birth_date: values.birth_date,
        gender: values.gender,
        ssn: values.ssn,
        address_line_1: values.address_line_1,
        address_line_2: values.address_line_2,
        city: values.city,
        state_code: values.state_code,
        zip_code: values.zip_code,
        start_date: values.start_date,
        employee_type: values.employee_type,
        pay_group: values.pay_group,
        pay_method: values.pay_method,
        pay_rate: values.pay_rate,
        pay_period: values.pay_period,
        standard_hours: values.standard_hours,
        middle_initial: values.middle_initial,
        preferred_name: values.preferred_name,
        marital_status: values.marital_status,
        ethnicity: values.ethnicity,
        preferred_language: values.preferred_language,
        email_address: values.email_address,
        work_email_address: values.work_email_address,
        home_phone: values.home_phone,
        mobile_phone: values.mobile_phone,
        emergency_contact_name: values.emergency_contact_name,
        emergency_contact_info: values.emergency_contact_info,
        emergency_contact_relationship: values.emergency_contact_relationship,
        location: values.location,
        job: values.job,
        department: values.department,
        division: values.division,
        shift: values.shift,
        benefits_group: values.benefits_group,
        supervisor: values.supervisor,
        manager: values.manager,
        project: values.project,
        work_group: values.work_group,
        default_time_sheet_hours: values.default_time_sheet_hours,
        first_pay_period_hours: values.first_pay_period_hours,
        auto_time_sheet: values.auto_time_sheet,
        fed_filing_status: values.fed_filing_status,
        fed_withholding: values.fed_allowances,
        citizenship_status: values.citizenship_status,
        rowIndex: row?.rowIndex,
        // Clear ALL errors and submitted flag when user manually edits - they'll be re-validated on save
        errors: undefined,
        submitted: false,
      };

      console.log('Saving edited row:', updatedRow);
      onSave(updatedRow);
    },
    [row, onSave]
  );

  if (!row || !prehireFields || !codes || !access) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
        },
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
      >
        {({ isSubmitting, errors, submitCount }) => (
          <Form noValidate>
            <DialogTitle
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 999,
                backgroundColor: 'white',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Edit Employee Information
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {row.first_name} {row.last_name}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                  }}
                >
                  <FormControlLabel
                    sx={{ display: 'flex', alignItems: 'center' }}
                    slotProps={{ typography: { sx: { fontSize: 14 } } }}
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
                  <Button
                    onClick={handleDialogClose}
                    variant="outlined"
                    size="medium"
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="medium"
                    loading={isSubmitting}
                  >
                    Save Changes
                  </LoadingButton>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent
              sx={{
                '&.MuiDialogContent-root': {
                  paddingTop: '16px !important',
                },
              }}
            >
              {isLoadingNHR ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 8,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {/* Submission Error Alert */}
                  {row.errors?.submission && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        Submission Error
                      </Typography>
                      <Typography variant="body2">
                        {row.errors.submission}
                      </Typography>
                    </Alert>
                  )}
                  <ValidationErrorSummary
                    errors={errors}
                    submitCount={Math.max(submitCount, 1)}
                  />

                  {newHireRequestData && (
                    <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
                      <Typography variant="body2">
                        <strong>Note:</strong> SSN, Date of Birth, and Gender
                        are loaded from the employee's New Hire Request and
                        cannot be edited here.
                      </Typography>
                    </Alert>
                  )}

                  <Box>
                    <PersonalFields
                      requiredFields={requiredFieldsList}
                      showOptional={showOptional}
                      newHireRequest={newHireRequest}
                    />

                    <Divider sx={{ my: 3 }} />

                    <EmploymentFields
                      access={access}
                      requiredFields={requiredFieldsList}
                      prehireFields={prehireFields}
                      showOptional={showOptional}
                      codes={codes}
                      managers={managers || []}
                    />

                    <Divider sx={{ my: 3 }} />

                    <ContactFields
                      requiredFields={requiredFieldsList}
                      showOptional={showOptional}
                    />

                    <Divider sx={{ my: 3 }} />

                    <PayFields
                      requiredFields={requiredFieldsList}
                      showOptional={showOptional}
                      codes={codes}
                    />
                  </Box>
                </>
              )}
            </DialogContent>
            {/* <DialogActions
              sx={{
                px: 3,
                py: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Button
                onClick={handleDialogClose}
                variant="outlined"
                size="medium"
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                size="medium"
                loading={isSubmitting}
              >
                Save Changes
              </LoadingButton>
            </DialogActions> */}
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default PrehireRowEditDialog;
