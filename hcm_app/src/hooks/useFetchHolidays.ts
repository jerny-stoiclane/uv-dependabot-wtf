import { isSameDay, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';

import { useApiData } from './useApiData';

function useFetchHolidays() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const { data, loading, error } = useApiData<HolidayDates>((api) =>
    api.benefits.getHolidays()
  );

  const BASE_CALENDAR_URL = 'https://www.googleapis.com/calendar/v3/calendars';
  const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY =
    'holiday@group.v.calendar.google.com';
  const CALENDAR_REGION = 'en.usa';

  const currentYear = new Date().getFullYear();
  const timeMin = new Date(`${currentYear}-01-01`).toISOString();
  const timeMax = new Date(`${currentYear + 1}-12-31`).toISOString();

  const API_KEY = 'AIzaSyDv7ZTobt3jYEgXpnyptssKhJ9fqMSYlLs';

  // Custom holidays that aren't in Google's public calendar
  const customHolidays: Holiday[] = [
    {
      summary: 'Good Friday',
      start: { date: '2026-04-03' },
      end: { date: '2026-04-03' },
    },
  ];

  useEffect(() => {
    if (loading || error) return;

    const holidayDates =
      data?.holiday_dates?.map((date: string) => parseISO(date)) || [];

    // Fetch holidays from Google's public holiday calendar
    fetch(
      `${BASE_CALENDAR_URL}/${CALENDAR_REGION}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}`
    )
      .then((response) => response.json())
      .then(({ items }) => {
        const filteredItems = items.filter(
          ({ summary }) =>
            summary !== 'Columbus Day' &&
            summary !== 'Inauguration Day (regional holiday)'
        );
        const gcalHolidays = filteredItems.map(
          ({ summary, start, end }: Holiday) => ({
            summary,
            start,
            end,
          })
        );

        // Combine Google Calendar holidays with custom holidays
        const allGcalHolidays = [...gcalHolidays, ...customHolidays];

        // Filter and merge holidays
        const mergedHolidays = holidayDates.reduce(
          (acc: Holiday[], date: Date) => {
            const gcalHoliday = allGcalHolidays.find((holiday) =>
              isSameDay(parseISO(holiday.start.date), date)
            );
            if (gcalHoliday) {
              acc.push(gcalHoliday);
            } else {
              acc.push({
                summary: 'Company holiday',
                start: { date: date.toISOString().split('T')[0] },
                end: { date: date.toISOString().split('T')[0] },
              });
            }
            return acc;
          },
          [] as Holiday[]
        );
        mergedHolidays.sort(
          (a, b) =>
            new Date(a.start.date).getTime() - new Date(b.start.date).getTime()
        );

        setHolidays(mergedHolidays);
      });
  }, [loading, error, data]);

  return holidays;
}

export default useFetchHolidays;
