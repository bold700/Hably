import { format, parse, startOfWeek, endOfWeek } from "date-fns";
import { nl } from "date-fns/locale/nl";

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy", { locale: nl });
  } catch {
    return dateString;
  }
};

export const formatDateShort = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "dd MMM", { locale: nl });
  } catch {
    return dateString;
  }
};

export const formatDateInput = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  } catch {
    return dateString;
  }
};

export const getTodayString = (): string => {
  return format(new Date(), "yyyy-MM-dd");
};

export const getWeekStartEnd = (dateString: string): {
  start: string;
  end: string;
} => {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return {
    start: format(start, "yyyy-MM-dd"),
    end: format(end, "yyyy-MM-dd"),
  };
};

export const getMonthString = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "yyyy-MM");
  } catch {
    return dateString;
  }
};

