import { Article } from "^types/article";
import { Blog } from "^types/blog";
import { Collection, CollectionTranslation } from "^types/collection";
import { RecordedEvent } from "^types/recordedEvent";
import { checkEntityIsValidAsSummary as checkArticleLikeEntityIsValidAsSummary } from "./article-like";
import { fuzzySearch } from "./general";
import { checkEntityIsValidAsSummary as checkRecordedEventIsValidAsSummary } from "./recorded-event";

export const fuzzySearchCollections = (
  query: string,
  collections: Collection[]
) => fuzzySearch(["translations.text"], collections, query).map((f) => f.item);

export const checkIsValidTranslation = (
  translation: CollectionTranslation,
  validLanguageIds: string[]
) => {
  const languageIsValid = validLanguageIds.includes(translation.languageId);
  const isTitle = translation.title?.length;
  const isDescription = translation.description?.length;

  return Boolean(languageIsValid && isTitle && isDescription);
};

export const checkHasValidTranslation = (
  translations: Collection["translations"],
  languageIds: string[]
) => {
  const validTranslation = translations.find((translation) => {
    checkIsValidTranslation(translation, languageIds);
  });

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
