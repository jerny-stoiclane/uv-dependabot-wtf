import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {
  Box,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';

import DonutChart from '../common/DonutChart';

interface PtoPlanCardProps {
  ptoPlan: PtoPlan;
  ptoCalculations: Record<string, PtoHourInfo>;
  index?: number;
}

const PtoPlanCard: React.FC<PtoPlanCardProps> = ({
  ptoPlan,
  ptoCalculations,
  index,
}) => {
  const theme = useTheme();

  // Use backend calculation data, lookup by PTO plan ID
  const ptoCalculation = ptoCalculations[ptoPlan.id];
  const { totalAccruedHours, plannedHours, takenHours, availableHours } = {
    totalAccruedHours: ptoCalculation?.total_accrued_hours || 0,
    plannedHours: ptoCalculation?.planned_hours || 0,
    takenHours: ptoCalculation?.taken_hours || 0,
    availableHours: ptoCalculation?.available_hours || 0,
  };

  const labels = ['Available', 'Planned', 'Taken'];

  const isUnlimited = ptoPlan.calculation_basis === 'UL';

  const pieData = [
    { label: 'Available', value: availableHours },
    { label: 'Planned', value: plannedHours },
    { label: 'Taken', value: takenHours },
  ];

  const middleText = isUnlimited ? 'Unlimited' : undefined;

  const colors = isUnlimited
    ? [theme.palette.success.main]
    : [
        theme.palette.primary.main,
        theme.palette.warning.main,
        theme.palette.error.main,
      ];

  const data = isUnlimited ? [{ value: 100 }] : pieData;

  return (
    <Card sx={{ flexGrow: 1 }}>
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            position="relative"
            sx={{ width: 150 }}
          >
            <DonutChart
              index={index}
              data={data}
              width={250}
              height={250}
              radius={100}
              thickness={25}
              middleText={middleText}
              colors={colors}
              labels={labels}
            />
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box flexGrow={1}>
          <Typography p={2} variant="h4" component="div">
            {ptoPlan.description}
          </Typography>
          <Table size="small">
            <TableBody>
              {pieData.map((planSummary, index) => {
                const isLastRow = index === pieData.length;
                const borderBottomStyle = isLastRow
                  ? { borderBottom: 'none' }
                  : { borderBottom: '1px solid rgba(0, 0, 0, 0.12)' };

                if (isUnlimited && planSummary.label === 'Available')
                  return null;

                return (
                  <TableRow key={index}>
                    <TableCell sx={{ pl: 2, ...borderBottomStyle }}>
                      {index < colors.length && (
                        <FiberManualRecordIcon
                          sx={{
                            color: colors[index],
                            fontSize: 16,
                            mr: 1,
                            position: 'relative',
                            top: 3,
                          }}
                        />
                      )}
                      {planSummary.label}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        pr: 2,
                        whiteSpace: 'nowrap',
                        ...borderBottomStyle,
                      }}
                    >
                      {planSummary.value} hours
                    </TableCell>
                  </TableRow>
                );
              })}
              {!isUnlimited && (
                <TableRow>
                  <TableCell sx={{ pl: 2, border: 'none' }}>
                    Total accrued: {totalAccruedHours}
                  </TableCell>
                  <TableCell sx={{ pr: 2, border: 'none' }} align="right">
                    Carry over: {ptoPlan.carry_over_hours}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Card>
  );
};

export default PtoPlanCard;
