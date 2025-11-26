import { Money } from '@armhr/ui';
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';

import { useApi } from '../../hooks/useApi';

const PaySummary: React.FC<{ summary: PayrollSummary }> = ({
  summary: initialSummary,
}) => {
  const api = useApi();

  const currentYear = new Date().getFullYear().toString();

  const [year, setYear] = useState<string>(currentYear);
  const [summary, setSummary] = useState<PayrollSummary>(initialSummary);

  useEffect(() => {
    const getSummary = async () => {
      try {
        const response = await api.payroll.getSummary({ year });
        setSummary(response.results);
      } catch (error) {
        console.error(error);
      }
    };
    getSummary();
  }, [year]);

  if (!summary) return null;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="initial">
          Year to date
        </Typography>

        <Box sx={{ ml: 'auto' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
            >
              <MenuItem value={2025}>2025</MenuItem>
              <MenuItem value={2024}>2024</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
              <MenuItem value={2022}>2022</MenuItem>
              <MenuItem value={2021}>2021</MenuItem>
              <MenuItem value={2021}>2020</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Card sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
            <Typography
              color="initial"
              sx={{
                mb: 2,
                pb: 1,
                borderBottom: '1px solid',
                borderColor: 'grey.300',
              }}
            >
              YTD Gross pay for {year}
            </Typography>
            <CardText sx={{ fontWeight: 500 }}>Net</CardText>
            <CardText sx={{ fontWeight: 500 }}>Taxes</CardText>
            <CardText sx={{ fontWeight: 500 }}>Deductions</CardText>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                mb: 2,
                pb: 1,
                borderBottom: '1px solid',
                borderColor: 'grey.300',
              }}
            >
              <Money value={summary?.gross_wages || 0} />
            </Typography>
            <CardText sx={{ textAlign: 'right' }}>
              <Money value={summary?.net_wages || 0} />
            </CardText>
            <CardText sx={{ textAlign: 'right' }}>
              <Money value={summary?.taxes || 0} />
            </CardText>
            <CardText sx={{ textAlign: 'right' }}>
              <Money value={summary?.deductions || 0} />
            </CardText>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

const CardText = ({
  sx,
  children,
}: {
  sx?: SxProps<Theme>;
  children: ReactNode;
}) => (
  <Box
    sx={{
      fontSize: 14,
      mb: 0.5,
      pb: 0,
      ...sx,
      '&:last-child': {
        mb: 0,
      },
    }}
  >
    {children}
  </Box>
);

export default PaySummary;
