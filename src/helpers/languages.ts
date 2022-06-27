import { Language } from "^types/language";
import { fuzzySearch } from "./general";

export const fuzzySearchLanguages = (query: string, languages: Language[]) =>
  fuzzySearch(["name"], languages, query).map((f) => f.item);
