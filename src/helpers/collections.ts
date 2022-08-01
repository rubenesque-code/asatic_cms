import { Collection } from "^types/collection";
import { fuzzySearch } from "./general";

export const fuzzySearchCollections = (
  query: string,
  collections: Collection[]
) => fuzzySearch(["translations.text"], collections, query).map((f) => f.item);
