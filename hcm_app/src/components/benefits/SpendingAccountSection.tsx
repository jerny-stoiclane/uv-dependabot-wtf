import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import SpendingAccountSummary from './SpendingAccountSummary';

interface SpendingAccountSectionProps {
  title: string;
  accountType: string;
  spendAccts: SpendingAccountConcise[];
}

const SpendingAccountSection: React.FC<SpendingAccountSectionProps> = ({
  title,
  accountType,
  spendAccts,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const availableYears = useMemo(() => {
    const years = spendAccts.map((acct) => parseInt(acct.year, 10));
    // add the current year to the list of available years if not there
    if (!years.includes(new Date().getFullYear())) {
      years.push(new Date().getFullYear());
    }
    const uniqueYears = Array.from(new Set(years));
    uniqueYears.sort((a, b) => b - a);
    return uniqueYears;
  }, [spendAccts]);

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };

  const filteredSpendAccts = useMemo(() => {
    return spendAccts.filter(
      (acct) => parseInt(acct.year, 10) === selectedYear
    );
  }, [spendAccts, selectedYear]);

  if (spendAccts.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">{title}</Typography>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id={`${accountType}-year-select-label`}>Year</InputLabel>
          <Select<number>
            labelId={`${accountType}-year-select-label`}
            id={`${accountType}-year-select`}
            value={selectedYear}
            onChange={handleYearChange}
            inputProps={{ MenuProps: { disableScrollLock: true } }}
            label="Year"
          >
            {availableYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredSpendAccts.length > 0 ? (
        filteredSpendAccts.map((spendAcct, idx) => (
          <SpendingAccountSubSection
            key={`${spendAcct.account_type}-${spendAcct.year}-${idx}`}
            year={spendAcct.year}
            benefits={spendAcct.benefit_accounts || []}
          />
        ))
      ) : (
        <Typography variant="body1">
          No spending accounts found for {selectedYear}.
        </Typography>
      )}
    </Box>
  );
};

const SpendingAccountSubSection: React.FC<{
  year: string;
  benefits: SpendingAccountBenefit[];
}> = ({ year, benefits }) => {
  if (benefits.length === 0) return null;
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={4}>
        {benefits.map((benefit) => (
          <Grid xs={12} sm={6} key={benefit.account_id} item>
            <SpendingAccountSummary benefit={benefit} year={year} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SpendingAccountSection;
