import { Subject } from "^types/subject";

import { fuzzySearch } from "../general";

export const fuzzySearchSubjects = (query: string, subjects: Subject[]) =>
  fuzzySearch(["title"], subjects, query).map((f) => f.item);
