import { timeAgo } from "^lib/timeAgo";

export function ensureTypeReturn<T>(
  argument: T | undefined | null,
  message = "This value was promised to be there."
): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}

export const formatDateTimeAgo = (date: Date) => timeAgo.format(new Date(date));
