import { siteLanguageIds } from "^constants/data";
import { Subject } from "^types/subject";
import { fuzzySearch } from "./general";

export const fuzzySearchSubjects = (query: string, subjects: Subject[]) =>
  fuzzySearch(["translations.text"], subjects, query).map((f) => f.item);

export function checkHasValidSiteTranslations(subject: Subject) {
  const validEngTranslation = subject.translations.find(
    (translation) =>
      translation.languageId === siteLanguageIds.english &&
      translation.name?.length
  );

  const validTamilTranslation = subject.translations.find(
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
  if (!checkHasValidSiteTranslations(subject)) {
    return false;
  }
  return true;
}
