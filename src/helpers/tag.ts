import { Tag } from "^types/tag";
import { fuzzySearch } from "./general";

export const fuzzySearchTags = (query: string, tags: Tag[]) =>
  fuzzySearch(["text"], tags, query).map((f) => f.item);

export function checkRelatedTagIsValid(tag: Tag) {
  return Boolean(tag.text?.length);
}
