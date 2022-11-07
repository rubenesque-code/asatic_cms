import { Article } from "^types/article";
import { Blog } from "^types/blog";
import { Collection, CollectionTranslation } from "^types/collection";
import { RecordedEvent } from "^types/recordedEvent";
import {
  checkIsTranslationWithFields,
  checkTranslationHasSummaryText as checkArticleLikeEntityTranslationHasSummaryText,
} from "./article-like";
import { fuzzySearch } from "./general";

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

export const checkContainsValidTranslation = (
  translations: Collection["translations"],
  validLanguageIds: string[]
) => {
  const validTranslation = translations.find((translation) => {
    checkIsValidTranslation(translation, validLanguageIds);
  });

  return Boolean(validTranslation);
};

export function hasRelatedPrimaryEntityWithRequiredFields({
  articleLikeEntities,
  recordedEvents,
}: {
  articleLikeEntities: (Article | Blog)[];
  recordedEvents: RecordedEvent[];
}) {
  // check is published
  const validArticleLikeEntity = articleLikeEntities.find((entity) => {
    const isValidTranslation = checkIsTranslationWithFields(
      entity.translations,
      ["summary", "title"]
    );

    return isValidTranslation;
  });
}
