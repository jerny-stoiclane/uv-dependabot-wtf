import {
  ButtonLink,
  ConfirmationDialog,
  DataTable,
  PageSpinner,
  Table,
  useNotifications,
} from '@armhr/ui';
import type { NotificationOptions } from '@armhr/ui/src/types';
import {
  Box,
  Button,
  Chip,
  Link,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { blue, green, grey, orange, red } from '@mui/material/colors';
import { GridRowsProp } from '@mui/x-data-grid';
import { isAfter, isEqual, parseISO, startOfToday } from 'date-fns';
import { sumBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import HolidayCard from '../../components/time-off/HolidayCard';
import NextHolidayCard from '../../components/time-off/NextHolidayCard';
import PtoPlanCard from '../../components/time-off/PtoPlanCard';
import { useApi } from '../../hooks/useApi';
import useFetchHolidays from '../../hooks/useFetchHolidays';
import { useRedirectToDashboard } from '../../hooks/useRedirectToDashboard';
import { useUser } from '../../hooks/useUser';
import { safeParseFloat } from '../../utils/benefits';
import { ptoStatusTypes } from '../../utils/constants';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';

const statusColors = {
  A: { border: green[700], background: green[50] },
  C: { border: red[700], background: red[50] },
  N: { border: orange[700], background: orange[50] },
  P: { border: blue[700], background: blue[50] },
};

const TimeOffListPage: React.FC = () => {
  const api = useApi();
  const { showNotification } = useNotifications();
  const { user } = useUser();
  const holidays = useFetchHolidays();
  const [ptoPlans, setPtoPlans] = useState<PtoPlan[]>([]);
  const [ptoRequests, setPtoRequests] = useState<PtoRequest[]>([]);
  const [ptoCalculations, setPtoCalculations] = useState<
    Record<string, PtoHourInfo>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PtoRequest | null>(
    null
  );

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(1200));
  const location = useLocation();

  // if armhr pto is disabled, redirect to dashboard
  const armhrPtoEnabled = user?.is_armhr_pto_enabled;
  useRedirectToDashboard(!armhrPtoEnabled);

  // this is triggered when a user successfully submits a time off request
  // and gets redirected here. We still want to show a success notification after the redirect
  useEffect(() => {
    if (location?.state?.notification) {
      const { message, severity } = location.state
        .notification as NotificationOptions;
      showNotification({ message, severity });
    }
  }, [location]);

  useEffect(() => {
    if (!!ptoPlans.length) {
      return;
    }

    setLoading(true);
    const ptoPromise = api.benefits.getPto();
    const summaryPromise = api.benefits.getPtoRequestsSummary();

    Promise.allSettled([ptoPromise, summaryPromise])
      .then(([ptoResult, summaryResult]) => {
        if (ptoResult.status === 'fulfilled') {
          setPtoPlans(ptoResult.value.results || []);
        }

        if (summaryResult.status === 'fulfilled') {
          setPtoRequests(summaryResult.value.results?.pto_requests || []);
          setPtoCalculations(summaryResult.value.results?.pto_summary || {});
        }

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <PageSpinner />;

  const handleCancelPtoRequest = async (requestId) => {
    try {
      const response = await api.benefits.cancelPtoRequest(requestId);
      if (response.success) {
        setPtoRequests(
          ptoRequests.filter((request) => request.id !== requestId)
        );
        showNotification({
          message: 'Request has been successfully canceled.',
          severity: 'success',
        });
      }
    } catch (error) {
      showNotification({
        message:
          'We were unable to cancel the request. Please contact your supervisor for help.',
        severity: 'error',
      });
    }
  };

  const isFutureOrToday = (dateStr: string) => {
    const today = startOfToday();
    const date = parseISO(dateStr);
    return isAfter(date, today) || isEqual(date, today);
  };

  const canEmployeeCancel = (request: PtoRequest): boolean => {
    // Helper to check whether an employee can cancel
    // 1) Pending (N) or
    // 2) Approved (A) but end date hasn't passed (date-only)
    if (request.status === 'N') return true;
    if (request.status === 'A' && isFutureOrToday(request.end)) return true;
    return false;
  };

  // Flatten the absences across multiple PTO buckets
  const absences: Absence[] = ptoPlans.reduce(
    (acc: Absence[], curr: PtoPlan) => {
      const currAbsences = curr.absences.map((absence) => ({
        ...absence,
        pto_type: curr.description,
      }));
      return [...acc, ...currAbsences];
    },
    []
  );

  // Filter out any non-approved requests
  const planned: PtoRequest[] = ptoRequests
    .filter((request) => request.status === 'A' || request.status === 'N')
    .reverse()
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  // Convert the planned requests into a list of dates for the calendar
  const plannedDates = planned.reduce((acc: Holiday[], curr: PtoRequest) => {
    const currDates = curr.details.map((detail) => ({
      summary: `${curr.reason} ${curr.comment && '- ' + curr.comment}`,
      start: { date: detail.date },
      end: { date: detail.date },
    }));
    return [...acc, ...currDates];
  }, []);

  const shouldWrap = ptoPlans.length >= 3;

  const activePtoPlans = ptoPlans.filter(
    (plan) => !plan.end_date || new Date(plan.end_date) > new Date()
  );

  if (!activePtoPlans.length) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Time off
        </Typography>
        <Typography variant="body1">
          No time off available.{' '}
          <Link component={RouterLink} to={paths.dashboard}>
            Go back
          </Link>
          .
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>Time Off | Armhr</title>
        <meta
          name="description"
          content="View and manage your time off requests and balances."
        />
      </Helmet>
      <Box sx={{ display: 'flex', mb: 4 }}>
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          Time off
        </Typography>
        {activePtoPlans.length > 0 && (
          <ButtonLink
            variant="contained"
            sx={{ ml: 2 }}
            href={paths.requestTimeOff}
          >
            Request time off
          </ButtonLink>
        )}
      </Box>

      {!!activePtoPlans.length && (
        <Box mb={4}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              flexWrap: isSmallScreen ? 'wrap' : shouldWrap ? 'wrap' : 'nowrap',
              gap: '24px',
            }}
          >
            {activePtoPlans.map((ptoPlan, index) => (
              <Box
                sx={{
                  display: 'flex',
                  flex: shouldWrap ? '1 1 calc(33.3333% - 24px)' : '1 1 280px',
                }}
                key={index}
              >
                <PtoPlanCard
                  index={index}
                  ptoPlan={ptoPlan}
                  ptoCalculations={ptoCalculations}
                />
              </Box>
            ))}

            {shouldWrap ? (
              <Box sx={{ width: '100%', display: 'flex', gap: '24px' }}>
                <Box sx={{ display: 'flex', flex: '1 1 50%' }}>
                  <HolidayCard extraDates={plannedDates} />
                </Box>
                <Box sx={{ display: 'flex', flex: '1 1 50%' }}>
                  <NextHolidayCard holidays={holidays} />
                </Box>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', flex: '1 1 350px' }}>
                  <HolidayCard extraDates={plannedDates} />
                </Box>
                <Box sx={{ display: 'flex', flex: '1 1 450px' }}>
                  <NextHolidayCard holidays={holidays} />
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}

      {!!planned.length && (
        <Box mb={6}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Requests
          </Typography>
          <Table
            columns={[
              'Reason',
              'Start Date',
              'End Date',
              'Hours',
              'Comment',
              'Status',
              '',
            ]}
            rows={planned}
            renderRow={(request: PtoRequest) => {
              const employeeCanCancel = canEmployeeCancel(request);
              return (
                <TableRow key={request.id}>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{formatDate(request.start)}</TableCell>
                  <TableCell>{formatDate(request.end)}</TableCell>
                  <TableCell>
                    {sumBy(request.details, (detail) =>
                      safeParseFloat(detail.hours)
                    )}{' '}
                    hours
                  </TableCell>
                  <TableCell>{request.comment}</TableCell>
                  <TableCell align="left">
                    <Chip
                      label={ptoStatusTypes[request.status]}
                      size="small"
                      style={{
                        borderColor:
                          statusColors[request.status]?.border || grey[700],
                        backgroundColor:
                          statusColors[request.status]?.background || grey[100],
                        borderWidth: 1,
                        borderStyle: 'solid',
                        color: 'black',
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    {employeeCanCancel ? (
                      <Button
                        sx={{ ml: 2 }}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedRequest(request);
                          setDialogOpen(true);
                        }}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <>
                        <Typography variant="caption" sx={{ ml: 2 }}>
                          Contact your supervisor to cancel.
                        </Typography>
                        <Button
                          sx={{ ml: 2 }}
                          size="small"
                          variant="outlined"
                          disabled
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            }}
          />
        </Box>
      )}

      {!!absences.length && (
        <Box mb={6}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            History
          </Typography>

          <DataTable
            rows={absences as GridRowsProp}
            columns={[
              {
                field: 'pto_type',
                headerName: 'PTO type',
                flex: 1,
              },
              {
                field: 'absence_date',
                headerName: 'Date',
                flex: 1,
              },
              {
                field: 'accrued_hours',
                headerName: 'Hours accrued',
                flex: 1,
                type: 'number',
              },
              {
                field: 'hours',
                headerName: 'Hours used',
                flex: 1,
                type: 'number',
              },
              {
                field: 'comment',
                headerName: 'Notes',
                flex: 1,
              },
            ]}
            initialState={{
              sorting: {
                sortModel: [{ field: 'absence_date', sort: 'desc' }],
              },
            }}
            sortingOrder={['desc', 'asc']}
          />
        </Box>
      )}

      <ConfirmationDialog
        open={dialogOpen}
        title="Cancel time off request"
        message={
          <Box>
            Are you sure you want to cancel the request for{' '}
            <strong>{formatDate(selectedRequest?.start)}</strong> -{' '}
            <strong>{formatDate(selectedRequest?.end)}</strong>?
          </Box>
        }
        onClose={() => setDialogOpen(false)}
        onConfirm={() => {
          setDialogOpen(false);
          if (selectedRequest) {
            handleCancelPtoRequest(selectedRequest.id);
          }
        }}
      />
    </>
  );
};

export default TimeOffListPage;
