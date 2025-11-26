import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Today } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  Paper,
  Popper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { startCase } from 'lodash';
import React, { useEffect, useState } from 'react';

import { useCompany } from '../../contexts/company.context';
import { useApiData } from '../../hooks/useApiData';
import { useUser } from '../../hooks/useUser';
import { CalendarEvent } from '../../utils/anniversary';
import { ConfigFlags } from '../../utils/constants';
import { getDisplayName } from '../../utils/profile';
import SubscribeToCalendar from './SubscribeToCalendar';

const Calendar = ({ compact = false, events }) => {
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const { user } = useUser();
  const { id: clientId, config: companyConfig } = useCompany();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const { data: allReports } = useApiData((api) =>
    api.profiles.getMyEmployees()
  );

  const hideAnniversaries =
    companyConfig?.find((c) => c.flag === ConfigFlags.HIDE_ANNIVERSARIES)
      ?.value ?? false;
  const showBirthdays =
    companyConfig?.find((c) => c.flag === ConfigFlags.SHOW_CALENDAR_BIRTHDAYS)
      ?.value ?? false;

  const eventTypeFilters = [
    ...(showBirthdays ? ['birthday'] : []),
    ...(hideAnniversaries ? [] : ['anniversary']),
    'holiday',
  ];
  if (user?.is_armhr_pto_enabled) {
    eventTypeFilters.push('pto');
  }
  const peopleFilters = ['everyone', 'all_reports', 'direct_reports'];
  const initialFilters = [...eventTypeFilters, 'everyone'];

  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    compact ? [] : initialFilters
  );

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTypeFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setSelectedFilters((prev) =>
      checked ? [...prev, name] : prev.filter((filter) => filter !== name)
    );
  };

  const handlePeopleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSelectedFilters((prev) => [
      ...prev.filter((filter) => !peopleFilters.includes(filter)),
      value,
    ]);
  };

  const resetFilters = () => {
    setSelectedFilters(initialFilters);
    setSearchQuery('');
  };

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = events.filter((event) => {
      const matchesFilter =
        selectedFilters.length === 0 || selectedFilters.includes(event.type);
      const matchesSearch =
        !searchQuery || event.title.toLowerCase().includes(lowercasedQuery);

      const matchesPeopleFilter = (() => {
        if (selectedFilters.includes('everyone')) {
          return true;
        }
        return (
          allReports?.some((emp) => {
            if (event.type === 'holiday') return true;
            return event.title.includes(getDisplayName(emp))
              ? selectedFilters.includes('direct_reports')
                ? emp.reports_to === user?.id
                : true
              : false;
          }) ?? false
        );
      })();

      return matchesFilter && matchesSearch && matchesPeopleFilter;
    });

    setFilteredEvents(filtered);
  }, [searchQuery, selectedFilters, events, allReports]);

  const handleEventMouseEnter = (info) => {
    setAnchorEl(info.el);
    setTooltipContent(info.event.title);
  };

  const handleEventMouseLeave = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {!compact && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5 }}>
          <Typography variant="h2">Company calendar</Typography>

          <Drawer
            anchor="right"
            open={isFilterPanelOpen}
            onClose={toggleFilterPanel}
          >
            <Box p={2} width="250px" role="presentation">
              <Typography variant="h5" sx={{ mb: 2 }}>
                Filters & search
              </Typography>
              <TextField
                margin="dense"
                fullWidth
                variant="outlined"
                label="Search calendar..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <FormGroup>
                <Typography variant="caption" sx={{ mt: 2, mb: 1 }}>
                  Show events:
                </Typography>
                {eventTypeFilters.map((filter) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFilters.includes(filter)}
                        onChange={handleTypeFilterChange}
                        name={filter}
                      />
                    }
                    label={filter === 'pto' ? 'Time off' : startCase(filter)}
                    key={filter}
                  />
                ))}
              </FormGroup>
              <FormGroup>
                <Typography variant="caption" sx={{ mt: 2, mb: 1 }}>
                  Show events for:
                </Typography>
                <RadioGroup
                  value={
                    selectedFilters.find((filter) =>
                      peopleFilters.includes(filter)
                    ) || 'everyone'
                  }
                  onChange={handlePeopleFilterChange}
                  name="people-filter"
                >
                  {peopleFilters.map((filter) => (
                    <FormControlLabel
                      key={filter}
                      value={filter}
                      control={<Radio />}
                      label={startCase(filter)}
                    />
                  ))}
                </RadioGroup>
              </FormGroup>

              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ mt: 2 }}>
                  Subcribe to calendar link:
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <SubscribeToCalendar
                    clientId={clientId}
                    employeeId={user!.id}
                    selectedFilters={selectedFilters}
                  />
                </Box>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 4 }}>
                <Button
                  fullWidth
                  onClick={resetFilters}
                  variant="outlined"
                  color="secondary"
                >
                  Reset
                </Button>
                <Button
                  fullWidth
                  onClick={toggleFilterPanel}
                  variant="outlined"
                  color="primary"
                >
                  Close
                </Button>
              </Stack>
            </Box>
          </Drawer>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              size="small"
              sx={{ ml: 'auto' }}
              onClick={toggleFilterPanel}
            >
              <Today sx={{ mr: 1 }} />
              Subscribe to calendar
            </Button>
            <Button
              onClick={toggleFilterPanel}
              variant="contained"
              color="primary"
            >
              Filters & search
            </Button>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          height: '100%',
          p: 0,
          '& .fc': {
            borderRadius: 2,
            overflow: 'hidden',
          },
          '& .fc-theme-standard': {
            borderRadius: 2,
            overflow: 'hidden',
          },
          '& .fc-scrollgrid': {
            borderRadius: 2,
            overflow: 'hidden',
            borderCollapse: 'separate', // important for border radius to work
          },
          '& .fc table': {
            borderRadius: 2,
            overflow: 'hidden',
          },
          '& .fc-scrollgrid tbody tr:last-child td:first-of-type': {
            borderBottomLeftRadius: 16,
          },
          '& .fc-scrollgrid tbody tr:last-child td:last-of-type': {
            borderBottomRightRadius: 16,
          },
        }}
      >
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          datesSet={compact ? undefined : undefined}
          initialView="dayGridMonth"
          editable={false}
          selectable={false}
          navLinks={false}
          dayMaxEvents={true}
          fixedWeekCount={false}
          showNonCurrentDates={true}
          views={
            compact ? { dayGridMonth: { type: 'dayGridMonth' } } : undefined
          }
          headerToolbar={
            compact
              ? false
              : {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }
          }
          events={compact ? events : filteredEvents}
          themeSystem="standard"
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            list: 'List',
          }}
          eventClassNames={(arg) => {
            const eventType = arg.event.extendedProps.type || 'other';
            return [`${eventType}-event`];
          }}
          eventContent={(arg) => {
            const chars = compact ? 10 : 30;
            const truncatedTitle =
              arg.event.title.length > chars
                ? arg.event.title.substring(0, chars) + '...'
                : arg.event.title;

            return {
              html: `<div title="${arg.event.title}">${truncatedTitle}</div>`,
            };
          }}
          eventDidMount={(info) => {
            info.el.addEventListener('mouseenter', () =>
              handleEventMouseEnter(info)
            );
            info.el.addEventListener('mouseleave', handleEventMouseLeave);
          }}
        />
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="top"
          style={{ zIndex: 9999 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 1,
              bgcolor: 'background.paper',
              maxWidth: 300,
              wordWrap: 'break-word',
            }}
          >
            {tooltipContent}
          </Paper>
        </Popper>
      </Box>
    </>
  );
};

export default Calendar;
