import { Money } from '@armhr/ui';
import { PictureAsPdf } from '@mui/icons-material';
import {
  Box,
  Card,
  Chip,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';

import {
  getBenefitsProviderLogo,
  getTypeInfo,
  humanize,
} from '../../utils/benefits';
import { formatDate } from '../../utils/date';

const BenefitSummary: React.FC<{ benefit: InsurancePlan }> = ({ benefit }) => {
  if (!benefit) return null;

  const data = [
    {
      value: formatDate(benefit.coverage_start) || 'N/A',
      label: 'Coverage start',
    },
    {
      value: benefit?.plan_type || <>&nbsp;</>,
      label: benefit?.plan_type ? 'Plan type' : '',
    },
    {
      value: (
        <Typography variant={'h4'}>
          {benefit?.employee_contribution ? (
            <Money value={benefit?.employee_contribution} />
          ) : (
            '$0.00'
          )}
        </Typography>
      ),
      label: 'Employee contribution',
      textAlign: 'right',
    },
  ];

  const typeInfo = getTypeInfo(benefit?.type, benefit?.offer_type_code);
  const providerLogo = getBenefitsProviderLogo(benefit?.name);

  // Extract provider name from benefit name (assuming format like "Provider Name Plan Name")
  const providerName = benefit.name.split(' ')[0];

  return (
    <Card>
      <Grid
        container
        direction="row"
        alignItems="center"
        gap={3}
        sx={{ borderBottom: '1px solid #e0e0e0', px: 2, py: 1 }}
      >
        <Grid xs item sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {providerLogo !== '' ? (
            <img
              src={providerLogo}
              alt={benefit?.name}
              width={80}
              style={{ marginRight: 16 }}
            />
          ) : (
            <Box />
          )}
          <Typography
            variant="h5"
            component="div"
            display="flex"
            alignItems="center"
          >
            {humanize(benefit?.name)}
          </Typography>

          {benefit.plan_desc_url && (
            <Tooltip title="Download Plan PDF">
              <IconButton
                size="small"
                component="a"
                color="primary"
                href={decodeURIComponent(benefit.plan_desc_url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PictureAsPdf fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Grid>
        <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {benefit.carrier_url && (
            <Link
              href={benefit.carrier_url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Login to {providerName}
            </Link>
          )}
          <Chip label="Active" size="small" variant="outlined" />

          {typeInfo && (
            <Chip
              label={typeInfo?.label}
              size="small"
              sx={{
                color: 'white',
                backgroundColor: typeInfo?.color,
              }}
            />
          )}
        </Grid>
      </Grid>
      <Grid container alignItems="stretch" sx={{ px: 2, py: 1 }}>
        {data.map(({ value, label, textAlign }, index) => (
          <Grid
            item
            xs
            key={index}
            display="flex"
            flexDirection="column"
            sx={{ textAlign: textAlign || 'left' }}
          >
            <Typography variant="subtitle2">{label}</Typography>
            <Box>{value}</Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default BenefitSummary;
