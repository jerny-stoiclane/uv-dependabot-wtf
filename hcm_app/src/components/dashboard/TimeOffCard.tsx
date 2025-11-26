import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import {
  Box,
  Button,
  Card,
  Chip,
  Link,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { paths } from '../../utils/paths';

// Helper to format days
const formatDays = (days: number) => `${days} day${days !== 1 ? 's' : ''}`;

const statusColors = {
  Approved: '#C6F6D5', // green.100
  Paid: '#DBEAFE', // blue.100
  Pending: '#FEF3C7', // yellow.100
};
const statusTextColors = {
  Approved: '#219653', // green.700
  Paid: '#1D4ED8', // blue.700
  Pending: '#B7791F', // yellow.700
};
// Removed unused datePillColors array

interface TimeOffCardV2Props {
  ptoSummary?: PtoSummary[];
  ptoRequests?: PtoRequest[];
}

const TimeOffCardV2 = ({
  ptoSummary = [],
  ptoRequests = [],
}: TimeOffCardV2Props) => {
  const theme = useTheme();

  // Comprehensive icon mapping system
  const getPlanIconAndColors = (planId: string) => {
    const planIdLower = planId.toLowerCase();

    // Vacation-related plans
    if (planIdLower.includes('vacation') || planIdLower.includes('vac')) {
      return {
        key: 'Vacation',
        icon: <BeachAccessIcon sx={{ color: '#2563EB', fontSize: 22 }} />,
        label: planId || 'Vacation',
        barColors: ['#2563EB', '#60A5FA', '#D1D5DB'],
      };
    }

    // Sick leave plans
    if (planIdLower.includes('sick') || planIdLower.includes('illness')) {
      return {
        key: 'Sick',
        icon: <LocalHospitalIcon sx={{ color: '#27AE60', fontSize: 22 }} />,
        label: planId || 'Sick Leave',
        barColors: ['#27AE60', '#6EE7B7', '#D1D5DB'],
      };
    }

    // Personal time plans
    if (planIdLower.includes('personal')) {
      return {
        key: 'Personal',
        icon: <PersonIcon sx={{ color: '#8B5CF6', fontSize: 22 }} />,
        label: planId || 'Personal',
        barColors: ['#8B5CF6', '#C4B5FD', '#D1D5DB'],
      };
    }

    // Floating holidays
    if (planIdLower.includes('floating') || planIdLower.includes('float')) {
      return {
        key: 'Floating',
        icon: <WbSunnyIcon sx={{ color: '#B7791F', fontSize: 22 }} />,
        label: planId || 'Floating',
        barColors: ['#B7791F', '#FDE68A', '#D1D5DB'],
      };
    }

    // Parental leave plans
    if (
      planIdLower.includes('parental') ||
      planIdLower.includes('maternity') ||
      planIdLower.includes('paternity') ||
      planIdLower.includes('family')
    ) {
      return {
        key: 'Parental',
        icon: <ChildFriendlyIcon sx={{ color: '#6366F1', fontSize: 22 }} />,
        label: planId || 'Parental Leave',
        barColors: ['#6366F1', '#A5B4FC', '#D1D5DB'],
      };
    }

    // Bereavement leave
    if (
      planIdLower.includes('bereavement') ||
      planIdLower.includes('bereave')
    ) {
      return {
        key: 'Bereavement',
        icon: <PersonIcon sx={{ color: '#DC2626', fontSize: 22 }} />,
        label: planId || 'Bereavement',
        barColors: ['#DC2626', '#FCA5A5', '#D1D5DB'],
      };
    }

    // Jury duty
    if (planIdLower.includes('jury') || planIdLower.includes('court')) {
      return {
        key: 'Jury Duty',
        icon: <PersonIcon sx={{ color: '#7C3AED', fontSize: 22 }} />,
        label: planId || 'Jury Duty',
        barColors: ['#7C3AED', '#C4B5FD', '#D1D5DB'],
      };
    }

    // Military leave
    if (planIdLower.includes('military') || planIdLower.includes('uniformed')) {
      return {
        key: 'Military',
        icon: <PersonIcon sx={{ color: '#059669', fontSize: 22 }} />,
        label: planId || 'Military Leave',
        barColors: ['#059669', '#6EE7B7', '#D1D5DB'],
      };
    }

    // Comp time
    if (planIdLower.includes('comp') || planIdLower.includes('overtime')) {
      return {
        key: 'Comp Time',
        icon: <WbSunnyIcon sx={{ color: '#EA580C', fontSize: 22 }} />,
        label: planId || 'Comp Time',
        barColors: ['#EA580C', '#FED7AA', '#D1D5DB'],
      };
    }

    // Remote work plans
    if (
      planIdLower.includes('remote') ||
      planIdLower.includes('wfh') ||
      planIdLower.includes('telework') ||
      planIdLower.includes('home')
    ) {
      return {
        key: 'Remote',
        icon: <HomeWorkIcon sx={{ color: '#0EA5E9', fontSize: 22 }} />, // blue
        label: planId || 'Remote',
        barColors: ['#0EA5E9', '#7DD3FC', '#D1D5DB'],
      };
    }

    // Default fallback
    return {
      key: planId,
      icon: <PersonIcon sx={{ color: '#6B7280', fontSize: 22 }} />,
      label: planId,
      barColors: ['#6B7280', '#9CA3AF', '#D1D5DB'],
    };
  };

  // Transform PtoSummary data to work with the UI
  const transformPtoSummaryToPlans = (summary: PtoSummary[]) => {
    return summary.map((item) => {
      const planned = parseFloat(item.planned_hours || '0');
      const taken = parseFloat(item.taken_hours || '0');
      const available = parseFloat(item.available_hours || '0');
      const total = planned + taken + available;

      const planInfo = getPlanIconAndColors(item.plan_id);

      return {
        ...planInfo,
        available,
        used: taken,
        planned,
        total,
        isUnlimited: item.calculation_basis === 'UL',
        description: item.description,
        label: item.description || planInfo.label, // Use description as label, fallback to planInfo.label
      };
    });
  };

  // Transform PtoRequest data for upcoming time off
  const transformPtoRequests = (requests: PtoRequest[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    return requests
      .filter(
        (req) => req.status === 'A' || req.status === 'P' || req.status === 'N'
      ) // Approved or Pending
      .filter((req) => {
        // Show all approved requests regardless of date
        if (req.status === 'A') {
          return true;
        }
        // For pending/other status, only show if they end today or in the future
        // Parse ISO date string to avoid timezone issues
        const endDate = parseISO(req.end);
        return endDate >= today;
      })
      .map((req) => {
        // Use the actual number of leave dates from the API (excludes weekends/non-working days)
        const days = req.details?.length || req.leave_dates?.length || 0;

        return {
          id: parseInt(req.id),
          start: req.start,
          end: req.end,
          title: req.reason || `${req.leave_type} Time Off`,
          days,
          type: req.leave_type,
          status:
            req.status === 'A'
              ? 'Approved'
              : req.status === 'P'
              ? 'Paid'
              : ('Pending' as 'Approved' | 'Paid' | 'Pending'), // 'N' maps to 'Pending'
        };
      })
      .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime())
      .slice(0, 8); // Limit to 8 upcoming requests
  };

  const plans = transformPtoSummaryToPlans(ptoSummary);
  const upcomingRequests = transformPtoRequests(ptoRequests);

  // Add state for show/hide PTO requests
  const [showAllPtoRequests, setShowAllPtoRequests] = React.useState(false);

  // Add a mapping from type to color for upcoming time off pills
  const planTypePillColors: Record<string, { bg: string; color: string }> = {
    Vacation: { bg: '#E3EDFF', color: '#2563EB' },
    Sick: { bg: '#D1FAE5', color: '#27AE60' },
    Personal: { bg: '#F3E8FF', color: '#8B5CF6' },
    Floating: { bg: '#FEF3C7', color: '#B7791F' },
    Parental: { bg: '#C7D2FE', color: '#4338CA' },
    Bereavement: { bg: '#FEE2E2', color: '#DC2626' },
    'Jury Duty': { bg: '#F3E8FF', color: '#7C3AED' },
    Military: { bg: '#D1FAE5', color: '#059669' },
    'Comp Time': { bg: '#FED7AA', color: '#EA580C' },
    Remote: { bg: '#E3EDFF', color: '#0EA5E9' },
  };

  // Find all unlimited plans
  const unlimitedPlans = plans.filter(
    (plan, idx) => ptoSummary[idx]?.calculation_basis === 'UL'
  );

  // Don't render if no PTO data
  if (!plans.length) {
    return null;
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h5">Time off</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Link
            component={RouterLink}
            to={paths.timeOff}
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              fontSize: '0.875rem',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            View time off
          </Link>
          <Button
            variant="contained"
            size="small"
            component={RouterLink}
            to={paths.requestTimeOff}
          >
            Request time off
          </Button>
        </Box>
      </Box>
      {/* Available Balance */}
      <Box sx={{ mb: 2, flex: 1 }}>
        {/* Professional Available Balances Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 1,
          }}
        >
          {plans
            .filter((plan, idx) => ptoSummary[idx]?.calculation_basis !== 'UL')
            .map((plan, idx) => {
              return (
                <Box
                  key={`${plan.key}-${idx}`}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    background: '#fafbfc',
                    border: '1px solid #f3f4f6',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    alignItems: 'stretch',
                    minHeight: 120,
                    maxWidth: 320,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    {plan.icon}
                    <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                      {plan.label}
                    </Typography>
                  </Box>
                  {/* Table-style grid for Used/Planned/Available */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: 0,
                      marginBottom: 4,
                      marginTop: 2,
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ color: '#888', fontSize: 12 }}>Used</span>
                    <span style={{ color: '#888', fontSize: 12 }}>Planned</span>
                    <span style={{ color: '#888', fontSize: 12 }}>
                      Available
                    </span>
                    <span
                      style={{
                        fontFamily: 'Roboto Mono, monospace',
                        fontWeight: 700,
                        fontSize: 15,
                        color: '#222',
                      }}
                    >{`
                      ${
                        plan.used % 1 === 0 ? plan.used : plan.used.toFixed(1)
                      }h`}</span>
                    <span
                      style={{
                        fontFamily: 'Roboto Mono, monospace',
                        fontWeight: 700,
                        fontSize: 15,
                        color: '#222',
                      }}
                    >{`
                      ${
                        plan.planned % 1 === 0
                          ? plan.planned
                          : plan.planned.toFixed(1)
                      }h`}</span>
                    <span
                      style={{
                        fontFamily: 'Roboto Mono, monospace',
                        fontWeight: 900,
                        fontSize: 15,
                        color: plan.isUnlimited ? '#10B981' : plan.barColors[0],
                      }}
                    >
                      {plan.isUnlimited
                        ? 'Unlimited'
                        : `${
                            plan.available % 1 === 0
                              ? plan.available
                              : plan.available.toFixed(1)
                          }h`}
                    </span>
                  </div>
                  {/* Stacked progress bar with tooltips */}
                  {!plan.isUnlimited && (
                    <div
                      style={{
                        width: '100%',
                        height: 10,
                        borderRadius: 5,
                        background: '#E5E7EB',
                        display: 'flex',
                        overflow: 'hidden',
                        marginTop: 2,
                        marginBottom: 0,
                        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)',
                      }}
                    >
                      <Tooltip
                        title={`${
                          plan.used % 1 === 0 ? plan.used : plan.used.toFixed(1)
                        }h used`}
                      >
                        <div
                          style={{
                            width: `${(plan.used / plan.total) * 100}%`,
                            background: plan.barColors[0],
                            height: '100%',
                            borderRadius: plan.used ? '5px 0 0 5px' : '5px',
                            transition: 'width 0.3s',
                          }}
                        />
                      </Tooltip>
                      <Tooltip
                        title={`${
                          plan.planned % 1 === 0
                            ? plan.planned
                            : plan.planned.toFixed(1)
                        }h planned`}
                      >
                        <div
                          style={{
                            width: `${(plan.planned / plan.total) * 100}%`,
                            background: plan.barColors[1],
                            height: '100%',
                            transition: 'width 0.3s',
                          }}
                        />
                      </Tooltip>
                      <div
                        style={{
                          width: `${(plan.available / plan.total) * 100}%`,
                          background: plan.barColors[2],
                          height: '100%',
                          borderRadius: plan.available ? '0 5px 5px 0' : '5px',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                  )}
                </Box>
              );
            })}
        </Box>
        {/* Unlimited Plans Row(s) */}
        {unlimitedPlans.map((plan, idx) => (
          <Box
            key={`${plan.key}-${idx}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: '#fafbfc',
              border: '1px solid #f3f4f6',
              borderRadius: 1,
              p: 1.5,
              mt: 1,
              gap: 1,
              minHeight: 48,
              width: '100%',
            }}
          >
            {plan.icon}
            <Typography sx={{ fontWeight: 500, flex: 1, fontSize: 15 }}>
              {plan.label}
            </Typography>
            <Chip
              label="Unlimited"
              size="small"
              variant="outlined"
              color="primary"
              sx={{
                fontSize: 10,
                py: 0.5,
                px: 0,
                height: 20,
              }}
            />
          </Box>
        ))}
      </Box>
      {/* Upcoming Time Off */}
      {upcomingRequests.length > 0 && (
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography variant="h5">Time off history</Typography>
            {upcomingRequests.length > 4 && (
              <Button
                size="small"
                variant="text"
                sx={{
                  color: theme.palette.primary.main,
                  textTransform: 'none',
                  fontSize: 13,
                  px: 1,
                }}
                onClick={() => setShowAllPtoRequests((prev) => !prev)}
              >
                {showAllPtoRequests
                  ? 'Show less'
                  : `Show all (${upcomingRequests.length})`}
              </Button>
            )}
          </Box>
          {/* 2x2 grid of upcoming time off */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {(showAllPtoRequests
              ? upcomingRequests
              : upcomingRequests.slice(0, 4)
            ).map((req, idx) => {
              // Parse dates using date-fns to avoid timezone issues
              const startDate = parseISO(req.start);
              const endDate = parseISO(req.end);
              const month = format(startDate, 'MMM');
              const startDay = format(startDate, 'd');
              const endDay = format(endDate, 'd');
              const color = planTypePillColors[req.type] || {
                bg: '#E3EDFF',
                color: '#2563EB',
              };
              return (
                <Box
                  key={`${req.id}-${idx}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minHeight: 40,
                  }}
                >
                  {/* Date pill */}
                  <Box
                    sx={{
                      background: color.bg,
                      color: color.color,
                      borderRadius: 2,
                      width: 44,
                      px: 0,
                      py: 0.5,
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: 13,
                      mr: 1.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div>{month}</div>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>
                      <span>{startDay}</span>
                      {endDay !== startDay ? <span>-{endDay}</span> : null}
                    </div>
                  </Box>
                  {/* Event info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: '#222',
                        lineHeight: 1.2,
                        mb: 0.1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {req.title}
                    </Typography>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Typography
                        sx={{ color: '#888', fontSize: 11, fontWeight: 500 }}
                      >
                        {formatDays(req.days)} • {req.type}
                      </Typography>
                      <Box
                        sx={{
                          background: statusColors[req.status],
                          color: statusTextColors[req.status],
                          borderRadius: 1,
                          px: 0.5,
                          py: 0,
                          fontWeight: 700,
                          fontSize: 10,
                          height: 16,
                          display: 'flex',
                          alignItems: 'center',
                          textAlign: 'center',
                          ml: 0.5,
                        }}
                      >
                        {req.status}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default TimeOffCardV2;
