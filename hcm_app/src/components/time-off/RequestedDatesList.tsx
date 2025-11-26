import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import { useState } from 'react';

import { formatDate } from '../../utils/date';

export const RequestedDatesList: React.FC<{ onReset: () => void }> = ({
  onReset,
}) => {
  const { setFieldValue, handleChange, values } =
    useFormikContext<RequestTimeOffFormValues>();
  const [openDialog, setOpenDialog] = useState(false);
  const [hoursInput, setHoursInput] = useState('');

  if (!values.requests.length) return null;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSetHours = () => {
    // Update all requests' hours
    const hours = parseFloat(hoursInput);
    if (!isNaN(hours)) {
      const updatedRequests = values.requests.map((request) => ({
        ...request,
        hours,
      }));
      setFieldValue('requests', updatedRequests);
    }
    handleCloseDialog();
  };

  return (
    <>
      <FieldArray
        name="requests"
        render={({ remove }) => (
          <Box
            sx={{
              borderRadius: 1,
              bgcolor: 'rgb(242, 248, 255)',
              p: 2,
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" fontWeight="600">
                Requested dates
              </Typography>
              <Stack direction="row" spacing={1.25} sx={{ ml: 'auto' }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ padding: '2px 12px', fontSize: 12 }}
                  onClick={onReset}
                >
                  Reset
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ padding: '2px 12px', fontSize: 12 }}
                  onClick={handleOpenDialog}
                >
                  Set all hours
                </Button>
              </Stack>
            </Box>
            {values.requests.map((request, indx) => (
              <Box
                key={+request.date}
                width={1}
                display="flex"
                alignItems="center"
                mb={2}
                gap={2}
              >
                <Typography
                  sx={{
                    flex: 1,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    bgcolor: 'white',
                    padding: '8px',
                    borderRadius: '4px',
                  }}
                  variant="body1"
                >
                  {formatDate(request.date, 'WITH_WEEKDAY')}
                </Typography>
                <TextField
                  label="Hours requested"
                  type="number"
                  size="small"
                  name={`requests.[${indx}].hours`}
                  value={values.requests[indx].hours}
                  onChange={handleChange}
                  sx={{ flex: 1, bgcolor: 'white' }}
                  InputLabelProps={{
                    sx: { fontSize: 14 },
                  }}
                  InputProps={{
                    inputProps: { min: 0, max: 24 },
                  }}
                />
                <Button
                  sx={{ minHeight: 34, minWidth: 36 }}
                  variant="outlined"
                  color="error"
                  onClick={() => remove(indx)}
                >
                  <Close sx={{ fontSize: 16 }} />
                </Button>
              </Box>
            ))}
          </Box>
        )}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Set hours on all requested dates</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="hours"
            label="Hours"
            type="number"
            fullWidth
            variant="outlined"
            value={hoursInput}
            onChange={(e) => setHoursInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSetHours}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RequestedDatesList;
