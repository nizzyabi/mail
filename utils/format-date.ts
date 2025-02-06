import { format, isToday, isThisMonth, differenceInCalendarMonths } from "date-fns";

/**
 *
 * @param date Takes in a date string
 * @returns formatted date
 */
export const formatDate = (date: string) => {
  const dateObj = new Date(date);

  const now = new Date();

  // If it's today, show time
  if (isToday(dateObj)) {
    return format(dateObj, "h:mm a");
  }

  // If it's this month or last month, show "MMM dd" format (e.g., "Feb 06")
  if (isThisMonth(dateObj) || differenceInCalendarMonths(now, dateObj) === 1) {
    return format(dateObj, "MMM dd");
  }

  // If it's beyond last month, show "MM/dd/yy" format
  return format(dateObj, "MM/dd/yy");
};
