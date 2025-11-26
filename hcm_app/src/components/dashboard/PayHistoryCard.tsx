import { AttachMoney, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { useApiData } from '../../hooks/useApiData';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';

const maskAmount = (amount: number | string) => {
  if (amount === null || amount === undefined) return '$X,XXX.XX';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '$X,XXX.XX';

  return '$X,XXX.XX';
};

const formatAmount = (amount: number | string) => {
  if (amount === null || amount === undefined) return '$0.00';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

// Color scheme for different amount types
const getAmountColor = (
  type: 'net' | 'gross' | 'taxes' | 'deductions',
  isVisible: boolean
) => {
  if (!isVisible) return '#b0b6be';

  switch (type) {
    case 'net':
      return '#059669'; // Green for net pay (positive)
    case 'gross':
      return '#2563eb'; // Blue for gross pay
    case 'taxes':
      return '#dc2626'; // Red for taxes (negative impact)
    case 'deductions':
      return '#ea580c'; // Orange for deductions (negative impact)
    default:
      return '#374151'; // Default gray
  }
};

const PayHistoryCard = ({
  history,
}: {
  history?: MostRecentPayrollVoucher[];
}) => {
  // Section toggles
  const [latestVisible, setLatestVisible] = useState(false);
  const [breakdownVisible, setBreakdownVisible] = useState(false);

  // Fetch upcoming pay date
  const { data: upcomingPayDate } = useApiData<UpcomingPayDate>((api) =>
    api.payroll.getUpcomingPayDate()
  );

  if (!history || history.length === 0) return null;
  const current = history[0];

  // Handle case where most_recent_voucher might be null
  if (!current) return null;

  const isIssueDateInFuture =
    current.issue_date && new Date(current.issue_date) > new Date();

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with actions */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h5">Payroll</Typography>
        <Link
          component={RouterLink}
          to={paths.payroll}
          sx={{
            fontSize: '0.875rem',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          View pay history
        </Link>
      </Box>
      {/* Content */}
      <Box sx={{ flex: 1 }}>
        {isIssueDateInFuture ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              No pay history available
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={0} alignItems="stretch">
              {/* Latest Pay */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  borderRight: {
                    md: upcomingPayDate ? '1px solid #e5e7eb' : 'none',
                  },
                  pr: { md: 2 },
                  mb: { xs: 2, md: 0 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.primary"
                    fontWeight={600}
                  >
                    Latest paycheck
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 0.5,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: '#e0f2fe',
                      color: '#0284c7',
                      width: 40,
                      height: 40,
                    }}
                  >
                    <AttachMoney fontSize="medium" />
                  </Avatar>
                  <Box>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          color: getAmountColor('net', latestVisible),
                          fontSize: '1.1rem',
                          fontStyle: !latestVisible ? 'italic' : undefined,
                        }}
                      >
                        {latestVisible
                          ? formatAmount(current.net_pay)
                          : maskAmount(current.net_pay)}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{
                          color: latestVisible ? '#059669' : '#b0b6be',
                          ml: 1,
                        }}
                        onClick={() => setLatestVisible((v) => !v)}
                      >
                        {latestVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500, mt: 0.25 }}
                    >
                      Pay date {formatDate(current.issue_date)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {/* Upcoming Paycheck */}
              <Grid item xs={12} md={6} sx={{ pl: { md: 2 } }}>
                <Typography
                  variant="h6"
                  color="text.primary"
                  sx={{ mb: 1 }}
                  fontWeight={600}
                >
                  Upcoming paycheck
                </Typography>
                {upcomingPayDate && upcomingPayDate.pay_date ? (
                  <>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          color: '#059669', // green for days away
                          fontSize: '1.1rem',
                        }}
                      >
                        {upcomingPayDate.days_until_pay !== null
                          ? `${upcomingPayDate.days_until_pay} days away`
                          : 'Upcoming'}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500, mt: 0.25 }}
                    >
                      Pay date {formatDate(upcomingPayDate.pay_date)}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: '#94a3b8',
                        fontSize: '1.1rem',
                      }}
                    >
                      --
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500, mt: 0.25 }}
                    >
                      Pay date --
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
            {/* Breakdown */}
            <Divider sx={{ my: 2 }} />
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 0.5,
                  gap: 1,
                }}
              >
                <Typography variant="h6" color="text.primary" fontWeight={600}>
                  Breakdown
                </Typography>
                <IconButton
                  size="small"
                  sx={{ color: breakdownVisible ? '#059669' : '#b0b6be' }}
                  onClick={() => setBreakdownVisible((v) => !v)}
                >
                  {breakdownVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Gross Pay
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: getAmountColor('gross', breakdownVisible),
                        fontStyle: !breakdownVisible ? 'italic' : undefined,
                      }}
                    >
                      {breakdownVisible
                        ? formatAmount(current.earn_amount)
                        : maskAmount(current.earn_amount)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Taxes
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: getAmountColor('taxes', breakdownVisible),
                        fontStyle: !breakdownVisible ? 'italic' : undefined,
                      }}
                    >
                      {breakdownVisible
                        ? formatAmount(current.taxes)
                        : maskAmount(current.taxes)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Deductions
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: getAmountColor('deductions', breakdownVisible),
                        fontStyle: !breakdownVisible ? 'italic' : undefined,
                      }}
                    >
                      {breakdownVisible
                        ? formatAmount(current.taxes)
                        : maskAmount(current.taxes)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </Card>
  );
};

export default PayHistoryCard;
