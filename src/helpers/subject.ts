import { fuzzySearch } from "./general";
import { checkEntityIsValidAsSummary as checkArticleLikeEntityIsValidAsSummary } from "./article-like";
import { checkEntityIsValidAsSummary as checkRecordedEventIsValidAsSummary } from "./recorded-event";

import { siteLanguageIds } from "^constants/data";

import {
  Article,
  Blog,
  Collection,
  RecordedEvent,
  Subject,
  SubjectTranslation,
} from "^types/index";
import { checkCollectionIsValidAsSummary } from "./collection";

export const fuzzySearchSubjects = (query: string, subjects: Subject[]) =>
  fuzzySearch(["translations.text"], subjects, query).map((f) => f.item);

export function checkHasValidSiteTranslations(
  translations: Subject["translations"]
) {
  const validEngTranslation = translations.find(
    (translation) =>
      translation.languageId === siteLanguageIds.english &&
      translation.name?.length
  );

  const validTamilTranslation = translations.find(
    (translation) =>
      translation.languageId === siteLanguageIds.tamil &&
      translation.name?.length
  );

  return Boolean(validEngTranslation && validTamilTranslation);
}

export function checkRelatedSubjectIsValid(subject: Subject) {
  if (subject.publishStatus !== "published") {
    return false;
  }
  if (!checkHasValidSiteTranslations(subject.translations)) {
    return false;
  }
  return true;
}

export function checkHasValidRelatedPrimaryEntity({
  articleLikeEntities,
  collections,
  recordedEvents,
  allLanguageIds,
}: {
  articleLikeEntities: (Article | Blog)[];
  collections: Collection[];
  recordedEvents: RecordedEvent[];
  allLanguageIds: string[];
}) {
  const validArticleLikeEntity = articleLikeEntities.find((entity) =>
    checkArticleLikeEntityIsValidAsSummary(entity, allLanguageIds)
  );

  const validRecordedEvent = recordedEvents.find((entity) =>
    checkRecordedEventIsValidAsSummary(entity, allLanguageIds)
  );

  const validCollection = collections.find((collection) =>
    checkCollectionIsValidAsSummary({
      allLanguageIds,
      articleLikeEntities,
      collection,
      recordedEvents,
    })
  );

  return Boolean(
    validArticleLikeEntity || validRecordedEvent || validCollection
  );
}

export const checkIsValidTranslation = (
  translation: SubjectTranslation,
  allLanguageIds: string[]
) => {
  const languageIsValid = allLanguageIds.includes(translation.languageId);
  const isTitle = translation.name?.length;

  return Boolean(languageIsValid && isTitle);
};

export const checkHasValidTranslation = (
  translations: Subject["translations"],
  languageIds: string[]
) => {
  const validTranslation = translations.find((translation) => {
    return checkIsValidTranslation(translation, languageIds);
  });

  return Boolean(validTranslation);
};
