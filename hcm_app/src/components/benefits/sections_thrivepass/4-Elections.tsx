import { MoneyField, PageSpinner, Section } from '@armhr/ui';
import { Info } from '@mui/icons-material';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { useState } from 'react';

import { useApiData } from '../../../hooks/useApiData';
import SpendingAccountSummary from '../SpendingAccountSummary';

const ThrivePassElections: React.FC<{}> = () => {
  const { data: flexBenefits, loading: flexLoading } = useApiData<
    SpendingAccountConcise[]
  >((api) => api.benefits.getSpendingAccounts());

  const [benefitsOpen, setBenefitsOpen] = useState<boolean>(false);
  const { errors, values } =
    useFormikContext<ThrivePassCommuterEnrollmentForm>();

  if (flexLoading) {
    return <PageSpinner />;
  }

  return (
    <Section title="Elections" vertical>
      <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => setBenefitsOpen(!benefitsOpen)}
        >
          View commuter elections
        </Button>
        <Tooltip
          title={
            <Typography variant="body1">
              The elected commuter benefit amount is made on a monthly basis.
              The deduction amount shown reflects your year-to-date total.
            </Typography>
          }
          placement="right"
          arrow
          sx={{ ml: 1 }}
        >
          <IconButton size="small">
            <Info fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      {benefitsOpen && <FsaCommuterBenefitsView benefits={flexBenefits} />}
      <Grid container item spacing={3} xs={12}>
        <Grid item xs={12} sm={12}>
          <Typography fontWeight={'bold'}>
            Please specify your election amounts below. The maximum amount
            allowed for each option is{' '}
            <span style={{ textDecoration: 'underline' }}>$325.00</span>.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name="parking_fsa_election"
            label="Parking FSA election"
            fullWidth
            disabled={values.form_action === 'terminate'}
            as={MoneyField}
            error={!!errors.parking_fsa_election}
            helperText={<ErrorMessage name="parking_fsa_election" />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name="transit_fsa_election"
            label="Transit FSA election"
            fullWidth
            disabled={values.form_action === 'terminate'}
            as={MoneyField}
            error={!!errors.transit_fsa_election}
            helperText={<ErrorMessage name="transit_fsa_election" />}
          />
        </Grid>
      </Grid>
    </Section>
  );
};

const FsaCommuterBenefitsView: React.FC<{
  benefits: SpendingAccountConcise[] | null;
}> = ({ benefits }) => {
  if (!benefits) return null;
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={4}>
        {benefits!.map((benefitYear: SpendingAccountConcise) => {
          const commuterOnly = benefitYear.benefit_accounts?.filter(
            (account) =>
              ['TRANSIT', 'PARK'].includes(account.account_id) &&
              benefitYear.year === new Date().getFullYear().toString()
          );
          return commuterOnly?.map((account) => {
            return (
              <Grid xs={12} sm={6} key={account.account_id} item>
                <SpendingAccountSummary
                  benefit={account}
                  year={benefitYear.year}
                />
              </Grid>
            );
          });
        })}
      </Grid>
    </Box>
  );
};

export default ThrivePassElections;
