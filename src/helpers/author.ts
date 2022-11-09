import { Author, AuthorTranslation } from "^types/author";
import { fuzzySearch } from "./general";

export const fuzzySearchAuthors = (query: string, authors: Author[]) =>
  fuzzySearch(["translations.name"], authors, query).map((f) => f.item);

export function checkIsValidTranslation(translation: AuthorTranslation) {
  return Boolean(translation.name?.length);
}

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

    if (!checkIsValidTranslation(authorTranslation)) {
      return false;
    }

    return true;
  }

  return true;
}
