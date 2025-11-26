import { Dropdown, PhoneNumberField, Section } from '@armhr/ui';
import { Box, Stack, Typography } from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';

import { statesAndCodes } from '../../utils/constants';
import useOptionalFieldsToggle from './useOptionalFieldsToggle';

const ContactFields = ({
  requiredFields,
  showOptional,
  newHireRequest,
}: {
  requiredFields: string[];
  showOptional: boolean;
  newHireRequest?: NewHireRequest;
}) => {
  const formik = useFormikContext<NewHireRequestFormValues>();

  const contactFields = [
    'address_line_1',
    'city',
    'state',
    'zip_code',
    'home_phone',
    'mobile_phone',
    'work_phone',
    'work_email',
    'personal_email',
  ];

  const { showOptionalFields, getToggleLink, shouldRenderField } =
    useOptionalFieldsToggle(showOptional, requiredFields, contactFields);

  return (
    <Section
      title="Contact information"
      vertical={!!newHireRequest}
      description={<Box>{getToggleLink()}</Box>}
    >
      {!showOptionalFields &&
        contactFields.every((field) => !requiredFields.includes(field)) && (
          <Typography variant="body1" color="gray">
            No fields are required.
          </Typography>
        )}
      <Stack spacing={3}>
        {shouldRenderField('address_line_1') && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Field
              name="address_line_1"
              label="Address line 1"
              fullWidth
              required={requiredFields.includes('address_line_1')}
              value={formik.values.address_line_1}
              onChange={formik.handleChange}
              component={TextField}
              error={!!formik.errors.address_line_1}
              helperText={formik.errors.address_line_1}
            />
          </Box>
        )}
        {shouldRenderField(['city', 'state_code', 'zip_code']) && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {shouldRenderField('city') && (
              <Field
                name="city"
                label="City"
                fullWidth
                required={requiredFields.includes('city')}
                value={formik.values.city}
                onChange={formik.handleChange}
                component={TextField}
                error={!!formik.errors.city}
                helperText={formik.errors.city}
              />
            )}
            {shouldRenderField('state_code') && (
              <Dropdown
                name="state_code"
                label="State"
                fullWidth
                required={requiredFields.includes('state_code')}
                value={formik.values.state_code}
                options={statesAndCodes || []}
                onChange={formik.handleChange}
                error={!!formik.errors.state_code}
              />
            )}
            {shouldRenderField('zip_code') && (
              <Field
                name="zip_code"
                label="Zip code"
                fullWidth
                required={requiredFields.includes('zip_code')}
                value={formik.values.zip_code}
                onChange={formik.handleChange}
                component={TextField}
                error={!!formik.errors.zip_code}
                helperText={formik.errors.zip_code}
              />
            )}
          </Box>
        )}
        {shouldRenderField(['home_phone', 'mobile_phone']) && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {shouldRenderField('home_phone') && (
              <Field
                name="home_phone"
                label="Home phone"
                fullWidth
                required={requiredFields.includes('home_phone')}
                unmask
                value={formik.values.home_phone}
                onChange={formik.handleChange}
                as={PhoneNumberField}
                error={!!formik.errors.home_phone}
                helperText={formik.errors.home_phone}
              />
            )}
            {shouldRenderField('mobile_phone') && (
              <Field
                name="mobile_phone"
                label="Mobile phone"
                fullWidth
                required={requiredFields.includes('mobile_phone')}
                unmask
                value={formik.values.mobile_phone}
                onChange={formik.handleChange}
                as={PhoneNumberField}
                error={!!formik.errors.mobile_phone}
                helperText={formik.errors.mobile_phone}
              />
            )}
          </Box>
        )}
        {shouldRenderField([
          'emergency_contact_name',
          'emergency_contact_info',
          'emergency_contact_relationship',
        ]) && (
          <>
            <Typography variant="caption">Emergency contact</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {shouldRenderField('emergency_contact_name') && (
                <Field
                  name="emergency_contact_name"
                  label="Contact name"
                  fullWidth
                  required={requiredFields.includes('emergency_contact_name')}
                  value={formik.values.emergency_contact_name}
                  onChange={formik.handleChange}
                  component={TextField}
                  error={!!formik.errors.emergency_contact_name}
                  helperText={formik.errors.emergency_contact_name}
                />
              )}
              {shouldRenderField('emergency_contact_info') && (
                <Field
                  name="emergency_contact_info"
                  label="Contact phone number"
                  fullWidth
                  required={requiredFields.includes('emergency_contact_info')}
                  value={formik.values.emergency_contact_info}
                  onChange={formik.handleChange}
                  as={PhoneNumberField}
                  error={!!formik.errors.emergency_contact_info}
                  helperText={formik.errors.emergency_contact_info}
                />
              )}
              {shouldRenderField('emergency_contact_relationship') && (
                <Field
                  name="emergency_contact_relationship"
                  label="Contact relationship"
                  fullWidth
                  required={requiredFields.includes(
                    'emergency_contact_relationship'
                  )}
                  value={formik.values.emergency_contact_relationship}
                  onChange={formik.handleChange}
                  component={TextField}
                  error={!!formik.errors.emergency_contact_relationship}
                  helperText={formik.errors.emergency_contact_relationship}
                />
              )}
            </Box>
          </>
        )}
      </Stack>
    </Section>
  );
};

export default ContactFields;
