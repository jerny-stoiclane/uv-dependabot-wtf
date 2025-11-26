import {
  Dropdown,
  FormikDatePicker,
  Section,
  SecureIdentifierField,
} from '@armhr/ui';
import { Alert, Box, Link, Paper, Stack, Typography } from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';

import { useUser } from '../../hooks/useUser';
import {
  ethnicities,
  gender,
  languages,
  maritalStatuses,
} from '../../utils/constants';
import { formatDate } from '../../utils/date';
import useOptionalFieldsToggle from './useOptionalFieldsToggle';

const PersonalFields = ({
  requiredFields,
  showOptional,
  newHireRequest,
}: {
  requiredFields: string[];
  showOptional: boolean;
  newHireRequest?: NewHireRequest;
}) => {
  const { user } = useUser();
  const formik = useFormikContext<NewHireRequestFormValues>();
  const [editMode, setEditMode] = useState(
    newHireRequest?.fsm_state === 'created' ||
      newHireRequest?.fsm_state === undefined
  );

  const getActiveEmail = () => {
    if (
      user?.is_work_email_enabled &&
      formik.values.work_email_address?.trim()
    ) {
      return formik.values.work_email_address;
    }
    return formik.values.email_address;
  };

  const hasValidEmail = () => {
    if (user?.is_work_email_enabled) {
      return !!formik.values.work_email_address?.trim();
    }
    return !!formik.values.email_address?.trim();
  };

  const personalFields = [
    'middle_initial',
    'preferred_name',
    'email_address',
    'ethnicity',
    'martial_status',
    'preferred_language',
  ];

  const { getToggleLink, shouldRenderField } = useOptionalFieldsToggle(
    showOptional,
    requiredFields,
    personalFields
  );

  const handleEdit = () => {
    formik.setFieldValue('ssn', '');
    setEditMode(true);
  };

  return (
    <Section
      title="Personal information"
      description={<Box>{getToggleLink()}</Box>}
      vertical={!!newHireRequest}
    >
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Field
            name="first_name"
            label="Legal first name"
            fullWidth
            required={requiredFields.includes('first_name')}
            value={formik.values.first_name}
            onChange={formik.handleChange}
            component={TextField}
            error={!!formik.errors.first_name}
            helperText={formik.errors.first_name}
          />
          {shouldRenderField('middle_initial') && (
            <Field
              name="middle_initial"
              label="Middle initial"
              fullWidth
              required={requiredFields.includes('middle_initial')}
              value={formik.values.middle_initial}
              onChange={formik.handleChange}
              component={TextField}
              error={!!formik.errors.middle_initial}
              helperText={formik.errors.middle_initial}
            />
          )}
          <Field
            name="last_name"
            label="Legal last name"
            fullWidth
            required={requiredFields.includes('last_name')}
            value={formik.values.last_name}
            onChange={formik.handleChange}
            component={TextField}
            error={!!formik.errors.last_name}
            helperText={formik.errors.last_name}
          />
        </Box>
        {editMode ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormikDatePicker
              name="birth_date"
              label="Birth date"
              sx={{ width: '100%' }}
              required={requiredFields.includes('birth_date')}
              error={!!formik.errors.birth_date}
            />
            <Field
              name="ssn"
              label="SSN"
              fullWidth
              required={requiredFields.includes('ssn')}
              value={formik.values.ssn}
              onChange={formik.handleChange}
              unmask={true}
              identifierType="SSN"
              as={SecureIdentifierField}
              error={!!formik.errors.ssn}
              helperText={formik.errors.ssn}
            />
            <Dropdown
              name="gender"
              label="Gender"
              fullWidth
              required={requiredFields.includes('gender')}
              value={formik.values.gender}
              options={
                gender?.map((genderCode) => ({
                  value: genderCode.value,
                  label: genderCode.label,
                })) || []
              }
              onChange={formik.handleChange}
              formControlProps={{
                error: !!formik.errors.gender,
              }}
            />
          </Box>
        ) : (
          <SummaryBox onEdit={handleEdit} formik={formik} />
        )}
        {hasValidEmail() && (
          <Alert severity="info" sx={{ py: 1.5, mb: 3 }}>
            <Typography variant="body1" sx={{ lineHeight: '20px' }}>
              After you submit, {formik.values.first_name} will be sent an
              e-mail with instructions to complete onboarding. This email will
              be sent to <strong>{getActiveEmail()}</strong>.
            </Typography>
          </Alert>
        )}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Field
            name="email_address"
            label="Personal email"
            fullWidth
            required={requiredFields.includes('email_address')}
            value={formik.values.email_address}
            onChange={formik.handleChange}
            component={TextField}
            error={!!formik.errors.email_address}
            helperText={formik.errors.email_address}
          />
          <Field
            name="work_email_address"
            label="Work email"
            fullWidth
            required={requiredFields.includes('work_email_address')}
            value={formik.values.work_email_address}
            onChange={formik.handleChange}
            component={TextField}
            error={!!formik.errors.work_email_address}
            helperText={formik.errors.work_email_address}
          />
        </Box>
        {shouldRenderField([
          'ethnicity',
          'martial_status',
          'preferred_language',
          'preferred_name',
        ]) && (
          <>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {shouldRenderField('preferred_name') && (
                <Field
                  name="preferred_name"
                  label="Preferred name"
                  fullWidth
                  required={requiredFields.includes('preferred_name')}
                  value={formik.values.preferred_name}
                  onChange={formik.handleChange}
                  component={TextField}
                  error={!!formik.errors.preferred_name}
                  helperText={formik.errors.preferred_name}
                />
              )}
              {shouldRenderField('martial_status') && (
                <Dropdown
                  name="marital_status"
                  label="Marital status"
                  fullWidth
                  required={requiredFields.includes('marital_status')}
                  value={formik.values.marital_status}
                  options={maritalStatuses || []}
                  onChange={formik.handleChange}
                  formControlProps={{
                    error: !!formik.errors.marital_status,
                  }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {shouldRenderField('ethnicity') && (
                <Dropdown
                  name="ethnicity"
                  label="Ethnicity"
                  fullWidth
                  required={requiredFields.includes('ethnicity')}
                  value={formik.values.ethnicity}
                  options={ethnicities || []}
                  onChange={formik.handleChange}
                  formControlProps={{
                    error: !!formik.errors.ethnicity,
                  }}
                />
              )}
              {shouldRenderField('preferred_language') && (
                <Dropdown
                  name="preferred_language"
                  label="Preferred Language"
                  fullWidth
                  required={requiredFields.includes('preferred_language')}
                  value={formik.values.preferred_language}
                  options={languages || []}
                  onChange={formik.handleChange}
                  formControlProps={{
                    error: !!formik.errors.preferred_language,
                  }}
                />
              )}
            </Box>
          </>
        )}
      </Stack>
    </Section>
  );
};

const SummaryBox = ({ onEdit, formik }) => {
  return (
    <Paper variant="outlined" sx={{ position: 'relative', padding: 2 }}>
      <Link
        sx={{ position: 'absolute', top: 8, right: 8, fontSize: 12 }}
        onClick={onEdit}
        href="#"
      >
        Edit
      </Link>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '33%',
          }}
        >
          <Typography variant="subtitle1">Birth Date</Typography>
          <Typography variant="body1">
            {formatDate(formik.values.birth_date)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '33%',
          }}
        >
          <Typography variant="subtitle1">SSN</Typography>
          <Typography variant="body1">{formik.values.ssn}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '33%',
          }}
        >
          <Typography variant="subtitle1">Gender</Typography>
          <Typography variant="body1">
            {gender.find((g) => g.value === formik.values.gender)?.label}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default PersonalFields;
