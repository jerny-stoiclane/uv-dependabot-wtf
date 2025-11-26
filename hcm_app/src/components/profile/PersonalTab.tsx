import { Dropdown, PhoneNumberField, Section, SecureText } from '@armhr/ui';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';

import { genderIdentities, preferredPronouns } from '../../utils/constants';
import { formatDate } from '../../utils/date';
import { getDisplayName } from '../../utils/profile';
import { CalendarBirthdaySwitch } from './CalendarBirthdaySwitch';

export const PersonalTab = () => {
  const { handleChange, values } = useFormikContext<ProfileFormValues>();

  return (
    <Section
      title="Personal information"
      vertical={true}
      description={
        <Box>
          <Typography variant="body1" color="grey.500" mb={2}>
            Contact your HR administrator to update any incorrect information.
          </Typography>
        </Box>
      }
    >
      <Grid container mb={2} gap={2} rowGap={2}>
        <Grid item xs>
          <Typography variant="caption">Name</Typography>
          <Typography>
            {getDisplayName(values, false)} {values?.middle_initial || null}{' '}
            {values.last_name}
          </Typography>
        </Grid>
      </Grid>
      <Grid container mb={3} gap={2} rowGap={2}>
        <Grid item xs>
          <Typography variant="caption">Date of birth</Typography>
          <SecureText text={formatDate(values?.birth_date)} />
        </Grid>
        <Grid item xs>
          <Typography variant="caption">Last 4 of SSN</Typography>
          <Typography>{values.compensation?.last4_ssn}</Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="caption">User ID</Typography>
          <Typography>{values.user_id}</Typography>
        </Grid>
      </Grid>
      <Grid container mb={3} gap={2} rowGap={2}>
        <Grid item xs>
          <Dropdown
            fullWidth
            label="Gender identity"
            name="gender_identity"
            onChange={handleChange}
            value={values.gender_identity}
            options={genderIdentities}
          />
        </Grid>
        <Grid item xs>
          <Dropdown
            fullWidth
            label="Preferred pronouns"
            name="preferred_pronouns"
            onChange={handleChange}
            value={values.preferred_pronouns}
            options={preferredPronouns}
          />
        </Grid>
        <Grid item xs>
          <TextField
            name="nickname"
            label="Preferred name"
            fullWidth
            onChange={handleChange}
            value={values.nickname}
          />
        </Grid>
      </Grid>
      <Grid container gap={2} mb={2}>
        <Grid item xs>
          <PhoneNumberField
            fullWidth
            type="text"
            name="phone_numbers.home"
            label="Home phone number"
            onChange={handleChange}
            value={values.phone_numbers?.home}
          />
        </Grid>
        <Grid item xs>
          <PhoneNumberField
            fullWidth
            type="text"
            name="phone_numbers.mobile"
            label="Mobile phone number"
            onChange={handleChange}
            value={values.phone_numbers?.mobile}
          />
        </Grid>
      </Grid>

      <Box>
        <CalendarBirthdaySwitch />
      </Box>
    </Section>
  );
};
