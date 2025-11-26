import { Avatar } from '@armhr/ui';
import {
  Box,
  Button,
  Card,
  Chip,
  Link,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';
import { green, grey, lightGreen, orange, red } from '@mui/material/colors';
import {
  LocalizationProvider,
  StaticDateRangePicker,
} from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { startCase, toLower } from 'lodash';
import { useState } from 'react';

import { formatDate } from '../../utils/date';

const PtoRequestCard: React.FC<{
  approverName?: string;
  name?: string;
  request: PtoRequest;
}> = ({ approverName, name, request }) => {
  const newHireRequestStates = {
    A: {
      border: green[300],
      background: green[50],
      label: 'Approved',
    },
    N: {
      border: orange[300],
      background: orange[50],
      label: 'Pending',
    },
    P: {
      border: lightGreen[300],
      background: lightGreen[50],
      label: 'Paid',
    },
    D: {
      border: red[300],
      background: red[50],
      label: 'Denied',
    },
    C: {
      border: grey[300],
      background: grey[50],
      label: 'Cancelled',
    },
  };

  const requestStatus = newHireRequestStates[request.status] || {
    border: grey[300],
    background: grey[50],
    label: 'Unknown',
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClickDate = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-popover' : undefined;
  return (
    <Card
      sx={{
        display: 'flex',
        p: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 0,
        borderLeft: `5px solid ${requestStatus.border}`,
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: 200,
          maxWidth: 200,
        }}
      >
        <Avatar name={name || request.name} sx={{ mr: 2 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Link
            href={`/employees/${request.employee_id}`}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name || startCase(toLower(request.name))}
          </Link>
          {approverName && (
            <Typography variant="caption" color="text.secondary">
              {approverName}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', width: '10%' }}>
        <Typography variant="caption">Status:</Typography>
        <Chip
          label={requestStatus.label}
          size="small"
          sx={{
            bgcolor: requestStatus.background,
            border: `1px solid ${requestStatus.border}`,
          }}
        />
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDateRangePicker
              displayStaticWrapperAs="desktop"
              value={[
                request.start ? new Date(request.start) : null,
                request.end ? new Date(request.end) : null,
              ]}
              readOnly
            />
          </LocalizationProvider>
        </Box>
      </Popover>

      <Button
        aria-describedby={id}
        variant="text"
        onClick={handleClickDate}
        sx={{
          textTransform: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          minWidth: 200,
          backgroundColor: open ? 'grey.100' : 'transparent',
          '&:hover': {
            backgroundColor: open ? 'grey.100' : '',
          },
          color: open ? 'primary.main' : '#262626',
        }}
      >
        <Typography variant="caption">Dates:</Typography>
        <Typography>
          {formatDate(request.start, 'MMM dd, yyyy')} &mdash;{' '}
          {formatDate(request.end, 'MMM dd, yyyy')}
        </Typography>
      </Button>

      <Box sx={{ width: '10%' }}>
        <Typography variant="caption">Leave type:</Typography>
        <Typography>{request.leave_type}</Typography>
      </Box>

      <Box sx={{ width: '10%' }}>
        <Typography variant="caption">Time:</Typography>
        <Typography>
          {request.details.reduce(
            (acc, detail) => acc + Number(detail.hours),
            0
          )}{' '}
          hours
        </Typography>
      </Box>

      {request.comment ? (
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption">Comment:</Typography>
          {request.comment && request.comment.length > 20 ? (
            <Tooltip title={request.comment} placement="top">
              <Typography>{request.comment}</Typography>
            </Tooltip>
          ) : (
            <Typography>{request.comment}</Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ flex: 1 }} />
      )}
    </Card>
  );
};

export default PtoRequestCard;
