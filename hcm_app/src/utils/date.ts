import { format, isValid, parse, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

type DateInput = string | Date | null | undefined;

export const dateFormats = {
  FULL: 'PPP', // July 4th, 2023
  ISO: 'yyyy-MM-dd', // 2020-07-04
  SHORT: 'MM/dd/yyyy', // 07/04/2020
  WITH_TIME: 'MM/dd/yyyy @ h:mm aaa', // 07/04/2023 @ 12:00 AM
  WITH_WEEKDAY: 'eee MM/dd/yyyy', // Mon 07/04/2023
};

export const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const formatDate = (
  date: DateInput,
  dateFormat: string = 'SHORT',
  applyTimezone: boolean = false
): string => {
  let parsedDate;
  let formatToUse: string;

  try {
    if (typeof date === 'string') {
      // try to parse as ISO 8601 first since our backend uses this format
      parsedDate = parseISO(date);

      // if it's not a valid date, try to parse with the provided format
      if (!isValid(parsedDate)) {
        parsedDate = parse(
          date,
          dateFormats[dateFormat] || dateFormat,
          new Date()
        );
      }
    } else {
      parsedDate = date;
    }

    if (!isValid(parsedDate)) {
      throw new Error('Invalid date');
    }
  } catch (error) {
    return '';
  }

  // Decide which format to use
  formatToUse = dateFormats[dateFormat] || dateFormat;

  if (applyTimezone && parsedDate) {
    return formatInTimeZone(parsedDate, clientTimezone, formatToUse);
  }

  if (parsedDate) {
    return format(parsedDate, formatToUse);
  } else {
    return '';
  }
};
