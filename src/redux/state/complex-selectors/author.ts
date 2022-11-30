import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";

import { applyFilters, fuzzySearch } from "^helpers/general";
import { filterEntitiesByLanguage } from "./helpers";

import { selectAuthors } from "../authors";
import { Author } from "^types/author";

export const selectAuthorsByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, filters: { languageId: string; query: string }) =>
      filters,
  ],
  (state, { languageId, query }) => {
    const authors = selectAuthors(state);

    const filtered = applyFilters(authors, [
      (authors) => filterEntitiesByLanguage(authors, languageId),
      (authors) => filterAuthorsByQuery(authors, query),
    ]);

    return filtered;
  }
);

function filterAuthorsByQuery(authors: Author[], query: string) {
  if (!query.length) {
    return authors;
  }

  const queryableSubjects = authors.map((subject) => {
    const translationNames = subject.translations.flatMap((t) =>
      t.name ? [t.name] : []
    );

    return {
      id: subject.id,
      translationNames,
    };
  });

  const entitiesMatchingQuery = fuzzySearch(
    ["translationNames"],
    queryableSubjects,
    query
  ).map((r) => {
    const entityId = r.item.id;
    const entity = authors.find((entity) => entity.id === entityId)!;

    return entity;
  });

  return entitiesMatchingQuery;
}
