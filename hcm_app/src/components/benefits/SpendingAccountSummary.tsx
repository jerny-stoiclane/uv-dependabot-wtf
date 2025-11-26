import { Money } from '@armhr/ui';
import { Box, Card, Chip, Grid, Typography } from '@mui/material';
import React from 'react';

const SpendingAccountSummary: React.FC<{
  benefit: SpendingAccountBenefit;
  year: string;
}> = ({ benefit, year }) => {
  if (!benefit) return null;

  return (
    <Card>
      <Grid
        container
        direction="row"
        alignItems="center"
        gap={3}
        sx={{ borderBottom: '1px solid #e0e0e0', px: 2, py: 1 }}
      >
        <Grid xs item sx={{ display: 'flex', alignItems: 'center' }}>
          <Box />
          <Typography
            variant="h5"
            component="div"
            display="flex"
            alignItems="center"
          >
            {benefit?.account_id}
          </Typography>
        </Grid>
        <Grid item>
          <Chip label={year} size="small" variant="outlined" />
        </Grid>
      </Grid>
      <Grid container alignItems="stretch" sx={{ px: 2, py: 1 }}>
        <Grid
          item
          xs
          display="flex"
          flexDirection="column"
          sx={{ textAlign: 'left' }}
        >
          <Typography variant="subtitle2">Elected Amount</Typography>
          <Box>
            <Money value={benefit.elect_amount} />
          </Box>
        </Grid>
        <Grid
          item
          xs
          display="flex"
          flexDirection="column"
          sx={{ textAlign: 'left' }}
        >
          <Typography variant="subtitle2">
            Total Deducted Amount (YTD)
          </Typography>
          <Box>
            <Money value={benefit.deduct_amount} />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default SpendingAccountSummary;
