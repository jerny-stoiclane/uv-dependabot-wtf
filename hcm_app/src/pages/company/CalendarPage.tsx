import { PageSpinner, useNotifications } from '@armhr/ui';
import { Box, Stack } from '@mui/material';
import {
  addDays,
  addYears,
  format,
  formatISO,
  isBefore,
  isLeapYear,
  isSameDay,
  parseISO,
} from 'date-fns';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import Calendar from '../../components/company/Calendar';
import NextAnniversaryCard from '../../components/company/NextAnniversaryCard';
import NextBirthdayCard from '../../components/company/NextBirthdayCard';
import NextPtoCard from '../../components/company/NextPtoCard';
import NextHolidayCard from '../../components/time-off/NextHolidayCard';
import { useCompany } from '../../contexts/company.context';
import { useApiData } from '../../hooks/useApiData';
import useFetchHolidays from '../../hooks/useFetchHolidays';
import { calculateUpcomingAnniversaries } from '../../utils/anniversary';
import { ConfigFlags } from '../../utils/constants';
import { paths } from '../../utils/paths';
import { getDisplayName } from '../../utils/profile';

const CalendarPage: React.FC = () => {
  const holidays = useFetchHolidays();
  const { config: companyConfig } = useCompany();
  const { showNotification } = useNotifications();
  const navigate = useNavigate();

  const { data: employees, loading } = useApiData((api) =>
    api.company.getEmployees()
  );

  const { data: birthdayPermissions, loading: birthdaysLoading } = useApiData<
    BirthdayPermission[]
  >((api) => api.company.getBirthdays());

  const { data: ptoRequests, loading: ptoRequestsLoading } = useApiData<
    PtoRequest[]
  >((api) => api.company.getPtoRequests());

  if (loading) return <PageSpinner />;

  if (!employees || employees.length === 0) {
    showNotification({
      message:
        'No employees found, something went wrong. Please refresh and try again',
      severity: 'error',
    });
    navigate(paths.dashboard);
    return null;
  }

  const showBirthdays =
    companyConfig?.find((c) => c.flag === ConfigFlags.SHOW_CALENDAR_BIRTHDAYS)
      ?.value ?? false;

  const birthdayEvents = showBirthdays
    ? employees
        .filter((employee) => {
          const hasBirthDate = employee.birth_date;

          const shouldShowBirthday = birthdayPermissions?.some(
            (birthday) => birthday.employee_id === employee.id
          )
            ? birthdayPermissions.some(
                (birthday) =>
                  birthday.employee_id === employee.id &&
                  birthday.show_calendar_birthdays
              )
            : true; // Default to true if no entry exists
          return hasBirthDate && shouldShowBirthday;
        })
        .map((employee) => {
          const birthDate = parseISO(employee.birth_date!);

          const currentYear = new Date().getFullYear();
          const day =
            birthDate.getMonth() === 1 &&
            birthDate.getDate() === 29 &&
            !isLeapYear(new Date(currentYear, 1, 29))
              ? 28
              : birthDate.getDate();

          let thisYearBirthday = new Date(
            currentYear,
            birthDate.getMonth(),
            day
          );

          // Adjust the birthday to next year if it has already passed
          if (
            isBefore(thisYearBirthday, new Date()) &&
            !isSameDay(thisYearBirthday, new Date())
          ) {
            thisYearBirthday = addYears(thisYearBirthday, 1);
          }

          const fullName = getDisplayName(employee);

          return {
            title: `${fullName}'s Birthday`,
            start: formatISO(thisYearBirthday),
            end: formatISO(thisYearBirthday),
            allDay: true,
            type: 'birthday',
            name: fullName,
            classNames: ['birthday-event'],
          };
        })
    : [];

  const hideAnniversaries =
    companyConfig?.find((c) => c.flag === ConfigFlags.HIDE_ANNIVERSARIES)
      ?.value ?? false;

  const anniversaryEvents = hideAnniversaries
    ? []
    : calculateUpcomingAnniversaries(employees, true);

  const holidayEvents: CalendarEvent[] = holidays.map((holiday) => ({
    title: holiday.summary,
    start: formatISO(parseISO(holiday.start.date)),
    end: formatISO(parseISO(holiday.end.date)),
    allDay: true,
    type: 'holiday',
    classNames: ['holiday-event'],
  }));

  const ptoEvents: CalendarEvent[] = (ptoRequests || [])
    .filter((request) => request.status === 'A' || request.status === 'P')
    .map((request) => {
      // Add one day to the end date to make it inclusive in the calendar
      // The end date is exclusive by default via fullcalendar (and the .ics for that matter)
      const endDate = parseISO(request.end);
      const nextDay = addDays(endDate, 1);

      const employee = employees.find((emp) => emp.id === request.employee_id);

      const displayName = employee
        ? `${employee.nickname || employee.first_name} ${employee.last_name}`
        : request.name;

      return {
        title: `${displayName} PTO`,
        start: format(parseISO(request.start), 'yyyy-MM-dd'),
        end: format(nextDay, 'yyyy-MM-dd'),
        allDay: true,
        name: displayName,
        type: 'pto',
        classNames: ['pto-event'],
      };
    });
  if (birthdaysLoading || ptoRequestsLoading)
    return <PageSpinner sx={{ color: 'primary' }} />;

  return (
    <Box>
      <Helmet>
        <title>Company Calendar | Armhr</title>
        <meta
          name="description"
          content="View company calendar with holidays, birthdays, anniversaries, and time off."
        />
      </Helmet>
      <Calendar
        events={[
          ...birthdayEvents,
          ...anniversaryEvents,
          ...holidayEvents,
          ...ptoEvents,
        ]}
      />

      <Stack spacing={2} direction="row" sx={{ mt: 5 }}>
        <NextHolidayCard holidays={holidays} showAll={false} />
        <NextPtoCard ptoRequests={ptoRequests || []} showAll={false} />
      </Stack>
      <Stack spacing={2} direction="row" sx={{ mt: 5 }}>
        {!hideAnniversaries && (
          <NextAnniversaryCard employees={employees} showAll={false} />
        )}
        <NextBirthdayCard birthdays={birthdayEvents} showAll={false} />
      </Stack>
    </Box>
  );
};

export default CalendarPage;
