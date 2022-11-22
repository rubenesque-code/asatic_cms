import { Author, AuthorTranslation } from "^types/author";
import { fuzzySearch } from "./general";

export const fuzzySearchAuthors = (query: string, authors: Author[]) =>
  fuzzySearch(["translations.name"], authors, query).map((f) => f.item);

export function checkIsValidTranslation(
  translation: AuthorTranslation,
  validLanguageIds: string[]
) {
  const languageIsValid = validLanguageIds.includes(translation.languageId);
  const isName = translation.name?.length;

  return Boolean(languageIsValid && isName);
}

export const checkHasValidTranslation = (
  translations: Author["translations"],
  languageIds: string[]
) => {
  const validTranslation = translations.find((translation) =>
    checkIsValidTranslation(translation, languageIds)
  );

  return Boolean(validTranslation);
};

export function checkRelatedAuthorIsValid(
  author: Author,
  parentLanguageIds: string[]
) {
  for (let i = 0; i < parentLanguageIds.length; i++) {
    const parentLanguageId = parentLanguageIds[i];

    const authorTranslation = author.translations.find(
      (t) => t.languageId === parentLanguageId
    );

    if (!authorTranslation) {
      return false;
    }

    if (!checkIsValidTranslation(authorTranslation, parentLanguageIds)) {
      return false;
    }

    return true;
  }

  return true;
}
