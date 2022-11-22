import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectSubjects } from "../subjects";

import { applyFilters, fuzzySearch } from "^helpers/general";
import { filterEntitiesByLanguage } from "./helpers";

import { Subject } from "^types/subject";

export const selectSubjectsByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, filters: { languageId: string; query: string }) =>
      filters,
  ],
  (state, { languageId, query }) => {
    const subjects = selectSubjects(state);

    const filtered = applyFilters(subjects, [
      (subjects) => filterEntitiesByLanguage(subjects, languageId),
      (subjects) => filterSubjectsByQuery(subjects, query),
    ]);

    return filtered;
  }
);

function filterSubjectsByQuery(subjects: Subject[], query: string) {
  if (!query.length) {
    return subjects;
  }

  // * query related entities?
  const queryableSubjects = subjects.map((subject) => {
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
    const entity = subjects.find((entity) => entity.id === entityId)!;

    return entity;
  });

  return entitiesMatchingQuery;
}
