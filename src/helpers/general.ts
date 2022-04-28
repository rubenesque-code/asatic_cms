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

export const formatDateDMYStr = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleDateString("default", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export function mapIds<T extends { id: string }>(arr: T[]): string[] {
  return arr.map((a) => a.id);
}

/**shallow compare that returns items of array1 that aren't in array2 */
export function arrayDivergence<T extends string>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((value) => !arr2.includes(value));
}
