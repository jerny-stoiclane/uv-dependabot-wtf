import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { isPast, parseISO } from 'date-fns';
import { useState } from 'react';

import { formatDate } from '../../utils/date';

const NextHolidayCard: React.FC<{
  holidays: Holiday[];
  showAll?: boolean;
}> = ({ holidays, showAll = false }) => {
  const [expanded, setExpanded] = useState(showAll);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (!holidays?.length) return null;

  const upcomingHolidays = holidays.filter(
    (holiday) => !isPast(parseISO(holiday.start.date))
  );

  const nextHoliday = upcomingHolidays[0];

  return (
    <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Typography variant="caption">Upcoming company holiday</Typography>
        {nextHoliday && (
          <Box mt={1}>
            <Typography variant="h5" fontWeight="normal">
              {nextHoliday.summary}
            </Typography>
            <Typography variant="subtitle1">
              {formatDate(nextHoliday.start.date, 'FULL')}
            </Typography>
            {upcomingHolidays.length > 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        )}
        <List dense sx={{ padding: 0, position: 'relative' }}>
          {upcomingHolidays.slice(1, 6).map((holiday) => (
            <ListItem
              dense
              sx={{ padding: 0, paddingBottom: 0.5 }}
              key={`${holiday.start.date}-${holiday.summary}`}
            >
              <ListItemText primary={holiday.summary} disableTypography />
              <ListItemText
                disableTypography
                primary={formatDate(holiday.start.date, 'FULL')}
                sx={{ textAlign: 'right' }}
              />
            </ListItem>
          ))}
          {!expanded && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '100%',
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 1) 00%, rgba(255, 255, 255, 0) 100%)',
              }}
            />
          )}
        </List>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List dense sx={{ padding: 0 }}>
            {upcomingHolidays.slice(6).map((holiday) => (
              <ListItem
                dense
                sx={{ padding: 0, paddingBottom: 0.5 }}
                key={`${holiday.start.date}-${holiday.summary}`}
              >
                <ListItemText primary={holiday.summary} disableTypography />
                <ListItemText
                  primary={formatDate(holiday.start.date, 'FULL')}
                  sx={{ textAlign: 'right' }}
                  disableTypography
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </CardContent>
      {!showAll && (
        <CardActions disableSpacing sx={{ pt: 0, mt: 'auto' }}>
          <Button
            fullWidth
            onClick={handleExpandClick}
            sx={{ color: 'action.active' }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
            <Typography variant="subtitle2">
              {expanded ? 'Hide all holidays' : 'Show all holidays'}
            </Typography>
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default NextHolidayCard;
