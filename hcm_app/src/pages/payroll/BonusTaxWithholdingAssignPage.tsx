import { PageSpinner } from '@armhr/ui';
import { useNotifications } from '@armhr/ui/src/hooks/useNotifications';
import { Box } from '@mui/material';
import { Formik, FormikHelpers } from 'formik';
import React from 'react';

import BonusTaxWithholdingRequestAssignForm from '../../components/payroll/BonusTaxWithholdingRequestAssignForm';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';

const BonusTaxWithholdingAssignPage: React.FC = () => {
  const api = useApi();
  const { showNotification } = useNotifications();

  const { data: activeEmployees, loading: empsLoading } = useApiData<
    PublicEmployeeProfile[]
  >((api) => api.company.getEmployees());

  const {
    data: forms,
    loading: formsLoading,
    refresh,
  } = useApiData<BonusTaxWithholdingRequest[]>((api) =>
    api.admin.getEmployeeBonusTaxWithholdings()
  );

  const assignedForms = forms?.filter((form) => form.status === 'assigned');
  const unassignedEmployees =
    activeEmployees?.filter(
      (employee) =>
        !assignedForms?.some((form) => form.employee_id === employee.id)
    ) ?? [];

  const handleSubmit = async (
    values: BonusTaxWithholdingAssignRequest,
    {
      setSubmitting,
      setFieldValue,
    }: FormikHelpers<BonusTaxWithholdingAssignRequest>
  ) => {
    try {
      setSubmitting(true);
      await api.admin.assignBonusTaxWithholdings(values);
      showNotification({
        message:
          'Successfully assigned new bonus additional tax withholding requests.',
        severity: 'success',
      });

      setFieldValue('employee_ids', []);
    } catch (err: any) {
      showNotification({
        message:
          'Failed to assign new bonus additional tax withholding requests.',
        severity: 'error',
      });
      console.error(err);
    } finally {
      setSubmitting(false);
      refresh();
    }
  };

  if (empsLoading || formsLoading) {
    return <PageSpinner />;
  }

  return (
    <Box>
      <Formik
        initialValues={{ employee_ids: [] } as BonusTaxWithholdingAssignRequest}
        onSubmit={handleSubmit}
      >
        <BonusTaxWithholdingRequestAssignForm
          activeEmployees={unassignedEmployees || []}
        />
      </Formik>
    </Box>
  );
};

export default BonusTaxWithholdingAssignPage;
