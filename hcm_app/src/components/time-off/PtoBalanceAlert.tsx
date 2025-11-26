import { Alert, Collapse, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { sumBy } from 'lodash';

type PtoBalanceAlertProps = {
  ptoPlans: PtoPlan[];
  ptoCalculations: Record<string, PtoHourInfo>;
};

export const PtoBalanceAlert: React.FC<PtoBalanceAlertProps> = ({
  ptoPlans,
  ptoCalculations,
}) => {
  const { values } = useFormikContext<RequestTimeOffFormValues>();

  const getAvailableHours = (reason: string) => {
    const ptoPlan = ptoPlans.find((ptoPlan) => ptoPlan.type === reason);
    if (!ptoPlan) return 0;

    if (ptoPlan.calculation_basis === 'UL') {
      return 'Unlimited';
    }

    // Find the corresponding calculation for this plan by PTO ID
    const calculation = ptoCalculations[ptoPlan.id];

    return calculation ? calculation.available_hours : 0;
  };

  const totalRequestedHours = () =>
    sumBy(values.requests, (detail) => parseFloat(detail.hours));

  const getAlertSeverity = () => {
    const availableHours = getAvailableHours(values.reason);
    if (availableHours === 'Unlimited') return 'info';
    return totalRequestedHours() > availableHours ? 'error' : 'info';
  };

  return (
    <Collapse in={values.reason !== '' || !!values.requests.length}>
      <Alert
        severity={getAlertSeverity()}
        color={getAlertSeverity() === 'error' ? 'error' : 'info'}
        sx={{ my: 2, py: 2 }}
      >
        <Typography variant="body1" fontWeight="700" mb={1}>
          PTO balance
        </Typography>
        <Collapse in={values.reason !== ''}>
          <Typography variant="body1">
            You have <strong>{getAvailableHours(values.reason)}</strong> hours
            of PTO available.
          </Typography>
        </Collapse>
        <Collapse in={!!values.requests.length}>
          <Typography variant="body1">
            You are requesting{' '}
            <strong>
              {sumBy(values.requests, (detail) => parseFloat(detail.hours))}
            </strong>{' '}
            hours of PTO.
          </Typography>
        </Collapse>
      </Alert>
    </Collapse>
  );
};

export default PtoBalanceAlert;
