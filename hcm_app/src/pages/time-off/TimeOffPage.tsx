import { ButtonLink, Dropdown, PageSpinner } from '@armhr/ui';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';

import { useApiData } from '../../hooks/useApiData';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';

const TimeOffPage: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const {
    data: ptoRequest,
    loading,
    error,
  } = useApiData<PtoRequest>((api) =>
    api.benefits.getPtoRequestById(requestId!)
  );

  if (loading) {
    return <PageSpinner />;
  }

  if (!requestId || !ptoRequest || error) {
    navigate(paths.dashboard);
    return null;
  }

  const { id, start, end, comment, details, reason } = ptoRequest;

  return (
    <>
      <Helmet>
        <title>Time Off Request | Armhr</title>
        <meta name="description" content="View time off request details." />
      </Helmet>
      <Box sx={{ display: 'flex', mb: 4 }}>
        <Box>
          <Typography variant="h2">Time off request</Typography>
          {details.length > 1 ? (
            <Typography variant="h5" display="block">
              ({formatDate(start, 'FULL')} - {formatDate(end, 'FULL')})
            </Typography>
          ) : (
            <Typography variant="h5" display="block">
              ({formatDate(start, 'FULL')})
            </Typography>
          )}
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <ButtonLink color="secondary" variant="outlined" href={paths.timeOff}>
            Back
          </ButtonLink>
        </Box>
      </Box>

      <Card>
        <CardHeader
          title={
            <Box display="flex">
              <Typography fontWeight="700" flex={1}>
                Request details
              </Typography>
            </Box>
          }
          sx={{
            backgroundColor: 'grey.100',
            px: 2,
            py: 1.5,
          }}
        />

        <CardContent>
          <Box mb={4}>
            {details.map((detail) => (
              <Box key={id} width={1} display="flex" gap={2} mb={2}>
                <TextField
                  disabled
                  sx={{ flex: 1 }}
                  label="Date"
                  value={formatDate(detail.date, 'WITH_WEEKDAY')}
                />
                <TextField
                  disabled
                  label="Hours requested"
                  type="number"
                  sx={{ flex: 1 }}
                  value={detail.hours}
                  InputProps={{
                    inputProps: { min: 0, max: 24 },
                  }}
                />
              </Box>
            ))}
          </Box>

          <Dropdown
            fullWidth
            disabled
            name="reason"
            label="Type"
            options={[{ value: reason, label: reason }]}
            sx={{ mb: 4 }}
            value={reason}
          />

          {!!comment && (
            <TextField
              fullWidth
              multiline
              disabled
              name="message"
              label="Comment"
              value={comment}
              rows={4}
              sx={{ mb: 4 }}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TimeOffPage;
