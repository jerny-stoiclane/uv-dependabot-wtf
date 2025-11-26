import { Circle } from '@mui/icons-material';
import { Box, Card, Tooltip, Typography } from '@mui/material';
import {
  DateCalendar,
  DayCalendarSkeleton,
  PickersDay,
  PickersDayProps,
} from '@mui/x-date-pickers-pro';
import { isPast, isSameDay, parseISO } from 'date-fns';

import useFetchHolidays from '../../hooks/useFetchHolidays';
import { useUser } from '../../hooks/useUser';
import { formatDate } from '../../utils/date';

const initialDate = new Date();

const HolidayCard: React.FC<{
  showNextHoliday?: boolean;
  extraDates?: Holiday[];
}> = ({ showNextHoliday, extraDates }) => {
  const { user } = useUser();
  const holidays = useFetchHolidays();

  if (user?.is_swipeclock_enabled) {
    return null;
  }

  const upcomingHolidays = holidays.filter(
    (holiday) => !isPast(parseISO(holiday.start.date))
  );

  const nextHoliday = upcomingHolidays[0];

  return (
    <Card sx={{ flexGrow: 1 }}>
      <DateCalendar
        defaultValue={initialDate}
        renderLoading={() => <DayCalendarSkeleton />}
        shouldDisableDate={() => true}
        slots={{ day: CustomDay as any }}
        sx={{
          padding: 0,
          margin: 0,
          width: '100%',
          '& .MuiPickersCalendarHeader-root': {
            marginBottom: 2,
          },
          '& .MuiYearCalendar-root': {
            minWidth: '100%',
          },
          '& .MuiDateCalendar-root': {
            padding: 0,
          },
          '& .MuiPickersDay-root': {
            color: (theme) => `${theme.palette.text.primary} !important`,

            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: '#ffffff !important',
            },
          },
        }}
        slotProps={{
          day: {
            holidays,
            extraDates,
          } as any,
        }}
      />
      {showNextHoliday && nextHoliday && (
        <Box sx={{ px: 3, pb: 2 }}>
          <Typography variant="caption">Next company holiday</Typography>
          <Typography variant="body1">
            {nextHoliday.summary} ({formatDate(nextHoliday.start.date, 'FULL')})
          </Typography>
        </Box>
      )}
    </Card>
  );
};

const CustomDay = (
  props: PickersDayProps<Date> & {
    holidays?: Holiday[];
    extraDates?: Holiday[];
  }
) => {
  const {
    day,
    holidays = [],
    extraDates = [],
    outsideCurrentMonth,
    ...other
  } = props;

  const holiday = holidays.find((h) => isSameDay(parseISO(h.start.date), day));

  const extraDate = extraDates.find((e) =>
    isSameDay(parseISO(e.start.date), day)
  );

  if ((!holiday && !extraDate) || outsideCurrentMonth) {
    return (
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    );
  }

  const dayContent = holiday || extraDate;

  return (
    <Tooltip title={dayContent?.summary} placement="top" arrow>
      <Box position="relative">
        <Circle
          sx={{
            color: extraDate ? 'warning.main' : 'primary.main',
            fontSize: 10,
            position: 'absolute',
            zIndex: 1,
            top: 0,
            right: 0,
          }}
        />
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Box>
    </Tooltip>
  );
};

export default HolidayCard;
