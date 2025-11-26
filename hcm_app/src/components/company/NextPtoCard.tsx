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
import { format, isAfter, isSameDay, parseISO, startOfDay } from 'date-fns';
import { startCase, toLower } from 'lodash';
import { useState } from 'react';

const NextPtoCard = ({ ptoRequests, showAll = false }) => {
  const [expanded, setExpanded] = useState(showAll);

  if (!ptoRequests?.length) return null;

  const today = startOfDay(new Date());

  const upcomingPtoRequests = ptoRequests
    .filter((request) => {
      const startDate = parseISO(request.start);
      return isAfter(startDate, today) || isSameDay(startDate, today); // Ensuring the start date is today or in the future
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const nextPto = upcomingPtoRequests[0];

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Typography variant="caption">Upcoming time off</Typography>
        {nextPto && (
          <Box mt={1}>
            <Typography variant="h5" fontWeight="normal">
              {startCase(toLower(nextPto.name))} PTO
            </Typography>
            <Typography variant="subtitle1">
              {format(parseISO(nextPto.start), 'PPP')}
            </Typography>
            {upcomingPtoRequests.length > 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        )}
        <List dense sx={{ padding: 0, position: 'relative' }}>
          {upcomingPtoRequests.slice(1, 6).map((event) => (
            <ListItem
              dense
              sx={{ padding: 0, paddingBottom: 0.5 }}
              key={`${event.start}-${event.name}`}
            >
              <ListItemText
                primary={`${startCase(toLower(event.name))} PTO`}
                disableTypography
              />
              <ListItemText
                primary={format(parseISO(event.start), 'PPP')}
                sx={{ textAlign: 'right' }}
                disableTypography
              />
            </ListItem>
          ))}
          {!expanded && upcomingPtoRequests.length > 6 && (
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
            {upcomingPtoRequests.slice(6).map((event) => (
              <ListItem
                dense
                sx={{ padding: 0, paddingBottom: 0.5 }}
                key={`${event.start}-${event.name}`}
              >
                <ListItemText
                  primary={`${startCase(toLower(event.name))} PTO`}
                  disableTypography
                />
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
      {!showAll && upcomingPtoRequests.length > 6 && (
        <CardActions disableSpacing sx={{ pt: 0, mt: 'auto' }}>
          <Button
            fullWidth
            onClick={handleExpandClick}
            sx={{ color: 'action.active' }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
            <Typography variant="subtitle2">
              {expanded ? 'Hide all time off' : 'Show all time off'}
            </Typography>
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default NextPtoCard;
