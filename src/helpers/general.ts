import { Dictionary } from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/react";
import Fuse from "fuse.js";
import produce from "immer";
import dateformat from "dateformat";

import { timeAgo } from "^lib/timeAgo";

import { allLanguageId } from "^components/LanguageSelect";
import { TranslationGlobalFields } from "^types/entity-translation";

export const formatDateTimeAgo = (date: Date) => timeAgo.format(date, "round");

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

/**returns items of array1 that aren't in array2 */
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

export function fuzzySearch<A extends { id: string }>(
  keys: string[],
  list: A[],
  pattern: string
): Fuse.FuseResult<A>[] {
  const fuse = new Fuse(list, {
    includeScore: true,
    keys,
    minMatchCharLength: pattern.length < 2 ? 1 : pattern.length < 6 ? 2 : 4,
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

export function processArray<T>(
  initialArr: T[],
  processArrFuncs: ((arr: T[]) => T[])[]
) {
  let processedArr = initialArr;

  for (let i = 0; i < processArrFuncs.length; i++) {
    const processArrFunc = processArrFuncs[i];

    processedArr = processArrFunc(processedArr);
  }

  return processedArr;
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
export function sortComponents<T extends { index: number }>(
  components: T[]
): T[] {
  const reordered = produce(components, (draft) =>
    draft.sort((a, b) => a.index - b.index)
  );

  return reordered;
}

export function checkObjectHasField<T extends Record<string, unknown>>(obj: T) {
  const hasAKey = Object.keys(obj).length;

  return Boolean(hasAKey);
}

export function checkObjectWithArrayFieldsHasValue<
  TObj extends Record<string, unknown[]>
>(obj: TObj) {
  const values = [...Object.values(obj)];

  return Boolean(values.length);
}

export function filterDocsByLanguageId<
  TDoc extends { translations: { languageId: string }[] }
>(docs: TDoc[], languageId: string) {
  return languageId === allLanguageId
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
  const validSearch = query.length > 0;
  if (!validSearch) {
    return content;
  }

  const result = fuzzySearchFunc(query, content);

  return result;
}

export function dicToArr<TEntity extends { id: string }>(
  entities: Dictionary<TEntity>
) {
  return Object.values(entities).flatMap((s) => (s ? [s] : []));
}

export function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const validateEmailString = (email: string): boolean =>
  Boolean(
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  );

export const sortStringsByLookup = (lookup: string, arr: string[]) =>
  produce(arr, (draft) =>
    draft.sort((a, b) => {
      if (a === lookup) {
        return -1;
      } else if (b === lookup) {
        return 1;
      } else {
        return 0;
      }
    })
  );

export function getInactiveTranslationsOfChildEntity<
  TTranslation extends TranslationGlobalFields
>(parentLanguagesIds: string[], childTranslations: TTranslation[]) {
  return arrayDivergence(
    mapLanguageIds(childTranslations),
    parentLanguagesIds
  ).map(
    (languageId) =>
      childTranslations.find(
        (translation) => translation.languageId === languageId
      )!
  );
}

export function formatArticleDate(date: Date) {
  return dateformat(date, "mmmm dS yyyy");
}

export function getRelatedEntitiesIds<
  TRelatedEntity extends {
    type: "article" | "blog" | "collection" | "recorded-event";
    entityId: string;
  }
>(
  relatedEntities: TRelatedEntity[],
  type: "article" | "blog" | "collection" | "recorded-event"
) {
  return relatedEntities
    .filter((relatedEntity) => relatedEntity.type === type)
    .map((relatedEntity) => relatedEntity.entityId);
}
