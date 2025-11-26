import { SecureText, formatMoney } from '@armhr/ui';
import { Section } from '@armhr/ui';
import { Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';

import { employmentStatuses, payPeriods } from '../../utils/constants';
import { formatDate } from '../../utils/date';

export const JobTab = () => {
  const { values } = useFormikContext<ProfileFormValues>();

  const payRate = values.compensation?.pay_period_info
    ? values.compensation.pay_period_info.find(
        (pp) => pp.period_code === values.compensation?.pay_period
      )?.period_base ?? 'N/A'
    : 'N/A';

  const payPeriod = payPeriods
    ? payPeriods.find((pp) => pp.value === values.compensation?.pay_period)
        ?.label ?? 'N/A'
    : 'N/A';

  return (
    <Section title="Employment details" vertical={true}>
      <Grid container rowSpacing={2}>
        <Grid item container spacing={2}>
          {values.position?.employee_title && (
            <Grid item xs>
              <Typography variant="caption">Title</Typography>
              <Typography>{values.position?.employee_title}</Typography>
            </Grid>
          )}
          <Grid item xs>
            <Typography variant="caption">Pay rate</Typography>
            <SecureText text={`${formatMoney(payRate)} ${payPeriod}`} />
          </Grid>
          <Grid item xs>
            <Typography variant="caption">Annual salary</Typography>
            <SecureText text={formatMoney(values.compensation?.annual_pay)} />
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item xs>
            <Typography variant="caption">Start date</Typography>
            <Typography>{formatDate(values.first_hire_date)}</Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="caption">Employee ID</Typography>
            <Typography>{values.id}</Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="caption">Employment status</Typography>
            <Typography>
              {
                employmentStatuses.find(
                  (es) => es.value === values.employee_status
                )?.label
              }
            </Typography>
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item xs>
            <Typography variant="caption">Worksite</Typography>
            <Typography>
              {values.worksite?.city}, {values.worksite?.state}
            </Typography>
          </Grid>

          {values.position?.department ? (
            <Grid item xs>
              <Typography variant="caption">Department</Typography>
              <Typography>{values.position?.department}</Typography>
            </Grid>
          ) : (
            <Grid item xs />
          )}
          {/* {values.manager ? (
            <Grid item xs>
              <Typography variant="caption">Manager</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Link
                  component={RouterLink}
                  to={`/profile/${values.manager.id}`}
                >
                  {getDisplayName(values.manager)}
                </Link>
              </Box>
            </Grid>
          ) : (
            <Grid item xs />
          )} */}
          <Grid item xs />
        </Grid>
      </Grid>
    </Section>
  );
};
