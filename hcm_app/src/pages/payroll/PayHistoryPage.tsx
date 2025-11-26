import { PageSpinner } from '@armhr/ui';
import { Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import { PayHistoryTable, PaySummary } from '../../components/payroll';
import { useApi } from '../../hooks/useApi';
import { formatDate } from '../../utils/date';
import { PAYROLL_HISTORY_START_DATE } from '../../utils/payroll';

const PayHistoryPage: React.FC = () => {
  const api = useApi();

  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<PayrollSummary>({} as PayrollSummary);
  const [history, setHistory] = useState<PayrollVoucher[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [historyData, summaryData] = await Promise.all([
          api.payroll.getPayrollVouchers({
            start: PAYROLL_HISTORY_START_DATE,
            end: formatDate(new Date(), 'ISO'),
            start_page: 0,
            count: 1000,
          }),
          api.payroll.getSummary({
            year: new Date().getFullYear().toString(),
          }),
        ]);
        if (isMounted) {
          setHistory(historyData.results);
          setSummary(summaryData.results);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Pay History | Armhr</title>
        <meta
          name="description"
          content="View your payroll history and pay vouchers."
        />
      </Helmet>
      <Typography variant="h2" color="initial" mb={4}>
        Pay history
      </Typography>
      <Stack spacing={8}>
        <PaySummary summary={summary} />
        <PayHistoryTable history={history} />
      </Stack>
    </>
  );
};

export default PayHistoryPage;
