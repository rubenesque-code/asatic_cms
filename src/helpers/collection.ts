import { Collection, CollectionTranslation } from "^types/collection";
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

  return Boolean(languageIsValid && isTitle);
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
