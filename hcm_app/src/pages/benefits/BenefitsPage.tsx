import { PageSpinner, useNotifications } from '@armhr/ui';
import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';

import AnthemComplianceBanner from '../../components/benefits/AnthemComplianceBanner';
import BenefitSummary from '../../components/benefits/BenefitSummary';
import CignaComplianceBanner from '../../components/benefits/CignaComplianceBanner';
import SpendingAccountSection from '../../components/benefits/SpendingAccountSection';
import { useApiData } from '../../hooks/useApiData';
import {
  getCurrentBenefits,
  getUpcomingBenefits,
  sortBenefits,
} from '../../utils/benefits';

const BenefitsPage: React.FC = () => {
  const {
    data: benefits,
    loading,
    error,
  } = useApiData<InsurancePlan[]>((api) => api.benefits.getBenefits());

  const {
    data: flexBenefits,
    loading: flexLoading,
    error: flexError,
  } = useApiData<SpendingAccountConcise[]>((api) =>
    api.benefits.getSpendingAccounts()
  );

  const { showNotification } = useNotifications();

  useEffect(() => {
    if (!loading && error) {
      showNotification({
        message: 'Failed to load benefits.',
        severity: 'error',
      });
    }
    if (!flexLoading && flexError) {
      showNotification({
        message: 'Failed to load spending accounts.',
        severity: 'error',
      });
    }
  }, [loading, flexLoading, error, flexError, showNotification]);

  // Group flexBenefits by account_type
  const groupedFlexBenefits = useMemo(() => {
    if (!flexBenefits) return {};
    return flexBenefits.reduce(
      (acc: { [key: string]: SpendingAccountConcise[] }, spendAcct) => {
        const account_type = spendAcct.account_type as 'FSA' | 'HSA';
        if (!acc[account_type]) {
          acc[account_type] = [];
        }
        acc[account_type].push(spendAcct);
        return acc;
      },
      {} as { [key: string]: SpendingAccountConcise[] }
    );
  }, [flexBenefits]);

  // Separate current and upcoming benefits
  const { currentBenefits, upcomingBenefits } = useMemo(() => {
    if (!benefits) return { currentBenefits: [], upcomingBenefits: [] };

    return {
      currentBenefits: getCurrentBenefits(benefits),
      upcomingBenefits: getUpcomingBenefits(benefits),
    };
  }, [benefits]);

  // Check if user is enrolled in Cigna medical
  const hasCignaMedical = useMemo(() => {
    if (!currentBenefits) return false;
    return currentBenefits.some(
      (benefit) =>
        benefit?.type?.toLowerCase() === 'medical' &&
        benefit?.name?.toLowerCase().includes('cigna')
    );
  }, [currentBenefits]);

  // Check if user is enrolled in Anthem medical
  const hasAnthemMedical = useMemo(() => {
    if (!currentBenefits) return false;
    return currentBenefits.some(
      (benefit) =>
        benefit?.type?.toLowerCase() === 'medical' &&
        benefit?.name?.toLowerCase().includes('anthem')
    );
  }, [currentBenefits]);

  if (loading || flexLoading) {
    return <PageSpinner />;
  }

  const filterByType = (benefits: InsurancePlan[], type: string) =>
    benefits.filter(
      (benefit) => benefit?.type.toLowerCase() === type.toLowerCase()
    ) || [];

  return (
    <>
      <Helmet>
        <title>Benefits | Armhr</title>
        <meta
          name="description"
          content="View your benefits, insurance plans, and coverage information."
        />
      </Helmet>

      <Box sx={{ display: 'flex', mb: 4 }}>
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          Your current benefits
        </Typography>
      </Box>

      {currentBenefits?.length === 0 && <div>No current benefits found.</div>}

      {hasCignaMedical && <CignaComplianceBanner />}
      {hasAnthemMedical && <AnthemComplianceBanner />}

      <BenefitsSection
        title="Medical benefits"
        benefits={filterByType(currentBenefits, 'medical')}
      />

      <Grid container spacing={4}>
        <Grid xs={12} sm={6} item>
          <BenefitsSection
            title="Dental benefits"
            benefits={filterByType(currentBenefits, 'dental')}
          />
        </Grid>
        <Grid xs={12} sm={6} item>
          <BenefitsSection
            title="Vision benefits"
            benefits={filterByType(currentBenefits, 'vision')}
          />
        </Grid>
      </Grid>

      <BenefitsSection
        title="Ancillary benefits"
        isAncillary={true}
        benefits={
          currentBenefits.filter((benefit) => {
            const lowerType = benefit?.type.toLowerCase();
            return !['medical', 'dental', 'vision'].includes(lowerType);
          }) || []
        }
      />

      {Object.entries(groupedFlexBenefits).map(([accountType, spendAccts]) => {
        const accountTitles: { [key: string]: string } = {
          FSA: 'Flexible Spending Accounts',
          HSA: 'Health Savings Accounts',
        };

        return (
          accountTitles[accountType] && (
            <SpendingAccountSection
              key={accountType}
              title={accountTitles[accountType]}
              accountType={accountType}
              spendAccts={spendAccts}
            />
          )
        );
      })}

      {upcomingBenefits.length > 0 && (
        <>
          <Box sx={{ display: 'flex', mb: 4, mt: 6 }}>
            <Typography variant="h2" sx={{ flexGrow: 1 }}>
              Upcoming benefits
            </Typography>
          </Box>

          <BenefitsSection
            title="Medical benefits"
            benefits={filterByType(upcomingBenefits, 'medical')}
          />

          <Grid container spacing={4}>
            <Grid xs={12} sm={6} item>
              <BenefitsSection
                title="Dental benefits"
                benefits={filterByType(upcomingBenefits, 'dental')}
              />
            </Grid>
            <Grid xs={12} sm={6} item>
              <BenefitsSection
                title="Vision benefits"
                benefits={filterByType(upcomingBenefits, 'vision')}
              />
            </Grid>
          </Grid>

          <BenefitsSection
            title="Ancillary benefits"
            isAncillary={true}
            benefits={
              upcomingBenefits.filter((benefit) => {
                const lowerType = benefit?.type.toLowerCase();
                return !['medical', 'dental', 'vision'].includes(lowerType);
              }) || []
            }
          />
        </>
      )}

      {!benefits?.length && !flexBenefits?.length && (
        <div>No active benefits found.</div>
      )}
    </>
  );
};

const BenefitsSection: React.FC<{
  title: string;
  benefits: InsurancePlan[];
  isAncillary?: boolean;
}> = ({ title, benefits }) => {
  if (benefits.length === 0) return null;
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {sortBenefits(benefits).map((benefit) => (
          <Grid xs={12} item key={benefit.id}>
            <BenefitSummary benefit={benefit} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BenefitsPage;
