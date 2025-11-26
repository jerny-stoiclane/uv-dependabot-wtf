import { DataTable, DateRangePicker, Money } from '@armhr/ui';
import { CalendarToday } from '@mui/icons-material';
import { Box, InputAdornment, Link, Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DateRange } from 'mui-daterange-picker';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { useApi } from '../../hooks/useApi';
import { payrollVoucherTypes } from '../../utils/constants';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';
import { PAYROLL_HISTORY_START_DATE } from '../../utils/payroll';

const PayHistoryTable: React.FC<{ history: PayrollVoucher[] }> = ({
  history,
}) => {
  const api = useApi();

  const [payrollHistory, setPayrollHistory] =
    useState<PayrollVoucher[]>(history);
  const [dateRange, setDateRange] = useState<DateRange>({});

  const getVouchers = async () => {
    const { results: response } = await api.payroll.getPayrollVouchers({
      start: dateRange.startDate
        ? formatDate(dateRange.startDate, 'ISO')
        : PAYROLL_HISTORY_START_DATE,
      end: dateRange.endDate
        ? formatDate(dateRange.endDate, 'ISO')
        : formatDate(new Date(), 'ISO'),
      start_page: 0,
      count: 1000,
    });

    setPayrollHistory(response);
  };

  const columns: GridColDef[] = [
    {
      field: 'issue_date',
      headerName: 'Pay date',
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      valueFormatter: ({ value }) => {
        const voucherType = payrollVoucherTypes.find(
          (payrollValue) => payrollValue === value
        );
        return voucherType ? voucherType.label : '';
      },
    },
    {
      field: 'check_number',
      headerName: 'Check number',
      flex: 1,
    },
    {
      field: 'gross_wages',
      headerName: 'Gross pay',
      flex: 1,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => <Money value={params.value} />,
    },
    {
      field: 'net_wages',
      headerName: 'Net pay',
      flex: 1,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => <Money value={params.value} />,
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params: GridRenderCellParams<PayrollVoucher>) => (
        <Link component={RouterLink} to={`${paths.payroll}/${params.row.id}`}>
          View
        </Link>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          color="initial"
          sx={{ width: { xs: '100%', sm: 'auto' }, mb: { xs: 2, sm: 0 } }}
        >
          Your paystubs
        </Typography>

        <DateRangePicker
          sx={{ ml: { sm: 'auto' }, maxWidth: 350 }}
          inputProps={{
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarToday />
                </InputAdornment>
              ),
            },
          }}
          onChange={(range) => setDateRange(range)}
          onClose={getVouchers}
        />
      </Box>

      <DataTable
        rows={payrollHistory.map((item) => ({
          ...item.summary,
          id: item.id,
          type: item.type,
        }))}
        columns={columns}
      />
    </Box>
  );
};

export default PayHistoryTable;
