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
import { format, getYear, isPast, parseISO } from 'date-fns';
import { useState } from 'react';

const NextBirthdayCard = ({ birthdays, showAll = false }) => {
  const [expanded, setExpanded] = useState(showAll);

  if (!birthdays?.length) return null;

  const isUpcomingBirthday = (date) => {
    const parsedDate = parseISO(date);
    const today = new Date();

    const birthDay = parsedDate.getDate();
    const birthMonth = parsedDate.getMonth();
    const birthYear = getYear(parsedDate);
    const currentYear = getYear(today);

    const isJanuaryFirst = birthDay === 1 && birthMonth === 0;
    const isInCurrentYear = birthYear === currentYear;
    const isInNextYear = birthYear === currentYear + 1;

    // For January 1st, include the next year when current month is December
    if (isJanuaryFirst) {
      return isInCurrentYear || (isInNextYear && today.getMonth() === 11);
    }

    return isInCurrentYear && !isPast(parsedDate);
  };

  const upcomingBirthdays = birthdays
    .filter((event) => isUpcomingBirthday(event.start))
    .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());

  const nextBirthday = upcomingBirthdays[0];

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Typography variant="caption">Upcoming employee birthday</Typography>
        {nextBirthday && (
          <Box mt={1}>
            <Typography variant="h5" fontWeight="normal">
              🎂 {nextBirthday.name}
            </Typography>
            <Typography variant="subtitle1">
              {format(parseISO(nextBirthday.start), 'PPP')}
            </Typography>
            {upcomingBirthdays.length > 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        )}
        <List dense sx={{ padding: 0, position: 'relative' }}>
          {upcomingBirthdays.slice(1, 6).map((event) => (
            <ListItem
              dense
              sx={{ padding: 0, paddingBottom: 0.5 }}
              key={`${event.start}-${event.name}`}
            >
              <ListItemText primary={event.name} disableTypography />
              <ListItemText
                primary={format(parseISO(event.start), 'PPP')}
                sx={{ textAlign: 'right' }}
                disableTypography
              />
            </ListItem>
          ))}
          {!expanded && upcomingBirthdays.length > 6 && (
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
            {upcomingBirthdays.slice(6).map((event) => (
              <ListItem
                dense
                sx={{ padding: 0, paddingBottom: 0.5 }}
                key={`${event.start}-${event.title}`}
              >
                <ListItemText primary={event.title} disableTypography />
                <ListItemText
                  primary={format(parseISO(event.start), 'PPP')}
                  sx={{ textAlign: 'right' }}
                  disableTypography
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </CardContent>
      {!showAll && upcomingBirthdays.length > 6 && (
        <CardActions disableSpacing sx={{ pt: 0, mt: 'auto' }}>
          <Button
            fullWidth
            onClick={handleExpandClick}
            sx={{ color: 'action.active' }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
            <Typography variant="subtitle2">
              {expanded ? 'Hide all birthdays' : 'Show all birthdays'}
            </Typography>
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default NextBirthdayCard;
