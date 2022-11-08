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
  validLanguageIds: string[]
) => {
  const validTranslation = translations.find((translation) => {
    checkIsValidTranslation(translation, validLanguageIds);
  });

  return Boolean(validTranslation);
};

export function checkHasValidRelatedPrimaryEntity({
  articleLikeEntities,
  collectionLanguageIds,
  recordedEvents,
}: {
  articleLikeEntities: (Article | Blog)[];
  collectionLanguageIds: string[];
  recordedEvents: RecordedEvent[];
}) {
  const validArticleLikeEntity = articleLikeEntities.find((entity) =>
    checkArticleLikeEntityIsValidAsSummary(entity, collectionLanguageIds)
  );

  const validRecordedEvent = recordedEvents.find((entity) =>
    checkRecordedEventIsValidAsSummary(entity, collectionLanguageIds)
  );

  return Boolean(validArticleLikeEntity || validRecordedEvent);
}
