const DEFAULT_LOCALE = "en-US";

const shortDateFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const longDateFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const parseDate = (value?: string | Date) => {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

export const formatDateShort = (value?: string | Date, fallback = "Unknown") => {
  const parsed = parseDate(value);
  return parsed ? shortDateFormatter.format(parsed) : fallback;
};

export const formatDateLong = (value?: string | Date, fallback = "Unknown") => {
  const parsed = parseDate(value);
  return parsed ? longDateFormatter.format(parsed) : fallback;
};
