import { PageSpinner, useNotifications } from '@armhr/ui';
import type { NotificationOptions } from '@armhr/ui/src/types';
import { Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import RequestTimeOffForm from '../../components/time-off/RequestTimeOffForm';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { useRedirectToDashboard } from '../../hooks/useRedirectToDashboard';
import { useUser } from '../../hooks/useUser';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';

const initialValues: RequestTimeOffFormValues = {
  reason: '',
  message: '',
  requests: [],
};

const RequestTimeOffPage: React.FC = () => {
  const api = useApi();
  const { user } = useUser();
  const navigate = useNavigate();
  const [ptoPlans, setPtoPlans] = useState<PtoPlan[]>([]);
  const [ptoCalculations, setPtoCalculations] = useState<
    Record<string, PtoHourInfo>
  >({});
  const { showNotification } = useNotifications();

  const { data: ptoTypes, loading: isPageLoading } = useApiData<PtoClass[]>(
    api.benefits.getPtoTypes
  );

  // if armhr pto is disabled, redirect user to dashboard
  const armhrPtoEnabled = user?.is_armhr_pto_enabled;
  useRedirectToDashboard(!armhrPtoEnabled);

  useEffect(() => {
    api.benefits.getPtoRequestsSummary().then((response) => {
      setPtoPlans(response.results.pto_plans || []);
      setPtoCalculations(response.results.pto_summary || {});
    });
  }, []);

  if (!ptoTypes?.length || isPageLoading) return <PageSpinner />;

  const handleSubmit = async (
    values: RequestTimeOffFormValues,
    helpers: FormikHelpers<RequestTimeOffFormValues>
  ) => {
    helpers.setSubmitting(true);

    const { requests, reason, message } = values;

    try {
      if (!requests.length) {
        throw new Error();
      }

      const response = await api.client.post('/benefits/pto/requests', {
        reason,
        comment: message,
        start: formatDate(requests[0].date, 'ISO'),
        end: formatDate(requests[requests.length - 1].date, 'ISO'),
        details: requests.map(({ hours, date }) => ({
          hours: hours.toString(),
          date: formatDate(date, 'ISO'),
        })),
      });

      if (response.status === 200) {
        const notification: NotificationOptions = {
          message: 'Your request was successfully submitted',
          severity: 'success',
        };
        navigate(paths.timeOff, { state: { notification } });
      } else {
        throw new Error();
      }
    } catch (err: any) {
      showNotification({
        message: err.response?.data?.detail || true,
        severity: 'error',
      });
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Request Time Off | Armhr</title>
        <meta name="description" content="Submit a new time off request." />
      </Helmet>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <RequestTimeOffForm
          ptoPlans={ptoPlans}
          ptoCalculations={ptoCalculations}
        />
      </Formik>
    </>
  );
};

const validationSchema = Yup.object().shape({
  reason: Yup.string().required('Reason is required'),
  requests: Yup.array()
    .min(1, 'Please add at least one request')
    .required('Please add at least one request'),
});

export default RequestTimeOffPage;
