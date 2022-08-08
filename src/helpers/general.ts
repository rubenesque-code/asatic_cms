import { JSONContent } from "@tiptap/react";
import Fuse from "fuse.js";
import produce from "immer";

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

/**shallow compare that returns items of array1 that are in array2 */
export function arrayConvergence<T extends string>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((value) => arr2.includes(value));
}

export function arrayDivergenceObjWithId<T extends { id: string }>(
  arr1: T[],
  arr2: T[]
) {
  const arr1Ids = mapIds(arr1);
  const arr2Ids = mapIds(arr2);
  const idsDivergence = arrayDivergence(arr1Ids, arr2Ids);
  const arrDivergence = idsDivergence.map((id) =>
    arr1.find((el) => el.id === id)
  ) as T[];

  return arrDivergence;
}
export function arrayConvergenceObjWithId<T extends { id: string }>(
  arr1: T[],
  arr2: T[]
) {
  const arr1Ids = mapIds(arr1);
  const arr2Ids = mapIds(arr2);
  const idsConvergence = arrayConvergence(arr1Ids, arr2Ids);
  const arrConvergence = idsConvergence.map((id) =>
    arr1.find((el) => el.id === id)
  ) as T[];

  return arrConvergence;
}

export function fuzzySearch<A>(
  keys: string[],
  list: A[],
  pattern: string
): Fuse.FuseResult<A>[] {
  const fuse = new Fuse(list, {
    includeScore: true,
    keys,
    minMatchCharLength: pattern.length,
  });

  const searchResult = fuse.search(pattern);

  return searchResult;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function applyFilters<T>(
  initialArr: T[],
  filters: ((arr: T[]) => T[])[]
) {
  let filteredArr = initialArr;

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];

    filteredArr = filter(filteredArr);
  }

  return filteredArr;
}

export const numberToLetter = (number: number) => {
  return String.fromCharCode(97 + number);
};

export const getTextFromJSONContent = (content: JSONContent[]) => {
  const textArr = content
    .flatMap((node) => node?.content)
    .filter((node) => node?.type === "text")
    .map((node) => node?.text);

  return textArr;
};

export function orderSortableComponents<T extends { order: number }>(
  components: T[]
) {
  const reordered = produce(components, (draft) =>
    draft.sort((a, b) => a.order - b.order)
  );

  return reordered;
}
export function orderSortableComponents2<T extends { index: number }>(
  components: T[]
) {
  const reordered = produce(components, (draft) =>
    draft.sort((a, b) => a.index - b.index)
  );

  return reordered;
}

export function checkObjectHasField<T extends Record<string, unknown>>(obj: T) {
  const hasAKey = Object.keys(obj).length;

  return Boolean(hasAKey);
}

export function filterDocsByLanguageId<
  TDoc extends { translations: { languageId: string }[] }
>(docs: TDoc[], languageId: string) {
  return languageId === "_ALL"
    ? docs
    : docs.filter((doc) => {
        const { translations } = doc;
        const docLanguageIds = translations.flatMap((t) => t.languageId);
        const hasLanguage = docLanguageIds.includes(languageId);

        return hasLanguage;
      });
}

export function mapLanguageIds<T extends { languageId: string }>(
  arr: T[]
): string[] {
  return arr.map((a) => a.languageId);
}

export function fuzzySearchWrapper<TContent>(
  content: TContent[],
  query: string,
  fuzzySearchFunc: (query: string, content: TContent[]) => TContent[]
) {
  const validSearch = query.length > 1;
  if (!validSearch) {
    return content;
  }

  const result = fuzzySearchFunc(query, content);

  return result;
}
