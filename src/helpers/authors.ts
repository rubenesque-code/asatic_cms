import { Author } from "^types/author";
import { fuzzySearch } from "./general";

export const fuzzySearchAuthors = (query: string, authors: Author[]) =>
  fuzzySearch(["translations.name"], authors, query).map((f) => f.item);
