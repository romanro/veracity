type FormatOptions = {
  locale?: string;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  includeTime?: boolean;
};

/**
 * Formats a JS Date using native Intl.DateTimeFormat
 *
 * @param date - The date to format (Date or string)
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  { locale = 'en-GB', dateStyle = 'medium', timeStyle = 'short', includeTime = false }: FormatOptions = {}
): string {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return '';

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle: includeTime ? timeStyle : undefined,
  }).format(parsedDate);
}
