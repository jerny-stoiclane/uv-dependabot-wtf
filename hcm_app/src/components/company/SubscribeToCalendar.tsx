import { Clipboard } from '@armhr/ui';
import { Box, ButtonProps, TextField, TextFieldProps } from '@mui/material';
import React from 'react';

type SubscribeToCalendarProps = {
  clientId: string;
  employeeId: string;
  buttonProps?: ButtonProps;
  inputProps?: TextFieldProps;
  selectedFilters: string[];
};

const SubscribeToCalendar: React.FC<SubscribeToCalendarProps> = ({
  clientId,
  employeeId,
  selectedFilters,
  inputProps = {},
}) => {
  const baseUrl = import.meta.env.VITE_APP_BACKEND_BASE_URL;

  let raw = `${clientId}|${selectedFilters.find((filter) =>
    ['everyone', 'direct_reports', 'all_reports'].includes(filter)
  )}`;
  if (selectedFilters.includes('pto')) {
    raw += `|${employeeId}`;
  }

  const url = `${baseUrl}/public/calendar/ics/${btoa(raw)}`;

  return (
    <Box display="flex" alignItems="center">
      <Clipboard
        text={[url]}
        displayText={
          <Box sx={{ display: 'flex', alignItems: 'center', pr: 5 }}>
            <TextField
              value={url}
              variant="outlined"
              size="small"
              {...inputProps}
              InputProps={{
                sx: { fontSize: 12 },
                readOnly: true,
              }}
              autoFocus
              onFocus={(e) => e.target.select()}
            />
          </Box>
        }
      />
    </Box>
  );
};

export default SubscribeToCalendar;
