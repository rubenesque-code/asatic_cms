import { fuzzySearch } from "./general";
import { checkEntityIsValidAsSummary as checkArticleLikeEntityIsValidAsSummary } from "./article-like";
import { checkEntityIsValidAsSummary as checkRecordedEventIsValidAsSummary } from "./recorded-event";

import { Article, Blog, Collection, RecordedEvent } from "^types/index";
import { stripHtml } from "string-strip-html";

export const getCollectionSummary = (collection: Collection) => {
  const { description, summary } = collection;

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
) => fuzzySearch(["title"], collections, query).map((f) => f.item);

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

export function checkRelatedCollectionIsValid(collection: Collection) {
  if (collection.publishStatus !== "published") {
    return false;
  }
  const hasTitle = collection.title;

  if (!hasTitle) {
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

  if (!collection.title) {
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
