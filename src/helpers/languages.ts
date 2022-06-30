import { Language } from "^types/language";
import { fuzzySearch } from "./general";

export const fuzzySearchLanguages = (query: string, languages: Language[]) =>
  fuzzySearch(["name"], languages, query).map((f) => f.item);

export const checkIsExistingLanguage = (
  value: string,
  languages: Language[]
) => {
  const valueFormatted = value.toLowerCase();
  const languagesFormatted = languages.map((l) => l.name.toLowerCase());

  const isExistingLanguage = languagesFormatted.includes(valueFormatted);

  return isExistingLanguage;
};
