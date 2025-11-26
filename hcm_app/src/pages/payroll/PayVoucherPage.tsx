import {
  ButtonLink,
  DataTable,
  Money,
  PageSpinner,
  useNotifications,
} from '@armhr/ui';
import { LoadingButton } from '@mui/lab';
import { Box, Divider, Link, Stack, Tooltip, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';

import LineItemCard from '../../components/payroll/LineItemCard';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { payrollVoucherTypes } from '../../utils/constants';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';

const PayVoucherPage: React.FC = () => {
  const navigate = useNavigate();
  const { voucherId } = useParams();
  const api = useApi();
  const { showNotification } = useNotifications();

  const { data: voucher, loading } = useApiData<PayrollVoucher>((api) =>
    api.payroll.getPayrollVoucherById(voucherId!)
  );

  const { data: codes, loading: codesLoading } = useApiData<CompanyCode>(
    (api) => api.company.getCodes()
  );

  const [pdfLoading, setPdfLoading] = React.useState(false);

  const [tooltipData, setTooltipData] = React.useState({
    open: false,
    text: '',
    bgColor: '',
    color: '',
  });

  if (loading || codesLoading) {
    return <PageSpinner />;
  }

  if (!voucher || !codes) {
    navigate(paths.payroll, { state: { persistNotification: true } });
    showNotification({
      message:
        'There was an issue loading the requested voucher. Please try again.',
      severity: 'error',
    });
    return null;
  }

  const voucherDate = voucher?.summary.issue_date
    ? formatDate(voucher.summary.issue_date)
    : 'Voucher';

  const handlePrism = async () => {
    const resp = await api.profiles.getPrismRedirect();
    if (resp) {
      window.open(resp.results, '_blank');
    } else {
      showNotification({
        message:
          'There was an error opening the Back office portal. Please try the link in the sidebar navigation.',
        severity: 'error',
      });
    }
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    setTooltipData({
      open: false,
      text: '',
      bgColor: '',
      color: '',
    });

    const generatingTimer = setTimeout(() => {
      setTooltipData({
        open: true,
        text: 'Still generating...',
        bgColor: '#f0f0f0',
        color: '#aaa',
      });
    }, 4000);

    try {
      const response = await api.payroll.getPayrollVoucherPDF(voucherId!);
      const link = document.createElement('a');
      link.href = response.results;
      link.click();

      clearTimeout(generatingTimer);

      setTooltipData({
        open: true,
        text: 'Success!',
        bgColor: 'green',
        color: '#fff',
      });

      setTimeout(() => {
        setTooltipData((prev) => ({ ...prev, open: false }));
      }, 2000);
    } catch (error) {
      setTooltipData({
        open: false,
        text: '',
        bgColor: '',
        color: '',
      });

      showNotification({
        message: (
          <>
            Failed to download the PDF of voucher. You can also use the{' '}
            <Link sx={{ cursor: 'pointer' }} onClick={handlePrism}>
              Back office portal
            </Link>{' '}
            to download the PDF.
          </>
        ),
        severity: 'error',
      });
    } finally {
      clearTimeout(generatingTimer);
      setPdfLoading(false);
    }
  };

  const checkType = payrollVoucherTypes.find(
    ({ value }) => value === voucher.type
  )?.label;

  const earningColumns: GridColDef<PayrollEarning>[] = [
    {
      field: 'description',
      headerName: 'Description',
      valueGetter: ({ row }) =>
        codes.pay_codes?.find(({ id }) => id === row.pay_code)?.value || '',
      flex: 1,
    },
    {
      field: 'hours_worked',
      headerName: 'Hours',
      flex: 1,
    },
    {
      field: 'rate',
      headerName: 'Rate',
      flex: 1,
      renderCell: ({ row }) => <Money value={row.unit_rate} />,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      renderCell: ({ row }) => <Money value={row.pay_amount} />,
      flex: 1,
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
    },
    {
      field: 'location',
      headerName: 'Location',
      valueGetter: ({ row }) =>
        codes.location_codes?.find(({ id }) => id === row.location)?.value ||
        '',
      flex: 1,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Paystub - {voucherDate} | Armhr</title>
        <meta
          name="description"
          content="View your pay voucher details and earnings."
        />
      </Helmet>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} mb={1}>
        <Typography variant="h2" sx={{ mb: { xs: 2, sm: 0 } }}>
          Paystub details
        </Typography>
        <Stack direction="row" spacing={2} sx={{ ml: { sm: 'auto' } }}>
          <ButtonLink
            color="secondary"
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            Back
          </ButtonLink>

          {/* Tooltip around Download PDF button */}
          <Tooltip
            open={tooltipData.open}
            title={tooltipData.text}
            disableHoverListener
            disableFocusListener
            disableTouchListener
            PopperProps={{
              sx: {
                '& .MuiTooltip-tooltip': {
                  backgroundColor: tooltipData.bgColor,
                  color: tooltipData.color,
                },
              },
            }}
          >
            <LoadingButton
              variant="contained"
              loading={pdfLoading}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </LoadingButton>
          </Tooltip>
        </Stack>
      </Box>

      <Typography variant="body1">
        <Typography component="span" sx={{ pr: 2 }}>
          {checkType} payroll check:
        </Typography>
        #{voucher.summary.check_number}
      </Typography>
      <Typography variant="body1">
        <Typography component="span" sx={{ pr: 2 }}>
          Pay period:
        </Typography>
        {voucher.pay_period_start && voucher.pay_period_end && (
          <span>
            {`${formatDate(voucher.pay_period_start)} - ${formatDate(
              voucher.pay_period_end
            )}`}
          </span>
        )}
      </Typography>
      <Typography variant="body1" mb={6}>
        <Typography component="span" sx={{ pr: 2 }}>
          Issue date:
        </Typography>
        {formatDate(voucher.summary.issue_date)}
      </Typography>

      <LineItemCard
        title="Payment summary"
        summaryAmount={voucher.summary.net_wages}
        lineItems={[
          { label: 'Gross wages', value: voucher.summary.gross_wages },
          { label: 'Tax withholdings', value: voucher.summary.taxes * -1 },
          { label: 'Deductions', value: voucher.summary.deductions * -1 },
          { label: 'Net wages', value: voucher.summary.net_wages },
        ]}
      />

      {!!voucher.taxes.length && (
        <>
          <Divider sx={{ py: 3 }} />
          <LineItemCard
            title="Tax withholdings"
            summaryAmount={voucher.summary.taxes}
            lineItems={voucher.taxes.map((tax) => ({
              label: tax.description,
              value: tax.amount_withheld,
            }))}
          />
        </>
      )}

      {!!voucher.pretax_deductions.length && (
        <>
          <Divider sx={{ py: 3 }} />
          <LineItemCard
            title="Deductions"
            summaryAmount={voucher.summary.deductions}
            lineItems={voucher.pretax_deductions.map((deduction) => ({
              label: deduction.description,
              value: deduction.amount_deducted,
            }))}
          />
        </>
      )}

      {!!voucher.other_deductions.length && (
        <>
          <Divider sx={{ py: 3 }} />
          <LineItemCard
            title="Other deductions"
            summaryAmount={voucher.summary.other_deductions}
            lineItems={voucher.other_deductions.map((deduction) => ({
              label:
                deduction.other_deduct_description ||
                deduction.other_deduct_code,
              value: deduction.other_deduct_amount,
            }))}
          />
        </>
      )}

      <Typography variant="h3" sx={{ mt: 6 }}>
        Earnings
      </Typography>
      <Box sx={{ py: 3 }}>
        <DataTable
          loading={loading}
          rows={
            voucher.earning?.map((row, index) => ({ id: index, ...row })) || []
          }
          columns={earningColumns}
        />
      </Box>
    </>
  );
};

export default PayVoucherPage;
