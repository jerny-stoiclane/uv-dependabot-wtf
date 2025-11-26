import {
  addYears,
  formatISO,
  isBefore,
  parseISO,
  startOfToday,
  startOfYear,
} from 'date-fns';

import { getDisplayName, getOrdinalSuffix } from './profile';

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  type: string;
  classNames: string[];
}

export interface Employee {
  id?: string;
  first_name: string;
  last_name: string;
  first_hire_date?: string;
}

export const calculateUpcomingAnniversaries = (
  employees: Employee[],
  showAllYears: boolean = false
): CalendarEvent[] => {
  const today = startOfToday();
  const startOfThisYear = startOfYear(today);
  const oneYearFromToday = addYears(today, 1);

  return employees
    .filter((employee) => employee.first_hire_date)
    .flatMap((employee) => {
      const hireDate = parseISO(employee.first_hire_date!);
      const events: CalendarEvent[] = [];

      // When showAllYears is true (calendar view), show anniversaries from start of current year
      // Otherwise (card view), show only from today forward
      const startDate = showAllYears ? startOfThisYear : today;

      // Calculate this year's anniversary
      const thisYearAnniversary = new Date(
        today.getFullYear(),
        hireDate.getMonth(),
        hireDate.getDate()
      );

      // Calculate years for this year's anniversary
      let thisYearCount =
        thisYearAnniversary.getFullYear() - hireDate.getFullYear();
      if (thisYearCount === 0) {
        thisYearCount = 1;
      }

      // Include this year's anniversary if it's after our start date
      if (!isBefore(thisYearAnniversary, startDate)) {
        const shouldInclude =
          showAllYears || thisYearAnniversary <= oneYearFromToday;

        if (shouldInclude) {
          events.push({
            title: `${getDisplayName(
              employee
            )}'s ${thisYearCount}${getOrdinalSuffix(
              thisYearCount
            )} Anniversary`,
            start: formatISO(thisYearAnniversary),
            end: formatISO(thisYearAnniversary),
            allDay: true,
            type: 'anniversary',
            classNames: ['anniversary-event'],
          });
        }
      }

      // Calculate next year's anniversary
      const nextYearAnniversary = new Date(
        today.getFullYear() + 1,
        hireDate.getMonth(),
        hireDate.getDate()
      );

      let nextYearCount =
        nextYearAnniversary.getFullYear() - hireDate.getFullYear();
      if (nextYearCount === 0) {
        nextYearCount = 1;
      }

      // Include next year's anniversary if appropriate
      const shouldIncludeNextYear =
        showAllYears || nextYearAnniversary <= oneYearFromToday;

      if (shouldIncludeNextYear) {
        events.push({
          title: `${getDisplayName(
            employee
          )}'s ${nextYearCount}${getOrdinalSuffix(nextYearCount)} Anniversary`,
          start: formatISO(nextYearAnniversary),
          end: formatISO(nextYearAnniversary),
          allDay: true,
          type: 'anniversary',
          classNames: ['anniversary-event'],
        });
      }

      return events;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
};
