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
import { format, parseISO } from 'date-fns';
import { useState } from 'react';

import {
  Employee,
  calculateUpcomingAnniversaries,
} from '../../utils/anniversary';

const NextAnniversaryCard: React.FC<{
  employees: Employee[];
  showAll?: boolean;
}> = ({ employees, showAll = false }) => {
  const [expanded, setExpanded] = useState(showAll);

  if (!employees?.length) return null;

  const upcomingAnniversaries = calculateUpcomingAnniversaries(
    employees,
    showAll
  );
  const nextAnniversary = upcomingAnniversaries[0];

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Typography variant="caption">Upcoming employee anniversary</Typography>
        {nextAnniversary && (
          <Box mt={1}>
            <Typography variant="h5" fontWeight="normal">
              🎉 {nextAnniversary.title}
            </Typography>
            <Typography variant="subtitle1">
              {format(parseISO(nextAnniversary.start), 'PPP')}
            </Typography>
            {upcomingAnniversaries.length > 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        )}
        <List dense sx={{ padding: 0, position: 'relative' }}>
          {upcomingAnniversaries.slice(1, 6).map((event) => (
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
          {!expanded && upcomingAnniversaries.length > 6 && (
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
            {upcomingAnniversaries.slice(6).map((event) => (
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
      {!showAll && upcomingAnniversaries.length > 6 && (
        <CardActions disableSpacing sx={{ pt: 0, mt: 'auto' }}>
          <Button
            fullWidth
            onClick={handleExpandClick}
            sx={{ color: 'action.active' }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
            <Typography variant="subtitle2">
              {expanded ? 'Hide all anniversaries' : 'Show all anniversaries'}
            </Typography>
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default NextAnniversaryCard;
