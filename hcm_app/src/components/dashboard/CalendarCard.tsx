import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Card, IconButton, Link, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { useCompany } from '../../contexts/company.context';
import { ConfigFlags } from '../../utils/constants';
import { paths } from '../../utils/paths';
import Calendar from '../company/Calendar';

interface CalendarCardProps {
  events?: CalendarEvent[];
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  all: 'All',
  birthday: 'Birthdays',
  anniversary: 'Anniversaries',
  holiday: 'Holidays',
  pto: 'Time Off',
  company: 'Company Events',
};

const PAGE_SIZE = 4; // 2x2 grid

const eventTypePillColors: Record<string, { bg: string; color: string }> = {
  company: { bg: '#E3EDFF', color: '#2563EB' }, // blue
  holiday: { bg: '#FEF3C7', color: '#B7791F' }, // yellow
  pto: { bg: '#E6F4EA', color: '#219653' }, // green
  birthday: { bg: '#FEF3C7', color: '#D97706' }, // amber/orange
  anniversary: { bg: '#F3E8FF', color: '#8B5CF6' }, // purple
  all: { bg: '#F3F4F6', color: '#64748B' }, // gray
};

const CalendarCard: React.FC<CalendarCardProps> = ({ events = [] }) => {
  const [page, setPage] = useState(0);
  const { config: companyConfig } = useCompany();

  const getUpcomingEvents = () => {
    const hideAnniversaries =
      companyConfig?.find((c) => c.flag === ConfigFlags.HIDE_ANNIVERSARIES)
        ?.value ?? false;
    const showBirthdays =
      companyConfig?.find((c) => c.flag === ConfigFlags.SHOW_CALENDAR_BIRTHDAYS)
        ?.value ?? false;

    const filteredByFlag = events.filter((e) => {
      if (hideAnniversaries && e.type === 'anniversary') return false;
      if (!showBirthdays && e.type === 'birthday') return false;
      return true;
    });

    return filteredByFlag
      .filter((e) => parseISO(e.start) >= new Date())
      .sort(
        (a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime()
      );
  };

  const upcomingEvents = getUpcomingEvents();
  const totalPages = Math.ceil(upcomingEvents.length / PAGE_SIZE);
  const displayEvents = upcomingEvents.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          sx={{ p: 0.5 }}
          aria-label="Previous page"
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography
          sx={{
            fontSize: 12,
            color: '#888',
            mx: 0.5,
            minWidth: 40,
            textAlign: 'center',
          }}
        >
          {page + 1} / {totalPages}
        </Typography>
        <IconButton
          size="small"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          sx={{ p: 0.5 }}
          aria-label="Next page"
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  const renderEventItem = (event: CalendarEvent) => {
    // Parse dates using date-fns to avoid timezone issues
    const dateObj = parseISO(event.start);
    const month = format(dateObj, 'MMM');
    const day = format(dateObj, 'd');
    const color = eventTypePillColors[event.type] || {
      bg: '#F3F4F6',
      color: '#64748B',
    };

    return (
      <Box
        key={event.title + event.start}
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: 40,
        }}
      >
        <Box
          sx={{
            background: color.bg,
            color: color.color,
            borderRadius: 2,
            width: 44,
            px: 0,
            py: 0.5,
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 13,
            mr: 1.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div>{month}</div>
          <div style={{ fontWeight: 600, fontSize: 12 }}>
            <span>{day}</span>
          </div>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: 13,
              color: '#222',
              lineHeight: 1.2,
              mb: 0.1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={event.title}
          >
            {event.title.length > 35
              ? `${event.title.substring(0, 35)}...`
              : event.title}
          </Typography>
          <Typography sx={{ color: '#888', fontSize: 11, fontWeight: 500 }}>
            {EVENT_TYPE_LABELS[event.type] || event.type}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 3,
        display: 'flex',
        overflow: 'visible',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h5">Calendar</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link
            component={RouterLink}
            to={paths.calendar}
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            View company calendar
          </Link>
        </Box>
      </Box>

      <Box sx={{ flex: 1, mb: 2 }}>
        <Calendar events={events} compact />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="h5">Upcoming events</Typography>
          {renderPaginationControls()}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {displayEvents.map(renderEventItem)}
        </Box>
      </Box>
    </Card>
  );
};

export default CalendarCard;
