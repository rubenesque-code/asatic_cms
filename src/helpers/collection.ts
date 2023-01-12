import { fuzzySearch } from "./general";
import { checkEntityIsValidAsSummary as checkArticleLikeEntityIsValidAsSummary } from "./article-like";
import { checkEntityIsValidAsSummary as checkRecordedEventIsValidAsSummary } from "./recorded-event";

import {
  Article,
  Blog,
  Collection,
  CollectionTranslation,
  RecordedEvent,
} from "^types/index";
import { stripHtml } from "string-strip-html";

export const getCollectionSummary = (translation: CollectionTranslation) => {
  const { description, summary } = translation;

  if (summary?.length) {
    return summary;
  }

  if (!description?.length) {
    return null;
  }

  return stripHtml(description).result;
};

export const fuzzySearchCollections = (
  query: string,
  collections: Collection[]
) =>
  fuzzySearch(
    ["translations.title", "translations.description"],
    collections,
    query
  ).map((f) => f.item);

export const checkIsValidTranslation = (
  translation: CollectionTranslation,
  validLanguageIds: string[]
) => {
  const languageIsValid = validLanguageIds.includes(translation.languageId);
  const isTitle = translation.title?.length;
  const isDescription = translation.description?.length;
  const isValid = Boolean(languageIsValid && isTitle && isDescription);

  return isValid;
};

export const checkHasValidTranslation = (
  translations: Collection["translations"],
  languageIds: string[]
) => {
  const validTranslation = translations.find((translation) =>
    checkIsValidTranslation(translation, languageIds)
  );

  return Boolean(validTranslation);
};

export function checkHasValidRelatedPrimaryEntity({
  articleLikeEntities,
  allLanguageIds,
  recordedEvents,
}: {
  articleLikeEntities: (Article | Blog)[];
  allLanguageIds: string[];
  recordedEvents: RecordedEvent[];
}) {
  const validArticleLikeEntity = articleLikeEntities.find((entity) =>
    checkArticleLikeEntityIsValidAsSummary(entity, allLanguageIds)
  );

  const validRecordedEvent = recordedEvents.find((entity) =>
    checkRecordedEventIsValidAsSummary(entity, allLanguageIds)
  );

  return Boolean(validArticleLikeEntity || validRecordedEvent);
}

export function checkRelatedCollectionIsValid(
  collection: Collection,
  allLanguageIds: string[]
) {
  if (collection.publishStatus !== "published") {
    return false;
  }
  const hasValidTranslation = checkHasValidTranslation(
    collection.translations,
    allLanguageIds
  );

  if (!hasValidTranslation) {
    return false;
  }

  return true;
}

export function checkCollectionIsValidAsSummary({
  allLanguageIds,
  articleLikeEntities,
  collection,
  recordedEvents,
}: {
  articleLikeEntities: (Article | Blog)[];
  collection: Collection;
  recordedEvents: RecordedEvent[];
  allLanguageIds: string[];
}) {
  if (collection.publishStatus !== "published") {
    return false;
  }

  if (!collection.bannerImage.imageId) {
    return false;
  }

  if (!checkHasValidTranslation(collection.translations, allLanguageIds)) {
    return false;
  }

  if (
    !checkHasValidRelatedPrimaryEntity({
      articleLikeEntities,
      allLanguageIds,
      recordedEvents,
    })
  ) {
    return false;
  }

  return true;
}
