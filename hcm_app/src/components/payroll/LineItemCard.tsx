import { Money } from '@armhr/ui';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardProps,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';

const LineItemCard: React.FC<
  CardProps & {
    title: string;
    summaryAmount?: number;
    lineItems: {
      label: string;
      value: number;
    }[];
  }
> = ({ title, summaryAmount, lineItems, ...props }) => (
  <Card {...props}>
    <CardHeader
      title={
        <Box display="flex">
          <Typography variant="h5" flex={1}>
            {title}
          </Typography>
          {typeof summaryAmount !== 'undefined' && (
            <Typography variant="h5">
              <Money value={summaryAmount} />
            </Typography>
          )}
        </Box>
      }
      sx={{ backgroundColor: 'grey.100', px: 2, py: 1.5 }}
      titleTypographyProps={{ fontWeight: 500 }}
    />
    <CardContent>
      <Grid container spacing={2}>
        {lineItems.map((lineItem, indx) => (
          <Grid item container key={indx}>
            <Grid item xs={6}>
              <Typography component="span" flex={1}>
                {lineItem.label}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography component="span">
                <Money value={lineItem.value}></Money>
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

export default LineItemCard;
