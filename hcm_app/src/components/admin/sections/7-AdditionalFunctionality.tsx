import { Section } from '@armhr/ui';
import { Info } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { useFormikContext } from 'formik';
import React from 'react';

import { FormValues } from '../userAccessFormValues';

const AdditionalFunctionality: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<FormValues>();

  return (
    <Section title="Additional functionality" vertical={true}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={values.client_401k_admin}
              onChange={(event) =>
                setFieldValue('client_401k_admin', event.target.checked)
              }
            />
          }
          label="Client 401(k) Plan Administration (Not through Armhr)"
        />
        <Tooltip
          title={
            <Typography variant="body1">
              Clients with own 401(k) plan that is in the Armhr payroll system
              are required to administer their plan enrollments, changes, and
              loans. Check this box to request access.
            </Typography>
          }
          placement="top"
          arrow
        >
          <IconButton size="small">
            <Info fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography my={1} fontWeight="bold">
        Time Clock Partner (Check one):
      </Typography>

      <RadioGroup
        name="time_clock_partner"
        value={values.time_clock_partner}
        onChange={(event) =>
          setFieldValue('time_clock_partner', event.target.value)
        }
      >
        <FormControlLabel
          value="swipeclock"
          control={<Radio />}
          label="Swipeclock"
        />
        <FormControlLabel value="timeco" control={<Radio />} label="TimeCo" />
        <FormControlLabel value="tcp" control={<Radio />} label="TCP" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
      </RadioGroup>
    </Section>
  );
};

export default AdditionalFunctionality;
