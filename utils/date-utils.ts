import { format, parse } from "date-fns";

export function isFutureDate(dateString: string): boolean {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  // Convert both dates to CST timezone
  const cstInputDate = new Date(
    inputDate.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
  const cstCurrentDate = new Date(
    currentDate.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );

  cstCurrentDate.setHours(0, 0, 0, 0);
  return cstInputDate > cstCurrentDate;
}

/**
 * Gets the current date in the specified US time zone and format.
 *
 * @param timeZone - The US time zone (e.g., "America/Chicago", "America/Los_Angeles").
 * @param dateFormat - The desired date format (e.g., "MM/dd/yyyy HH:mm:ss").
 * @returns A string representing the formatted date in the given time zone.
 */
export function getTodayDate(
  dateFormat: string,
  timeZone: string = "America/New_York"
): string {
  const now = new Date();

  // Create an options object for formatting.
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  // Use Intl.DateTimeFormat to format the date.
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(now);

  // Map the date parts into an object.
  const dateParts: { [key: string]: string } = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      dateParts[part.type] = part.value;
    }
  });

  // Replace format tokens with the corresponding parts.
  return dateFormat
    .replace("EEEE", dateParts.weekday || "")
    .replace("MM", dateParts.month || "")
    .replace("dd", dateParts.day || "")
    .replace("yyyy", dateParts.year || "")
    .replace("HH", dateParts.hour || "")
    .replace("mm", dateParts.minute || "")
    .replace("ss", dateParts.second || "");
}

export function getFutureDate(
  format: string,
  daysFromToday: number,
  timeZone: string = "America/New_York"
): string {
  const today = new Date();

  // Calculate future date by adding the given number of days
  today.setDate(today.getDate() + daysFromToday);

  // Convert to EST timezone
  const estDate = new Date(
    today.toLocaleString("en-US", { timeZone: timeZone })
  );

  return formatDate(estDate, format);
}

export function getPastDate(
  format: string,
  daysAgo: number,
  timeZone: string = "America/New_York"
): string {
  const today = new Date();

  // Calculate past date by subtracting the given number of days
  today.setDate(today.getDate() - daysAgo);

  // Convert to EST timezone
  const estDate = new Date(
    today.toLocaleString("en-US", { timeZone: timeZone })
  );

  return formatDate(estDate, format);
}

export function getFutureDateWithIsoFormat(
  daysFromToday: number,
  timeZone: string = "America/New_York"
): string {
  const today = new Date();

  // Calculate future date by adding the given number of days
  today.setDate(today.getDate() + daysFromToday);

  // Convert to EST timezone
  const estDate = new Date(
    today.toLocaleString("en-US", { timeZone: timeZone })
  );

  return toIsoDate(estDate);
}

/**
 *
 * @param inputDate Date in dd/MM/yyyy format
 * @returns the date to format MMM dd, yyyy
 */

export function convertDate(inputDate: string): string {
  // Split the input date by "/"
  const [day, month, year] = inputDate.split("/");

  // Define an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Convert to the required format: MMM dd, yyyy
  const formattedDate = `${monthNames[parseInt(month) - 1]} ${parseInt(
    day
  )}, ${year}`;

  return formattedDate;
}

/**
 *
 * @param inputDate Date in dd/MM/yyyy format
 * @returns the date to format MMM dd, yyyy
 */

export function convertDateIntoWeekFormat(inputDate: string): string {
  // Input is in MM/dd/yyyy format
  const [month, day, year] = inputDate.split("/");

  // Create a Date object (months are 0-indexed in JavaScript)
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  // Array of weekday names
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get weekday name
  const dayOfWeek = daysOfWeek[date.getDay()];

  // Return formatted string
  return `${dayOfWeek} (${inputDate})`;
}

export function getMonthName(monthNumber: number) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[monthNumber - 1] || "Invalid month number";
}

export function formatDate(date: Date | string, dateFormat: string): string {
  return format(date, dateFormat);
}

export function formatDateToAnotherFormat(
  dateStr: string,
  currentFormat: string,
  desiredFormat: string
): string {
  const parsedDate = parse(dateStr, currentFormat, new Date());
  return format(parsedDate, desiredFormat);
}

export function toIsoDate(date: Date): string {
  return date.toISOString().split("T")[0]; // yyyy-MM-dd
}

export function getTodaysDateAndTime(): string {
  const today = new Date();

  // Convert to EST timezone
  const estDate = new Date(
    today.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  return format(estDate, "MM/dd/yyyy hh:mm:ss a").toLowerCase();
}

export function isDateAfter(dateStr: string, cutoffDateStr: string): boolean {
  const date = new Date(dateStr);
  const cutoffDate = new Date(cutoffDateStr);

  // Convert both dates to EST timezone
  const estDate = new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const estCutoffDate = new Date(
    cutoffDate.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  return estDate > estCutoffDate;
}

export function isDateBefore(dateStr: string, cutoffDateStr: string): boolean {
  const date = new Date(dateStr);
  const cutoffDate = new Date(cutoffDateStr);

  // Convert both dates to EST timezone
  const estDate = new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const estCutoffDate = new Date(
    cutoffDate.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  return estDate < estCutoffDate;
}
