import { PageSpinner } from '@armhr/ui';
import { Box, Grid, Typography } from '@mui/material';
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
import { Helmet } from 'react-helmet';

import AttendanceCard from '../../components/dashboard/AttendanceCard';
import BenefitsCard from '../../components/dashboard/BenefitsCard';
import BenefitsEnrollmentCard from '../../components/dashboard/BenefitsEnrollmentCard';
import CalendarCard from '../../components/dashboard/CalendarCard';
import LaborNoticeCard from '../../components/dashboard/LaborNoticeCard';
import PayHistoryCard from '../../components/dashboard/PayHistoryCard';
import ProductNotificationsBanner from '../../components/dashboard/ProductNotificationsBanner';
import QuickActionsCard from '../../components/dashboard/QuickActionsCard';
import TeamCard from '../../components/dashboard/TeamCard';
import TimeOffCardV2 from '../../components/dashboard/TimeOffCard';
import { useCompany } from '../../contexts/company.context';
import { useApiData } from '../../hooks/useApiData';
import useFetchHolidays from '../../hooks/useFetchHolidays';
import { useUser } from '../../hooks/useUser';
import { calculateUpcomingAnniversaries } from '../../utils/anniversary';
import { ConfigFlags } from '../../utils/constants';
import { getDisplayName } from '../../utils/profile';

const DashboardPage: React.FC = () => {
  const { user } = useUser();
  const { config: companyConfig } = useCompany();
  const { data: dashboardData, loading } = useApiData<DashboardData>((api) =>
    api.profiles.getDashboard()
  );

  const holidays = useFetchHolidays();
  const { data: employees } = useApiData((api) => api.company.getEmployees());
  const { data: ptoData } = useApiData((api) =>
    api.benefits.getPtoRequestsSummary()
  );

  const { data: birthdayPermissions } = useApiData<BirthdayPermission[]>(
    (api) => api.company.getBirthdays()
  );

  const showBirthdays =
    companyConfig?.find((c) => c.flag === ConfigFlags.SHOW_CALENDAR_BIRTHDAYS)
      ?.value ?? false;

  const hideAnniversaries =
    companyConfig?.find((c) => c.flag === ConfigFlags.HIDE_ANNIVERSARIES)
      ?.value ?? false;

  // Build events for the calendar card
  let calendarEvents: CalendarEvent[] = [];
  if (employees && holidays && ptoData) {
    // Birthdays
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

    // Anniversaries
    const anniversaryEvents = hideAnniversaries
      ? []
      : calculateUpcomingAnniversaries(employees, true);
    // Holidays
    const holidayEvents = holidays.map((holiday) => ({
      title: holiday.summary,
      start: formatISO(parseISO(holiday.start.date)),
      end: formatISO(parseISO(holiday.end.date)),
      allDay: true,
      type: 'holiday',
      classNames: ['holiday-event'],
    }));
    // PTO
    const ptoEvents = (ptoData?.pto_requests || [])
      .filter(
        (request) =>
          request.status === 'A' ||
          request.status === 'P' ||
          request.status === 'N'
      )
      .filter((request) => {
        const endDate = parseISO(request.end);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return endDate >= today; // Only show requests that end today or in the future
      })
      .map((request) => {
        const endDate = parseISO(request.end);
        const nextDay = addDays(endDate, 1);
        const employee = employees.find(
          (emp) => emp.id === request.employee_id
        );
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
    calendarEvents = [
      ...birthdayEvents,
      ...anniversaryEvents,
      ...holidayEvents,
      ...ptoEvents,
    ];
  }

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Armhr</title>
        <meta
          name="description"
          content="View your Armhr dashboard with quick access to payroll, benefits, time off, and company information."
        />
      </Helmet>
      <ProductNotificationsBanner />

      {/* Greeting/Header */}
      <Box>
        <Typography variant="h2" fontWeight={700} color="text.primary">
          Welcome, {getDisplayName(user!, false)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Typography>
      </Box>

      <LaborNoticeCard />

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <BenefitsEnrollmentCard />
              <PayHistoryCard
                history={
                  dashboardData?.most_recent_voucher
                    ? [dashboardData.most_recent_voucher]
                    : []
                }
              />
              <BenefitsCard
                benefits={dashboardData?.active_benefit_plans || []}
              />
              <TeamCard teamContacts={dashboardData?.support || []} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <QuickActionsCard />
              {user?.is_swipeclock_enabled && <AttendanceCard />}

              {user?.is_armhr_pto_enabled &&
                user?.active_benefits?.pto_plans && (
                  <TimeOffCardV2
                    ptoSummary={dashboardData?.pto_summary || []}
                    ptoRequests={ptoData?.pto_requests || []}
                  />
                )}

              <CalendarCard events={calendarEvents} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DashboardPage;
